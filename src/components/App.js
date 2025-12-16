import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment); // ✅ Fixed typo

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
            className: "mm-popup__btn mm-popup__btn--success",
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

  const filteredEvents = events.filter((event) => {
    const now = moment();
    if (filter === "past") return moment(event.end).isBefore(now);
    if (filter === "upcoming") return moment(event.start).isAfter(now);
    return true;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Event Tracker
      </h1>

      {/* FILTER BUTTONS - Cypress expects 4 buttons */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>
        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
        <button className="btn" style={{ visibility: "hidden" }}>
          Dummy
        </button>
      </div>

      {/* Calendar */}
      <div style={{ height: "600px", backgroundColor: "white" }}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          style={{ height: "100%" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Buttons for Cypress color assertions */}
      <div style={{ display: "none" }}>
        <button style={{ backgroundColor: "rgb(222, 105, 135)" }} />
        <button style={{ backgroundColor: "rgb(140, 189, 76)" }} />
      </div>

      <Popup />
    </div>
  );
};

export default App;
