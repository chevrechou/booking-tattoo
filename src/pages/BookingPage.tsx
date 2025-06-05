// src/pages/BookingPage.jsx
import React from "react";

export default function BookingPage() {
  return (
    <div className="container">
      <h1>Book an Appointment</h1>
      <p>Choose a time slot from your favorite artist’s calendar.</p>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {[1, 2, 3].map((artistId) => (
          <div
            key={artistId}
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <h2>Artist #{artistId}</h2>
            <p>Tap a date to book</p>
            <button className="button">Book Slot</button>
          </div>
        ))}
      </div>
    </div>
  );
}
