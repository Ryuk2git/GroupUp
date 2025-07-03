import React, { useState, useRef, useEffect } from "react";
import { getFriends } from "../Context/api";
import "../Styles/formModalStyles.css";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "event" | "group" | "task";
  onSubmit: (data: any) => void;
}

const useCloseOnOutsideOrEsc = (ref: React.RefObject<HTMLDivElement | null>, onClose: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && ref.current.contains && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, ref]);
};

export const DynamicFormModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useCloseOnOutsideOrEsc(ref, onClose);

  // Shared state
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<{ userId: string; username: string }[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Form states
  const [eventData, setEventData] = useState({
    location: "",
    title: "",
    description: "",
    start: "",
    end: "",
    category: "work",
    members: [] as string[],
  });
  const [groupData, setGroupData] = useState({
    groupName: "",
    description: "",
    members: [] as string[],
  });
  const [taskData, setTaskData] = useState({
    title: "",
    details: "",
    priority: "medium",
    description: "",
    dueDate: "",
    status: "todo",
    assignedTo: [] as string[],
  });

  // Step-wise state for event form
  const [eventStep, setEventStep] = useState(0);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Reset step when modal opens/closes or type changes
  useEffect(() => {
    if (isOpen && type === "event") setEventStep(0);
  }, [isOpen, type]);

  useEffect(() => {
    if (type === "event" || type === "group" || type === "task") {
      setLoadingFriends(true);
      getFriends()
        .then((data) => {
          let arr: { userId: string; username: string }[] = [];
          if (Array.isArray(data)) arr = data;
          else if (data && Array.isArray(data.friends)) arr = data.friends;
          setFriends(arr);
          const map: Record<string, string> = {};
          arr.forEach((f) => {
            map[f.userId] = f.username;
          });
          setUserMap(map);
          setLoadingFriends(false);
        })
        .catch(() => setLoadingFriends(false));
    }
  }, [isOpen, type]);

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (userId: string, formType: "event" | "group") => {
    if (formType === "event") {
      if (!eventData.members.includes(userId)) {
        setEventData({ ...eventData, members: [...eventData.members, userId] });
      }
    } else {
      if (!groupData.members.includes(userId)) {
        setGroupData({ ...groupData, members: [...groupData.members, userId] });
      }
    }
    setSearchTerm("");
  };

  const handleRemoveMember = (userId: string, formType: "event" | "group") => {
    if (formType === "event") {
      setEventData({ ...eventData, members: eventData.members.filter((id) => id !== userId) });
    } else {
      setGroupData({ ...groupData, members: groupData.members.filter((id) => id !== userId) });
    }
  };

  const handleSubmit = () => {
    if (type === "event") {
      onSubmit({ ...eventData, sharedWith: eventData.members });
      setEventData({
        location: "",
        title: "",
        description: "",
        start: "",
        end: "",
        category: "work",
        members: [],
      });
    } else if (type === "group") {
      onSubmit({ ...groupData, members: groupData.members });
      setGroupData({
        groupName: "",
        description: "",
        members: [],
      });
    } else if (type === "task") {
      onSubmit({ ...taskData });
      setTaskData({
        title: "",
        details: "",
        priority: "medium",
        description: "",
        dueDate: "",
        status: "todo",
        assignedTo: [],
      });
    }
    setSearchTerm("");
    onClose();
  };

  // Step navigation helpers
  const handleNext = () => setEventStep((prev) => Math.min(prev + 1, 2));
  const handleBack = () => setEventStep((prev) => Math.max(prev - 1, 0));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={ref} className="modal-box fade-in">
        {type === "event" && (
          <>
            <h2>Create Event</h2>
            {eventStep === 0 && (
              <>
                <h2>Location Information</h2>
                <label htmlFor="location">Event Location (Link, Reference, or Address)</label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. https://meet.link or 123 Street Name"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
                <div className="modal-actions">
                  <button onClick={onClose}>Cancel</button>
                  <button onClick={handleNext} disabled={!eventData.location}>Next</button>
                </div>
              </>
            )}

            {eventStep === 1 && (
              <>
                <h2>Event Details</h2>
                <label htmlFor="title">Event Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Team Sync"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="What's this event about?"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />

                <div className="date-time-group">
                  <div>
                    <label htmlFor="start">Start Date & Time</label>
                    <input
                      id="start"
                      type="datetime-local"
                      value={eventData.start}
                      onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="end">End Date & Time</label>
                    <input
                      id="end"
                      type="datetime-local"
                      value={eventData.end}
                      onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                    />
                  </div>
                </div>

                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={eventData.category}
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>

                <label>Add Members</label>
                <input
                  type="text"
                  placeholder={loadingFriends ? "Loading friends..." : "Search and add members"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loadingFriends}
                />
                {searchTerm && (
                  <div className="dropdown-scroll">
                    {filteredFriends.length === 0 && !loadingFriends && (
                      <div className="dropdown-item">No friends found</div>
                    )}
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.userId}
                        className="dropdown-item"
                        onClick={() => handleAddMember(friend.userId, "event")}
                      >
                        {friend.username}
                      </div>
                    ))}
                  </div>
                )}

                <div className="selected-members">
                  {eventData.members.map((userId) => (
                    <span key={userId} className="member-tag">
                      {userMap[userId] || userId}
                    </span>
                  ))}
                </div>
                <div className="modal-actions">
                  <button onClick={handleBack}>Back</button>
                  <button
                    onClick={handleNext}
                    disabled={
                      !eventData.title ||
                      !eventData.start ||
                      !eventData.end
                    }
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {eventStep === 2 && (
              <>
                <h2>Review Your Event</h2>
                <div className="review-section">
                  <div className="review-item"><label>Title:</label><span>{eventData.title}</span></div>
                  <div className="review-item"><label>Description:</label><span>{eventData.description}</span></div>
                  <div className="review-item"><label>Location:</label><span>{eventData.location}</span></div>
                  <div className="review-item"><label>Start:</label><span>{formatDateTime(eventData.start)}</span></div>
                  <div className="review-item"><label>End:</label><span>{formatDateTime(eventData.end)}</span></div>
                  <div className="review-item"><label>Category:</label><span>{eventData.category}</span></div>
                  <div className="review-item">
                    <label>Members:</label>
                    <span>{eventData.members.map((id) => userMap[id] || id).join(", ")}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleBack}>Back</button>
                  <button onClick={handleSubmit}>Create</button>
                </div>
              </>
            )}
          </>
        )}

        {type === "group" && (
          <>
            <h3>Create Group</h3>
            <label>Group Name</label>
            <input
              type="text"
              placeholder="Group name"
              value={groupData.groupName}
              onChange={(e) => setGroupData({ ...groupData, groupName: e.target.value })}
            />
            <label>Description</label>
            <textarea
              placeholder="Describe your group"
              value={groupData.description}
              onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
            />
            <label>Add Members</label>
            <input
              type="text"
              placeholder={loadingFriends ? "Loading friends..." : "Search and add members"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loadingFriends}
            />
            {searchTerm && (
              <div className="dropdown-scroll">
                {filteredFriends.length === 0 && !loadingFriends && (
                  <div className="dropdown-item">No friends found</div>
                )}
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.userId}
                    className="dropdown-item"
                    onClick={() => handleAddMember(friend.userId, "group")}
                  >
                    {friend.username}
                  </div>
                ))}
              </div>
            )}
            <div className="selected-members">
              {groupData.members.map((userId) => (
                <span key={userId} className="member-tag">
                  {userMap[userId] || userId}
                  <button
                    type="button"
                    className="remove-member-btn"
                    onClick={() => handleRemoveMember(userId, "group")}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSubmit} disabled={!groupData.groupName || groupData.members.length === 0}>
                Create
              </button>
            </div>
          </>
        )}

        {type === "task" && (
          <>
            <h3>Add Task</h3>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            <label>Task Description</label>
            <textarea
              placeholder="Task description"
              value={taskData.description || ""}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
            <label>Due Date</label>
            <input
              type="date"
              value={taskData.dueDate ? taskData.dueDate.substring(0, 10) : ""}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
            <label>Priority</label>
            <select
              value={taskData.priority || "medium"}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <label>Assign To</label>
            <input
              type="text"
              placeholder={loadingFriends ? "Loading friends..." : "Search and add members"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loadingFriends}
            />
            {searchTerm && (
              <div className="dropdown-scroll">
                {filteredFriends.length === 0 && !loadingFriends && (
                  <div className="dropdown-item">No friends found</div>
                )}
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.userId}
                    className="dropdown-item"
                    onClick={() => {
                      if (!taskData.assignedTo?.includes(friend.userId)) {
                        setTaskData({
                          ...taskData,
                          assignedTo: [...(taskData.assignedTo || []), friend.userId],
                        });
                      }
                      setSearchTerm("");
                    }}
                  >
                    {friend.username}
                  </div>
                ))}
              </div>
            )}
            <div className="selected-members">
              {(taskData.assignedTo || []).map((userId: string) => (
                <span key={userId} className="member-tag">
                  {userMap[userId] || userId}
                  <button
                    type="button"
                    className="remove-member-btn"
                    onClick={() =>
                      setTaskData({
                        ...taskData,
                        assignedTo: (taskData.assignedTo || []).filter((id: string) => id !== userId),
                      })
                    }
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSubmit}>Create</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
