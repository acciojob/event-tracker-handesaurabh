import React, { useState } from "react";
// Import the Calendar component and then access momentLocalizer as its property
import Calendar from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import './../styles/App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create the localizer using the Calendar component's momentLocalizer property
const localizer = Calendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // "create" or "edit"
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: new Date(),
    end: new Date()
  });

  // Filter events based on selection
  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (filter === "past") {
      return event.end < now;
    } else if (filter === "upcoming") {
      return event.start >= now;
    }
    return true;
  });

  // Handle date click to create event
  const handleSelectSlot = (slotInfo) => {
    setNewEvent({
      title: "",
      location: "",
      start: slotInfo.start,
      end: slotInfo.end
    });
    setPopupType("create");
    setShowPopup(true);
  };

  // Handle event click to edit/delete
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      location: event.location,
      start: event.start,
      end: event.end
    });
    setPopupType("edit");
    setShowPopup(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save new event
  const handleSaveEvent = () => {
    if (popupType === "create") {
      const event = {
        id: events.length + 1,
        title: newEvent.title,
        location: newEvent.location,
        start: newEvent.start,
        end: newEvent.end
      };
      setEvents(prev => [...prev, event]);
    } else if (popupType === "edit" && selectedEvent) {
      setEvents(prev => 
        prev.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, title: newEvent.title, location: newEvent.location } 
            : event
        )
      );
    }
    setShowPopup(false);
    setNewEvent({ title: "", location: "", start: new Date(), end: new Date() });
    setSelectedEvent(null);
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowPopup(false);
      setSelectedEvent(null);
    }
  };

  // Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setNewEvent({ title: "", location: "", start: new Date(), end: new Date() });
    setSelectedEvent(null);
  };

  // Set event style based on past/upcoming
  const eventStyleGetter = (event) => {
    const now = new Date();
    const backgroundColor = event.end < now 
      ? "rgb(222, 105, 135)"  // Pink for past events
      : "rgb(140, 189, 76)";  // Green for upcoming events
    
    return {
      style: {
        backgroundColor
      }
    };
  };

  return (
    <div>
      {/* Do not remove the main div */}
      <div style={{ padding: "20px" }}>
        <h1>Event Tracker</h1>
        
        {/* Filter Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button className="btn" onClick={() => setFilter("all")}>All</button>
          <button className="btn" onClick={() => setFilter("past")}>Past</button>
          <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button>
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
      
      {/* Popup for Create/Edit Event */}
      {showPopup && (
        <Popup
          open={showPopup}
          closeOnDocumentClick
          onClose={handleClosePopup}
        >
          <div className="mm-popup__box">
            <div className="mm-popup__box__header">
              {popupType === "create" ? "Create Event" : "Edit Event"}
            </div>
            <div className="mm-popup__box__body">
              <input
                type="text"
                placeholder="Event Title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
              <input
                type="text"
                placeholder="Event Location"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
            </div>
            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__left">
                {popupType === "edit" && (
                  <button 
                    className="mm-popup__btn mm-popup__btn--danger"
                    onClick={handleDeleteEvent}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="mm-popup__box__footer__right">
                <button 
                  className="mm-popup__btn mm-popup__btn--secondary"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button 
                  className="mm-popup__btn mm-popup__btn--success mm-popup__box__footer__right-space"
                  onClick={handleSaveEvent}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default App;
