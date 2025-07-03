import { useState, useEffect } from "react";
import { getEvents, deleteEvents, createEvent, updateEvent } from "../Context/api";
import { FaHistory, FaEdit, FaTrash } from "react-icons/fa";
import "../Styles/contextStyles.css";
import { DynamicFormModal } from "./FormModal";
import io from "socket.io-client";
import { useAuth } from "../Context/AuthContext";

const filterOptions = ["Today", "Tomorrow", "Week", "Month"];
const socket = io( "http://localhost:3000", {
  path: "/socket.io",
  transports: ["websocket"],
});

const EventContextPanel: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.userID;

  const [showEventFormModal, setShowEventFormModal] = useState<false | "create" | { type: "edit"; data: any }>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState("Today");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await getEvents(currentUserId); 
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    fetchEvents();

    if (currentUserId) {
      socket.emit("join", currentUserId);
    }

    // Real-time listeners
    socket.on("new_event", (newEvent: any) => {
      setEvents((prev) => {
        // Prevent duplicate events
        if (prev.some(e => e.eventId === newEvent.eventId)) return prev;
        return [...prev, newEvent];
      });
    });

    socket.on("event_updated", (updatedEvent: any) => {
      setEvents((prev) =>
        prev.map((event) => (event.eventId === updatedEvent.eventId ? updatedEvent : event))
      );
    });

    socket.on("event_deleted", (deletedEventId: any) => {
      setEvents((prev) => prev.filter((event) => event.eventId !== deletedEventId));
    });

    return () => {
      socket.off("new_event");
      socket.off("event_updated");
      socket.off("event_deleted");
    };
  }, [currentUserId]);

  const handleEventSubmit = async (eventData: any) => {
    try {
      if (showEventFormModal === "create") {
        await createEvent({ ...eventData, userId: currentUserId });
      } else if (showEventFormModal && showEventFormModal.type === "edit") {
        await updateEvent(eventData.eventId, eventData);
      }
    } catch (err) {
      console.error("Event submission failed:", err);
    } finally {
      setShowEventFormModal(false);
    }
  };

  const updateEventTime = async (event: any, minutes: number) => {
    try {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const updatedEvent = {
        ...event,
        startDate: new Date(start.getTime() + minutes * 60000),
        endDate: new Date(end.getTime() + minutes * 60000),
      };
      await updateEvent(event.eventId, updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.eventId === event.eventId ? updatedEvent : e))
      );
    } catch (err) {
      console.error("Failed to update event time", err);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvents(eventId);
      // socket will remove the event from UI
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const renderEvents = (category: string) =>
    events
      .filter((e) => {
        if (category === "upcoming") {
          const eventDate = new Date(e.startTime);
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const diffInMs = eventDate.getTime() - today.getTime();
          const oneDay = 24 * 60 * 60 * 1000;
  
          switch (filters) {
            case "Today":
              return eventDate.toDateString() === today.toDateString();
            case "Tomorrow":
              return eventDate.toDateString() === new Date(today.getTime() + oneDay).toDateString();
            case "Week":
              return diffInMs >= 0 && diffInMs < oneDay * 7;
            case "Month":
              return eventDate.getMonth() === now.getMonth();
            default:
              return true;
          }
        }
        return e.category === category;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) // <-- Sort by startDate ascending
      .map((event) => (
        <div key={event.eventId} className="eventlist-item">
          <div className="eventlist-info">
            <strong>{event.title}</strong>
            <span>{new Date(event.startDate).toLocaleString()}</span>
          </div>
          <div className="eventlist-actions">
            <FaEdit className="event-icon" onClick={() => setShowEventFormModal({ type: "edit", data: event })} />
            <FaTrash className="event-icon" onClick={() => handleDelete(event.eventId)} />
          </div>
        </div>
      ));

  return (
    <>
      <div className="chatlist-header">
        <span>Events</span>
        <div className="chatlist-right-btns">
          <button className="eventlist-history-btn" title="View History">
            <FaHistory />
          </button>
          <div className="chatlist-new-btn" onClick={() => setShowEventFormModal("create")}>
            ＋ New Event
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="eventlist-section-header">
          <h4 className="chatlist-title">
            Upcoming (
            <span
              className="filter-dropdown-trigger"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer", marginLeft: "4px" }}
            >
              {filters}
            </span>
            )
          </h4>
          {showDropdown && (
            <div className="eventlist-dropdown">
              {filterOptions.map((option) => (
                <div
                  key={option}
                  className={`eventlist-dropdown-item ${filters === option ? "selected" : ""}`}
                  onClick={() => {
                    setFilters(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {renderEvents("upcoming")}
      </div>

      {/* Work Events */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="eventlist-section-header">
          <h4 className="chatlist-title">Work</h4>
        </div>
        {renderEvents("work")}
      </div>

      {/* Personal Events */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="eventlist-section-header">
          <h4 className="chatlist-title">Personal</h4>
        </div>
        {renderEvents("personal")}
      </div>

      {showEventFormModal && (
        <DynamicFormModal
          isOpen={!!showEventFormModal}
          type="event"
          onClose={() => setShowEventFormModal(false)}
          onSubmit={handleEventSubmit}
        />
      )}
    </>
  );
};

export default EventContextPanel;