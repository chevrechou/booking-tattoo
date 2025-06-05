// src/pages/LandingPage.tsx
import React, { useState } from "react";
import "./LandingPage.css";
import BookingForm from "../../components/BookingForm";

type Availability = { [day: number]: boolean };

type Artist = {
  id: number;
  name: string;
  avatar: string;
  availability: Availability;
};

const artists: Artist[] = [
  {
    id: 1,
    name: "Jinky",
    avatar: "https://i.pravatar.cc/40?img=1",
    availability: { 3: true, 12: true, 17: true, 23: true },
  },
  {
    id: 2,
    name: "Tony",
    avatar: "https://i.pravatar.cc/40?img=2",
    availability: { 6: true, 10: true, 14: true, 28: true },
  },
  {
    id: 3,
    name: "Mia",
    avatar: "https://i.pravatar.cc/40?img=3",
    availability: { 1: true, 5: true, 15: true, 29: true },
  },
  {
    id: 4,
    name: "Leo",
    avatar: "https://i.pravatar.cc/40?img=4",
    availability: { 4: true, 8: true, 13: true, 22: true },
  },
  {
    id: 5,
    name: "Sophia",
    avatar: "https://i.pravatar.cc/40?img=5",
    availability: { 2: true, 9: true, 19: true, 26: true },
  },
  {
    id: 6,
    name: "Louis",
    avatar: "https://i.pravatar.cc/40?img=6",
    availability: { 2: true, 9: true, 19: true, 26: true },
  },
  {
    id: 7,
    name: "Mick",
    avatar: "https://i.pravatar.cc/40?img=7",
    availability: { 2: true, 9: true, 19: true, 26: true },
  }, {
    id: 8,
    name: "Ben",
    avatar: "https://i.pravatar.cc/40?img=8",
    availability: { 2: true, 9: true, 19: true, 26: true },
  },
];

export default function LandingPage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist>(artists[0]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth(); // 0-based
  const monthName = today.toLocaleString("default", { month: "long" });
  const numDays = new Date(year, monthIndex + 1, 0).getDate();

  return (
    <div className="landing-container">
      <div className="cta-header">
        <h1 className="cta-title">InkBook</h1>
        <p className="cta-subtext">
          Discover trusted tattoo artists, view real-time availability, and book your session instantly — all in one place.
        </p>
      </div>

      <div className="booking-layout">
        {/* Left Panel */}
        <div className="booking-panel">
          <div className="artist-list">
            {artists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  setSelectedArtist(artist);
                  setSelectedDay(null);
                }}
                className={`artist-item ${selectedArtist.id === artist.id ? "selected" : ""}`}
              >
                <img src={artist.avatar} alt={artist.name} className="artist-avatar" />
                <strong>{artist.name}</strong>
              </div>
            ))}
          </div>

          <div className="calendar">
            <h2>{`${monthName} ${year}`}</h2>
            <div className="calendar-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d} className="calendar-day-label">{d}</div>
              ))}
              {Array.from({ length: numDays }, (_, i) => {
                const day = i + 1;
                const isAvailable = selectedArtist.availability[day];
                const isToday = day === today.getDate();
                const isSelected = day === selectedDay;

                return (
                  <div
                    key={day}
                    className={`calendar-day ${isAvailable ? "available" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""}`}
                    onClick={() => isAvailable && setSelectedDay(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}

        <BookingForm
          selectedDate={selectedDay ? `${monthName} ${selectedDay}` : undefined}
          artistName={selectedArtist.name}
          onSubmit={(data) => {
            alert("Booking submitted!\n" + JSON.stringify(data, null, 2));
          }}
        />
        {/* )} */}
      </div>
    </div>
  );

}
