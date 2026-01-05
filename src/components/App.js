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
        if (!title) return;

        const newEvent = {
            id: Date.now(),
            title,
            start: selectedDate,
            end: moment(selectedDate).add(1, 'hour').toDate()
        };

        setEvents([...events, newEvent]);

        setPopupType(null);
    };

    const saveEditedEvent = () => {
        const newTitle = document.getElementById('editEventTitle').value;
        setEvents(events.map(e =>
            e.id === selectedEvent.id ? { ...e, title: newTitle } : e
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
                <div>
                    <button className="filter-btn" onClick={() => setFilter('All')}>
                        All
                    </button>
                </div>

                <div>
                    <button className="filter-btn" onClick={() => setFilter('Past')}>
                        Past
                    </button>
                </div>

                <div>
                    <button style={{ backgroundColor: 'rgb(140, 189, 76)' }} className="filter-btn" onClick={() => setFilter('Upcoming')}>
                        Upcoming
                    </button>
                </div>

                <div>
                    <button
                        style={{ backgroundColor: 'rgb(222, 105, 135)' }}
                        className="filter-btn"
                        onClick={() => {
                            setSelectedDate(new Date());
                            setPopupType('create');
                            setShowTestBtn(false);
                        }}
                    >
                        Add Event
                    </button>
                </div>

                {showTestBtn && (
                    <div>
                        <button className="btn">
                            {events.length}
                        </button>
                    </div>
                )}



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


            {popupType === 'create' && (
                <div className="mm-popup__box">
                    <div className="mm-popup__box__header">
                        Create Event
                    </div>

                    <div className="mm-popup__box__body">
                        <input id="eventTitle" placeholder="Event Title" />
                        <input id="eventLocation" placeholder="Event Location" />
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
        </div>
    );
}

export default App;
