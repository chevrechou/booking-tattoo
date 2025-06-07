// src/pages/LandingPage.tsx
import React, { useState } from "react";
import "./LandingPage.css";
import BookingForm from "../../components/BookingForm/BookingForm";
import CalendarPanel from "../../components/CalendarPanel/CalendarPanel";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Availability = { [day: number]: boolean };

type Artist = {
  id: string;
  name: string;
  avatar_url: string;
  availability?: Availability;
};

export default function LandingPage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const navigate = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  const handleBookingSubmit = async (formData: {
    name: string;
    email: string;
    idea: string;
    paymentMethod: string;
    confirmationCode: string;
  }) => {
    if (!selectedArtist || !selectedDay) {
      toast.error("Please select an artist and date.");
      return;
    }

    const bookingDate = new Date(year, month, selectedDay).toISOString().split("T")[0];

    // Check for duplicate booking
    const { data: existing, error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", formData.email)
      .eq("artist_id", selectedArtist.id)
      .eq("date", bookingDate);

    if (checkError) {
      toast.error("Error checking existing bookings: " + checkError.message);
      return;
    }

    if (existing && existing.length > 0) {
      toast.error("You already booked this artist on that day.");
      return;
    }

    // Insert new booking
    const { error } = await supabase.from("bookings").insert({
      artist_id: selectedArtist.id,
      artist_name: selectedArtist.name,
      date: bookingDate,
      customer_name: formData.name,
      email: formData.email,
      idea: formData.idea,
      payment_method: formData.paymentMethod,
      confirmation_code: formData.confirmationCode,
    });

    if (error) {
      toast.error("Booking failed: " + error.message);
    } else {
      toast.success("Booking confirmed!");
    }
  };

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
          onSubmit={handleBookingSubmit}
        />
      </div>
    </div>
  );
}
