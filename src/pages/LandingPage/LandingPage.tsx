// src/pages/LandingPage.tsx
import React, { useState } from "react";
import "./LandingPage.css";
import BookingForm, { BookingData } from "../../components/BookingForm/BookingForm";
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
  const [resetFormFlag, setResetFormFlag] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  const handleBookingSubmit = async (formData: BookingData) => {
    if (!selectedArtist || !selectedDay) {
      toast.error("Please select an artist and date.");
      return;
    }

    let imageUrl = "";

    if (formData.imageFile) {
      try {
        const fileExt = formData.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data: storageData, error: uploadError } = await supabase
          .storage
          .from("booking-images")
          .upload(filePath, formData.imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          toast.error("Failed to upload image.");
          return;
        }

        const { data: publicUrlData } = supabase
          .storage
          .from("booking-images")
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          toast.error("Failed to get image URL.");
          return;
        }

        imageUrl = publicUrlData.publicUrl;
      } catch (err) {
        console.error("Image upload exception:", err);
        toast.error("Unexpected error during image upload.");
        return;
      }
    }

    const today = new Date();
    const bookingDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

    const { error } = await supabase.from("bookings").insert({
      artist_id: selectedArtist.id,
      artist_name: selectedArtist.name,
      date: bookingDate,
      customer_name: formData.name,
      email: formData.email,
      idea: formData.idea,
      payment_method: formData.paymentMethod,
      confirmation_code: formData.confirmationCode,
      image_url: imageUrl,
    });

    if (error) {
      console.error("Insert error:", error.message);
      toast.error("Booking failed: " + error.message);
    } else {
      toast.success("Booking confirmed!");
      setResetFormFlag(true); // Trigger reset
      setTimeout(() => setResetFormFlag(false), 500); // Clear the signal
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
          resetSignal={resetFormFlag}
        />
      </div>
    </div>
  );
}
