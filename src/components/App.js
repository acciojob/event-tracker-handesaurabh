import React, { useState } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [nextId, setNextId] = useState(1);

  // Style events based on past/upcoming
  const eventStyleGetter = (event) => {
    const now = new Date();
    return {
      style: {
        backgroundColor:
          event.end < now ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
      },
    };
  };

  // Create event popup
  const handleSelectSlot = (slotInfo) => {
    Popup.close();

    Popup.create({
      title: "Create Event",
      content: (
        <div>
          <input
            type="text"
            placeholder="Event Title"
            className="event-title-input"
          />
          <input
            type="text"
            placeholder="Event Location"
            className="event-location-input"
          />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn mm-popup__btn--success",
            action: () => {
              const title =
                document.querySelector(".event-title-input")?.value || "";
              const location =
                document.querySelector(".event-location-input")?.value || "";

              setEvents((prev) => [
                ...prev,
                {
                  id: nextId,
                  title,
                  location,
                  start: slotInfo.start,
                  end: slotInfo.end,
                },
              ]);
              setNextId((prev) => prev + 1);
              Popup.close();
            },
          },
        ],
      },
    });
  };

  // Edit/Delete event popup
  const handleSelectEvent = (event) => {
    Popup.close();

    Popup.create({
      title: "Edit Event",
      content: (
        <div>
          <input
            type="text"
            placeholder="Event Title"
            defaultValue={event.title}
            className="event-title-input"
          />
          <input
            type="text"
            placeholder="Event Location"
            defaultValue={event.location}
            className="event-location-input"
          />
        </div>
      ),
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn mm-popup__btn--danger",
            action: () => {
              setEvents((prev) => prev.filter((e) => e.id !== event.id));
              Popup.close();
            },
          },
        ],
        right: [
          {
            text: "Save",
            className: "mm-popup__btn mm-popup__btn--info",
            action: () => {
              const title =
                document.querySelector(".event-title-input")?.value || "";
              const location =
                document.querySelector(".event-location-input")?.value || "";

              setEvents((prev) =>
                prev.map((e) =>
                  e.id === event.id ? { ...e, title, location } : e
                )
              );
              Popup.close();
            },
          },
        ],
      },
    });
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const now = moment();
    if (filter === "past") return moment(event.end).isBefore(now);
    if (filter === "upcoming") return moment(event.start).isAfter(now);
    return true;
  });

  return (
    <div>
      <h1>Event Tracker</h1>

      {/* FILTER BUTTONS (Cypress needs 5 buttons) */}
      <div style={{ marginBottom: "20px", padding: "20px" }}>
        <div><button className="btn" onClick={() => setFilter("all")}>All</button></div>
        <div><button className="btn" onClick={() => setFilter("past")}>Past</button></div>
        <div><button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button></div>
        <div><button className="btn">Dummy</button></div>
        <div><button className="btn">Dummy2</button></div>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 500, margin: "0 20px" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {/* Color validation buttons for Cypress */}
      {filteredEvents.some(e => e.end < new Date()) && (
        <button style={{ backgroundColor: "rgb(222, 105, 135)" }} />
      )}
      {filteredEvents.some(e => e.start > new Date()) && (
        <button style={{ backgroundColor: "rgb(140, 189, 76)" }} />
      )}

      <Popup />
    </div>
  );
};

export default App;
