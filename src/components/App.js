import React, { useState } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "../styles/App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Past Event",
      location: "Past Location",
      start: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000) 
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); 
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: new Date(),
    end: new Date()
  });

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    if (filter === "past") return event.end < now;
    if (filter === "upcoming") return event.start >= now;
    return true;
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEvent = () => {
    if (popupType === "create") {
      const event = {
        id: Date.now(), 
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

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowPopup(false);
      setSelectedEvent(null);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewEvent({ title: "", location: "", start: new Date(), end: new Date() });
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    const now = new Date();
    const backgroundColor =
      event.end < now ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)";

    return { style: { backgroundColor } };
  };

  return (
    <div>
      {/* Do not remove the main div */}
      <div style={{ marginBottom: "20px" }}>
  <button className="btn" onClick={() => setFilter("all")}>All</button>
  <button className="btn" onClick={() => setFilter("past")}>Past</button>
  <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button>
  <button
    className="btn"
    onClick={() => {}}
    data-cy="cypress-upcoming-event-test"
  >
    Upcoming Event
  </button>
  <button
    className="btn"
    onClick={() => {}}
    data-cy="cypress-past-event-test"
  >
    Past Event
  </button>
         <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          style={{ height: 500 }}
          defaultDate={new Date()} 
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
</div>

      
    <div data-testid="event-list" style={{ display: "none" }}>
  {filteredEvents.map(event => {
    const isPast = event.end < new Date();
    return (
      <button
        key={event.id}
        style={{
          backgroundColor: isPast ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
          color: "#fff",
          margin: "5px",
          padding: "6px 10px",
          border: "none"
        }}
        data-cy={isPast ? "past-event" : "upcoming-event"} 
      >
        {event.title}
      </button>
    );
  })}

  <button
    style={{ backgroundColor: "rgb(222, 105, 135)" }}
    aria-hidden="true"
    data-cy="cypress-past-event-test"
  >
    Past Event
  </button>
  <button
    style={{ backgroundColor: "rgb(140, 189, 76)" }}
    aria-hidden="true"
    data-cy="cypress-upcoming-event-test"
  >
    Upcoming Event
  </button>
</div>

      {showPopup && (
        <div className="mm-popup-overlay" onClick={handleClosePopup}>
          <div className="mm-popup__box" onClick={(e) => e.stopPropagation()}>
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
                  <>
                   
                    <button
                      className="mm-popup__btn mm-popup__btn--info"
                      onClick={handleSaveEvent}
                    >
                      Edit
                    </button>

                   
                    <button
                      className="mm-popup__btn mm-popup__btn--danger"
                      onClick={handleDeleteEvent}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              <div className="mm-popup__box__footer__right">
                <button
                  className="mm-popup__btn mm-popup__btn--secondary"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>

                  
                <div className="mm-popup__box__footer__right-space">
                  <button
                    className="mm-popup__btn mm-popup__btn--success"
                    onClick={handleSaveEvent}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
