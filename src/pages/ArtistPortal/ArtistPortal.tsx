import React, { useState } from "react";
import "./ArtistPortal.css";

export default function ArtistPortal() {
  const today = new Date();
  const currentDay = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });

  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggleDay = (day: number) => {
    setConfirmed(false); // reset confirmation
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const confirmAvailability = () => {
    setConfirmed(true);
  };

  return (
    <div className="artist-container">
      <h2 className="artist-heading">
        Select Your Available Days – {monthName}
      </h2>
      <div className="calendar-grid">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const isPast = day < currentDay;
          const isSelected = availableDays.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`day-button ${isSelected ? "selected" : ""} ${
                isPast ? "disabled" : ""
              }`}
              disabled={isPast}
            >
              {day}
            </button>
          );
        })}
      </div>

      {availableDays.length > 0 && (
        <div className="confirmation-box">
          <p>Selected Days: {availableDays.join(", ")}</p>
          <button className="confirm-btn" onClick={confirmAvailability}>
            Confirm Availability
          </button>
          {confirmed && (
            <p className="confirmation-message">✅ Availability saved successfully!</p>
          )}
        </div>
      )}
    </div>
  );
}
