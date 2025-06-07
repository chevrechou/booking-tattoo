import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./ArtistPortal.css";

export default function ArtistPortal() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [confirmedDays, setConfirmedDays] = useState<number[]>([]);
  const [newlySelectedDays, setNewlySelectedDays] = useState<number[]>([]);
  const [markedForDeletionDays, setMarkedForDeletionDays] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndAvailability = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) return;

      const uid = userData.user.id;
      setUserId(uid);

      const { data, error } = await supabase
        .from("availability")
        .select("day")
        .eq("artist_id", uid)
        .eq("month", currentMonth)
        .eq("year", currentYear);

      if (!error && data) {
        const saved = data.map((d) => d.day);
        setConfirmedDays(saved);
      }
    };

    fetchUserAndAvailability();
  }, []);

  const toggleDay = (day: number) => {
    if (confirmedDays.includes(day)) {
      if (markedForDeletionDays.includes(day)) {
        setMarkedForDeletionDays((prev) => prev.filter((d) => d !== day)); // unmark
      } else {
        setMarkedForDeletionDays((prev) => [...prev, day]); // mark for deletion
      }
    } else {
      if (newlySelectedDays.includes(day)) {
        setNewlySelectedDays((prev) => prev.filter((d) => d !== day)); // unselect
      } else {
        setNewlySelectedDays((prev) => [...prev, day]); // new selection
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
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={getDayClass(day)}
              disabled={day < currentDay}
            >
              {day}
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
