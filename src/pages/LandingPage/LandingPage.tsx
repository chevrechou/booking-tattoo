// src/pages/LandingPage.tsx
import React, { useState } from "react";
import "./LandingPage.css";
import BookingForm from "../../components/BookingForm";
import CalendarPanel from "../../components/CalendarPanel/CalendarPanel";

type Availability = { [day: number]: boolean };

type Artist = {
  id: string;
  name: string;
  avatar_url: string;
  availability: Availability;
};

export default function LandingPage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  console.log(selectedArtist,'adf','asdfad')
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
          selectedArtist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <BookingForm
          selectedDate={selectedDay ? `${monthName} ${selectedDay}` : undefined}
          artistName={selectedArtist?.name ?? ""}
          onSubmit={(data) => {
            alert("Booking submitted!\n" + JSON.stringify(data, null, 2));
          }}
        />
      </div>
    </div>
  );
}
