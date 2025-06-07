import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./ArtistPortal.css";

export default function ArtistPortal() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [confirmedDays, setConfirmedDays] = useState<number[]>([]);
  const [bookedDays, setBookedDays] = useState<number[]>([]);
  const [newlySelectedDays, setNewlySelectedDays] = useState<number[]>([]);
  const [markedForDeletionDays, setMarkedForDeletionDays] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndAvailability = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) return;

      const uid = userData.user.id;
      const artist_email = userData.user.email;
      setUserId(uid);

      const [availRes, bookingRes] = await Promise.all([
        supabase
          .from("availability")
          .select("day")
          .eq("artist_id", uid)
          .eq("month", currentMonth)
          .eq("year", currentYear),

        supabase
          .from("bookings")
          .select("date")
          .eq("artist_email", artist_email),
      ]);
      console.log('bookingRes:', bookingRes);

      if (!availRes.error && availRes.data) {
        const saved = availRes.data.map((d) => d.day);
        setConfirmedDays(saved);
      }

      if (!bookingRes.error && bookingRes.data) {
        const daysWithBookings = bookingRes.data
          .map((b) => new Date(b.date))
          .filter((d) => d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear)
          .map((d) => d.getDate());
        setBookedDays(daysWithBookings);
        console.log("Booked days:", daysWithBookings);
      }
    };

    fetchUserAndAvailability();
  }, []);

  const toggleDay = (day: number) => {
    if (confirmedDays.includes(day)) {
      if (markedForDeletionDays.includes(day)) {
        setMarkedForDeletionDays((prev) => prev.filter((d) => d !== day));
      } else {
        setMarkedForDeletionDays((prev) => [...prev, day]);
      }
    } else {
      if (newlySelectedDays.includes(day)) {
        setNewlySelectedDays((prev) => prev.filter((d) => d !== day));
      } else {
        setNewlySelectedDays((prev) => [...prev, day]);
      }
    }
  };

  const confirmAvailability = async () => {
    if (!userId || newlySelectedDays.length === 0) return;

    const rows = newlySelectedDays.map((day) => ({
      artist_id: userId,
      day,
      month: currentMonth,
      year: currentYear,
    }));

    const { error } = await supabase.from("availability").insert(rows);
    if (!error) {
      setConfirmedDays((prev) => [...prev, ...newlySelectedDays]);
      setNewlySelectedDays([]);
    } else {
      alert("Failed to save: " + error.message);
    }
  };

  const deleteAvailability = async () => {
    if (!userId || markedForDeletionDays.length === 0) return;

    const { error } = await supabase
      .from("availability")
      .delete()
      .match({ artist_id: userId, month: currentMonth, year: currentYear })
      .in("day", markedForDeletionDays);

    if (!error) {
      setConfirmedDays((prev) => prev.filter((d) => !markedForDeletionDays.includes(d)));
      setMarkedForDeletionDays([]);
    } else {
      alert("Delete failed: " + error.message);
    }
  };

  const getDayClass = (day: number) => {
    const isPast = day < currentDay;
    if (isPast) return "day-button disabled";
    if (markedForDeletionDays.includes(day)) return "day-button pending-delete";
    if (confirmedDays.includes(day)) return "day-button confirmed";
    if (newlySelectedDays.includes(day)) return "day-button selected";
    return "day-button";
  };

  return (
    <div className="artist-container">
      <h2 className="artist-heading">
        Select Your Available Days – {today.toLocaleString("default", { month: "long" })}
      </h2>

      <div className="calendar-grid">
        {["S", "M", "T", "W", "Th", "F", "S"].map((day, i) => (
          <div key={`label-${i}`} className="weekday-label">
            {day}
          </div>
        ))}

        {Array.from({ length: new Date(currentYear, currentMonth - 1, 1).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const hasBooking = bookedDays.includes(day);

          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={getDayClass(day)}
              disabled={day < currentDay}
            >
              {day}
              {hasBooking && <span className="booking-label">Booked</span>}
            </button>
          );
        })}
      </div>

      <div className="confirmation-box">
        {newlySelectedDays.length === 0 && markedForDeletionDays.length === 0 ? (
          <p>Select a day</p>
        ) : (
          <>
            {newlySelectedDays.length > 0 && (
              <>
                <p>New Days: {newlySelectedDays.join(", ")}</p>
                <button className="confirm-btn" onClick={confirmAvailability}>
                  Confirm Availability
                </button>
              </>
            )}
            {markedForDeletionDays.length > 0 && (
              <>
                <p>Marked for Removal: {markedForDeletionDays.join(", ")}</p>
                <button className="delete-btn" onClick={deleteAvailability}>
                  Delete Availability
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
