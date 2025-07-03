import React, { useEffect, useState, useRef } from 'react';
import '../Styles/eventAreaStyles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IEvent, useGlobalContext } from '../Context/GlobalProvider';
import { getEvents, deleteEvents, updateEvent } from '../Context/api';

interface EventCardProps {
    event: IEvent;
    onClick: () => void;
    isSelected: boolean;
}

const EventsArea: React.FC = () => {
    const { events, setEvents, selectedEvent, setSelectedEvent } = useGlobalContext();
    const [isRightColumnOpen, setIsRightColumnOpen] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState<"work" | "personal" | "shared" | null>("work");

    const workRef = useRef<HTMLDivElement>(null);
    const personalRef = useRef<HTMLDivElement>(null);
    const sharedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [setEvents]);

    useEffect(() => {
        const containers = [workRef.current, personalRef.current, sharedRef.current];
        // Store listeners so we can remove them later
        const listeners: ((e: WheelEvent) => void)[] = [];

        containers.forEach(container => {
            if (container) {
                const onWheel = (e: WheelEvent) => {
                    if (e.deltaY !== 0) {
                        e.preventDefault();
                        container.scrollLeft += e.deltaY;
                    }
                };
                listeners.push(onWheel);
                container.addEventListener("wheel", onWheel, { passive: false });
            } else {
                listeners.push(() => {});
            }
        });

        // Cleanup: remove the event listeners
        return () => {
            containers.forEach((container, i) => {
                if (container && listeners[i]) {
                    container.removeEventListener("wheel", listeners[i]);
                }
            });
        };
    }, []);

    // Filter events for the right column
    const filteredEvents = events.filter(event =>
        new Date(event.startDate).toDateString() === selectedDate.toDateString()
    );

    // Categorize and sort events for left column
    const workEvents = events
        .filter(event => event.category === 'work')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const personalEvents = events
        .filter(event => event.category === 'personal')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const sharedEvents = events
        .filter(event => event.category === 'shared')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="event-events-container">
            <div className="event-main-column">
                {/* Work Section */}
                <section className="event-category-section">
                    <div
                        className="event-category-title"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setOpenSection(openSection === "work" ? null : "work")}
                    >
                        <span style={{ marginRight: 8 }}>
                            {openSection === "work" ? "▼" : "▶"}
                        </span>
                        Work
                    </div>
                    {openSection === "work" && (
                        <div className="event-cards-container" ref={workRef}>
                            {workEvents.map(event => (
                                <EventCard
                                    key={event.eventId}
                                    event={event}
                                    onClick={() => setSelectedEvent(event)}
                                    isSelected={selectedEvent?.eventId === event.eventId}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Personal Section */}
                <section className="event-category-section">
                    <div
                        className="event-category-title"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setOpenSection(openSection === "personal" ? null : "personal")}
                    >
                        <span style={{ marginRight: 8 }}>
                            {openSection === "personal" ? "▼" : "▶"}
                        </span>
                        Personal
                    </div>
                    {openSection === "personal" && (
                        <div className="event-cards-container" ref={personalRef}>
                            {personalEvents.map(event => (
                                <EventCard
                                    key={event.eventId}
                                    event={event}
                                    onClick={() => setSelectedEvent(event)}
                                    isSelected={selectedEvent?.eventId === event.eventId}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Shared Section */}
                <section className="event-category-section">
                    <div
                        className="event-category-title"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => setOpenSection(openSection === "shared" ? null : "shared")}
                    >
                        <span style={{ marginRight: 8 }}>
                            {openSection === "shared" ? "▼" : "▶"}
                        </span>
                        Shared
                    </div>
                    {openSection === "shared" && (
                        <div className="event-cards-container" ref={sharedRef}>
                            {sharedEvents.map(event => (
                                <EventCard
                                    key={event.eventId}
                                    event={event}
                                    onClick={() => setSelectedEvent(event)}
                                    isSelected={selectedEvent?.eventId === event.eventId}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className={`event-right-column ${isRightColumnOpen ? 'open' : 'closed'}`}>
                <button
                    className="event-toggle-column-btn"
                    onClick={() => setIsRightColumnOpen(!isRightColumnOpen)}
                >
                    {isRightColumnOpen ? '◀' : '▶'}
                </button>

                <div className="event-calendar-container">
                    <DatePicker
                        inline
                        selected={selectedDate}
                        onChange={(date: Date | null) => date && setSelectedDate(date)}
                    />
                </div>

                <div className="event-daily-events">
                    <h3>Events on {selectedDate.toLocaleDateString()}</h3>
                    <div className="event-events-list">
                        {filteredEvents.map(event => (
                            <div
                                key={event.eventId}
                                className="event-event-item"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="event-event-time">
                                    {new Date(event.startDate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="event-event-title">{event.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick, isSelected }) => {
    const { events, setEvents } = useGlobalContext();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPastEvent = new Date(event.endDate) < new Date();

    const updateEventTime = async (minutes: number) => {
        try {
            const updatedStart = new Date(event.startDate).getTime() + minutes * 60000;
            const updatedEnd = new Date(event.endDate).getTime() + minutes * 60000;

            const updatedData = {
                ...event,
                startDate: new Date(updatedStart),
                endDate: new Date(updatedEnd),
            };
            await updateEvent(event.eventId, updatedData);
            const updatedEvents = events.map((e) =>
                e.eventId === event.eventId ? { ...e, ...updatedData } : e
            );
            setEvents(updatedEvents);
        } catch (err) {
            console.error('Failed to update event time:', err);
        }
    };

    const deleteEvent = async () => {
        try {
            await deleteEvents(event.eventId); 
            const updatedEvents = events.filter(e => e.eventId !== event.eventId);
            setEvents(updatedEvents);
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    return (
        <div
            className={`event-card ${isSelected ? 'selected' : ''} ${isPastEvent ? 'event-past-card' : ''}`}
            onClick={onClick}
        >
            <h2 className="event-event-heading">{event.title}</h2>
            <div className="event-created-by">Created by: {event.createdByUserName}</div>

            {event.description && (
                <p className="event-event-description">{event.description}</p>
            )}

            <div className="event-time-section">
                <div className="event-time-label">Start Date</div>
                <div className="event-time-value">{formatDate(event.startDate)}</div>

                <div className="event-time-label" style={{ marginTop: '0.5rem' }}>End Date</div>
                <div className="event-time-value">{formatDate(event.endDate)}</div>
            </div>

            {event.members.length > 0 && (
                <div className="event-mentioned-section">
                    <div className="event-mentioned-label">Participants:</div>
                    <div className="event-mentioned-people">
                        {event.memberUserNames.map((member: string, index: number) => (
                            <span key={index} className="event-person-tag">@{member}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="event-action-buttons">
                <button className="event-btn event-prepone" onClick={(e) => { e.stopPropagation(); updateEventTime(-15); }}>Prepone</button>
                <button className="event-btn event-snooze" onClick={(e) => { e.stopPropagation(); updateEventTime(10); }}>Snooze</button>
                <button className="event-btn event-postpone" onClick={(e) => { e.stopPropagation(); updateEventTime(15); }}>Postpone</button>
            </div>

            <button
                className="event-btn event-delete-btn"
                onClick={(e) => { e.stopPropagation(); deleteEvent(); }}
            >
                Delete Event
            </button>
        </div>
    );
};


export default EventsArea;