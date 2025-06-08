import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./CalendarPanel.css";
import { Artist, Availability } from "../shared/types";

export default function CalendarPanel({
  selectedArtist,
  setSelectedArtist,
  selectedDay,
  setSelectedDay,
}: {
  selectedArtist: Artist | null;
  setSelectedArtist: (artist: Artist) => void;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
}) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<{ [artistId: string]: Availability }>({});
  const [bookedDays, setBookedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });
  const numDays = new Date(year, monthIndex + 1, 0).getDate();

  useEffect(() => {
    const loadArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");
      if (data && !error) {
        setArtists(data);
        if (!selectedArtist && data.length) {
          setSelectedArtist(data[0]);
        }
      } else {
        console.error("❌ Error fetching artists:", error);
      }
    };
    loadArtists();
  }, []);

  useEffect(() => {
    const loadAvailabilityAndBookings = async () => {
      if (!selectedArtist?.email) return;

      setLoading(true);

      const { data: availData, error: availError } = await supabase.from("availability").select("*");
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("date")
        .eq("artist_email", selectedArtist.email)
        .gte("date", `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`)
        .lte("date", `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(numDays).padStart(2, "0")}`);

      if (availData && !availError) {
        const mapped: { [artistId: string]: Availability } = {};
        availData.forEach((slot) => {
          if (slot.year === year && slot.month === monthIndex + 1) {
            if (!mapped[slot.artist_id]) mapped[slot.artist_id] = {};
            mapped[slot.artist_id][slot.day] = true;
          }
        });
        setAvailabilityMap(mapped);
      } else {
        console.error("❌ Error loading availability:", availError);
      }

      if (bookingsData && !bookingsError) {
        setBookedDays(bookingsData.map((b) => parseInt(b.date.split("-")[2], 10)));
      } else {
        console.error("❌ Error loading bookings:", bookingsError);
      }
      setTimeout(() => {
        setLoading(false);
      }, 190); // Simulate loading delay
    };

    loadAvailabilityAndBookings();
  }, [selectedArtist, monthIndex, year]);

  const availability = selectedArtist ? availabilityMap[selectedArtist.id] || {} : {};

  return (
    <div className="calendar-panel">
      <div className="artist-list">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => setSelectedArtist(artist)}
            className={`artist-item ${selectedArtist?.id === artist.id ? "selected" : ""}`}
          >
            <img src={artist.avatar_url} alt={artist.name} className="artist-avatar" />
            <strong>{artist.name}</strong>
          </div>
        ))}
      </div>

      <div className="calendar">
        <h2>{`${monthName} ${year}`}</h2>
        {loading ? (
          <p>Loading calendar...</p>
        ) : (
          <div className="calendar-grid">
            {["S", "M", "T", "W", "Th", "F", "S"].map((d, i) => (
              <div key={i} className="calendar-day-label">{d}</div>
            ))}
            {Array.from({ length: numDays }, (_, i) => {
              const day = i + 1;
              const isAvailable = availability[day];
              const isBooked = bookedDays.includes(day);
              const isUnavailable = !isAvailable || isBooked;
              const isToday = day === today.getDate();
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  className={`calendar-day 
                    ${isUnavailable ? "unavailable" : "available"} 
                    ${isToday ? "today" : ""} 
                    ${isSelected ? "selected-day" : ""}`}
                  onClick={() => !isUnavailable && setSelectedDay(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
