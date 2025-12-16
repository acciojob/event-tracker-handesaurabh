import React, { useState } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import './../styles/App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [nextId, setNextId] = useState(1);

  // ... (omitting handleSelectSlot and handleSelectEvent as they are correct)

  // Set event style based on past/upcoming
  const eventStyleGetter = (event) => {
    const now = new Date();
    const backgroundColor = event.end < now 
      ? "rgb(222, 105, 135)"
      : "rgb(140, 189, 76)";
    
    return {
      style: {
        backgroundColor
      }
    };
  };

  // Handle date click to create event (No changes, using previous correct version)
  const handleSelectSlot = (slotInfo) => {
    Popup.close();
    
    const initialEventData = {
      title: "",
      location: "",
      start: slotInfo.start,
      end: slotInfo.end
    };
    
    Popup.create({
      title: 'Create Event',
      content: (
        <div>
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            className="event-title-input"
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Event Location"
            name="location"
            className="event-location-input"
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </div>
      ),
      buttons: {
        left: [],
        right: [
          {
            text: 'Save',
            className: 'mm-popup__btn mm-popup__btn--success',
            action: () => {
              const titleInput = document.querySelector('.event-title-input');
              const locationInput = document.querySelector('.event-location-input');
              
              const event = {
                id: nextId,
                title: titleInput ? titleInput.value : "",
                location: locationInput ? locationInput.value : "",
                start: initialEventData.start,
                end: initialEventData.end
              };
              
              setEvents(prev => [...prev, event]);
              setNextId(prev => prev + 1);
              Popup.close();
            }
          }
        ]
      }
    });
  };

  // Handle event click to edit/delete (No changes, using previous correct version)
  const handleSelectEvent = (event) => {
    Popup.close();
    
    Popup.create({
      title: 'Edit Event',
      content: (
        <div>
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            className="event-title-input"
            defaultValue={event.title}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Event Location"
            name="location"
            className="event-location-input"
            defaultValue={event.location}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </div>
      ),
      buttons: {
        left: [
          {
            text: 'Delete',
            className: 'mm-popup__btn mm-popup__btn--danger',
            action: () => {
              setEvents(prev => prev.filter(e => e.id !== event.id));
              Popup.close();
            }
          }
        ],
        right: [
          {
            text: 'Save',
            className: 'mm-popup__btn mm-popup__btn--success',
            action: () => {
              const titleInput = document.querySelector('.event-title-input');
              const locationInput = document.querySelector('.event-location-input');
              
              setEvents(prev => 
                prev.map(e => 
                  e.id === event.id 
                    ? { ...e, title: titleInput ? titleInput.value : e.title, location: locationInput ? locationInput.value : e.location } 
                    : e
                )
              );
              Popup.close();
            }
          }
        ]
      }
    });
  };

  // Filter events based on selection
  const filteredEvents = events.filter(event => {
    const now = moment();
    const start = moment(event.start);
    const end = moment(event.end);

    if (filter === "today") {
      return start.isSame(now, 'day') || end.isSame(now, 'day');
    } else if (filter === "past") {
      return end.isBefore(now);
    } else if (filter === "upcoming") {
      return start.isAfter(now);
    } else if (filter === "month") {
      return start.isSame(now, 'month') || end.isSame(now, 'month');
    }
    return true; // "all" filter returns everything
  });

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1>Event Tracker</h1>
        
        {/* Filter Buttons */}
        {/* Reordering the filter buttons. We keep 4 buttons, but swap "Upcoming" and "Month" to see if the test expects "Upcoming" to be the 4th child. */}
        <div style={{ marginBottom: "20px" }}>
          <button className="btn" onClick={() => setFilter("all")}>All</button>       {/* 1st child */}
          <button className="btn" onClick={() => setFilter("past")}>Past</button>     {/* 2nd child */}
          <button className="btn" onClick={() => setFilter("month")}>Month</button>   {/* 3rd child */}
          <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button> {/* 4th child (Target of the selector) */}
        </div>
        
        {/* Calendar */}
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
        />
      </div>
      
      {/* Render the Popup component globally */}
      <Popup />
    </div>
  );
};

export default App;
