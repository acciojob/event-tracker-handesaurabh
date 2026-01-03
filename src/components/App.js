import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../styles/App.css";

const localizer = momentLocalizer(moment);

function App() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('All');
    const [popupType, setPopupType] = useState(null); // 'create', 'edit'

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
        if (title) {
            const newEvent = {
                id: Date.now(),
                title,
                start: selectedDate,
                end: moment(selectedDate).add(1, 'hour').toDate(),
                location
            };
            setEvents([...events, newEvent]);
            setPopupType(null);
        }
    };

    const saveEditedEvent = () => {
        const newTitle = document.getElementById('editEventTitle').value;
        setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, title: newTitle } : e));
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
        const now = new Date();
        const isPast = moment(event.start).isBefore(now);
        return {
            style: {
                backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
                borderRadius: '0px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="App">
            <div className="filter-buttons">
                <button className="btn" onClick={() => setFilter('All')}>All</button>
                <button className="btn" onClick={() => setFilter('Past')}>Past</button>
                <button className="btn" onClick={() => setFilter('Upcoming')}>Upcoming</button>
            </div>
            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={handleSelectSlot}
                selectable
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
            />

            {popupType && <div className="mm-popup__overlay" onClick={() => setPopupType(null)}></div>}

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
                            <button className="mm-popup__btn" onClick={saveNewEvent}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {popupType === 'edit' && (
                <div className="mm-popup__box">
                    <div className="mm-popup__box__header">
                        Edit Event
                    </div>
                    <div className="mm-popup__box__body">
                        <input id="editEventTitle" defaultValue={selectedEvent.title} />
                    </div>
                    <div className="mm-popup__box__footer">
                        <div className="mm-popup__box__footer__right-space">
                            <button className="mm-popup__btn" onClick={saveEditedEvent}>Save</button>
                        </div>
                        <button className="mm-popup__btn--danger" onClick={deleteEvent}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
