// src/pages/LandingPage.tsx
import React, { useState } from "react";
import "./LandingPage.css";
import BookingForm from "../../components/BookingForm";
import CalendarPanel from "../../components/CalendarPanel/CalendarPanel";

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
  },
  {
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
  const monthName = today.toLocaleString("default", { month: "long" });

  return (
    <div className="landing-container">
      <div className="cta-header">
        <h1 className="cta-title">InkBook</h1>
        <p className="cta-subtext">
          Discover trusted tattoo artists, view real-time availability, and book your session instantly — all in one place.
        </p>
      </div>

      <div className="booking-layout">
        <CalendarPanel
          artists={artists}
          selectedArtist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <BookingForm
          selectedDate={selectedDay ? `${monthName} ${selectedDay}` : undefined}
          artistName={selectedArtist.name}
          onSubmit={(data) => {
            alert("Booking submitted!\n" + JSON.stringify(data, null, 2));
          }}
        />
      </div>
    </div>
  );
}
