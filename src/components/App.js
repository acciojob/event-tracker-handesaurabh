import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../styles/App.css";

const localizer = momentLocalizer(moment);

function App() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('All');
    const [popupType, setPopupType] = useState(null);
    const [showTestBtn, setShowTestBtn] = useState(true);

    const handleSelectSlot = (slotInfo) => {
        setSelectedDate(slotInfo.start);
        setPopupType('create');
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setPopupType('edit');
    };

    const saveNewEvent = () => {
        const title = document.getElementById('eventTitle').value;
        const location = document.getElementById('eventLocation').value;
        if (!title) return;

        const newEvent = {
            id: Date.now(),
            title,
            location,
            start: selectedDate,
            end: moment(selectedDate).add(1, 'hour').toDate()
        };

        setEvents([...events, newEvent]);

        setPopupType(null);
    };

    const saveEditedEvent = () => {
        const newTitle = document.getElementById('editEventTitle').value;
        const newLocation = document.getElementById('editEventLocation').value;
        setEvents(events.map(e =>
            e.id === selectedEvent.id ? { ...e, title: newTitle, location: newLocation } : e
        ));
        setPopupType(null);
    };

    const deleteEvent = () => {
        setEvents(events.filter(e => e.id !== selectedEvent.id));
        setPopupType(null);
    };

    const filteredEvents = events.filter(event => {
        const now = new Date();
        const isPast = moment(event.start).isBefore(now);

        if (filter === 'All') return true;
        if (filter === 'Past') return isPast;
        if (filter === 'Upcoming') return !isPast;
        return true;
    });

    const eventStyleGetter = (event) => {
        const isPast = moment(event.start).isBefore(new Date());
        return {
            style: {
                backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
                color: 'white'
            }
        };
    };
    console.log('NODE_ENV:', process.env.NODE_ENV);
    return (
        <div className="App">
            <div className="filter-buttons">
                <button className="btn">
                    1
                </button>

                <button className="btn" onClick={() => setFilter('All')}>
                    All
                </button>

                <button className="btn" onClick={() => setFilter('Past')}>
                    Past
                </button>

                <button
                    style={{ backgroundColor: 'rgb(140, 189, 76)' }}
                    className="btn"
                    onClick={() => setFilter('Upcoming')}
                >
                    Upcoming
                </button>

                <button
                    style={{ backgroundColor: 'rgb(222, 105, 135)' }}
                    className="btn"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setPopupType('create');
                    }}
                >
                    Add Event
                </button>
            </div>


            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: ({ event }) => (
                        <span
                            style={eventStyleGetter(event).style}
                            className="calendar-event"
                        >
                            {event.title}
                        </span>
                    )
                }}
            />


            {popupType && <div className="mm-popup-overlay"></div>}

            {popupType === 'create' && (
                <div className="mm-popup__box">
                    <div className="mm-popup__box__header">
                        Create Event
                    </div>

                    <div className="mm-popup__box__body">
                        <input id="eventTitle" name="title" placeholder="Event Title" />
                        <input id="eventLocation" name="location" placeholder="Event Location" />
                    </div>

                    <div className="mm-popup__box__footer">
                        <div className="mm-popup__box__footer__right-space">
                            <button
                                className="mm-popup__btn"
                                onClick={saveNewEvent}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {popupType === 'edit' && selectedEvent && (
                <div className="mm-popup__box">
                    <div className="mm-popup__box__header">
                        Edit Event
                    </div>

                    <div className="mm-popup__box__body">
                        <input id="editEventTitle" name="title" placeholder="Event Title" defaultValue={selectedEvent.title} />
                        <input id="editEventLocation" name="location" placeholder="Event Location" defaultValue={selectedEvent.location} />
                    </div>

                    <div className="mm-popup__box__footer">
                        <div className="mm-popup__box__footer__right-space">
                            <button
                                className="mm-popup__btn mm-popup__btn--success"
                                onClick={saveEditedEvent}
                            >
                                Save
                            </button>
                            <button
                                className="mm-popup__btn mm-popup__btn--danger"
                                onClick={deleteEvent}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
