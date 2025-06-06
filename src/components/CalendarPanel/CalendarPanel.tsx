import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./CalendarPanel.css";

type Availability = { [day: number]: boolean };

type Artist = {
  id: string;
  name: string;
  avatar_url: string;
  availability: Availability;
};

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
  const [fade, setFade] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<{ [key: string]: Availability }>({});

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });
  const numDays = new Date(year, monthIndex + 1, 0).getDate();

  useEffect(() => {
    const fetchArtists = async () => {
      const { data: artistsData, error } = await supabase.from("artists").select("*");
      if (error) {
        console.error("Error fetching artists:", error);
      } else if (artistsData) {
        setArtists(artistsData);
        if (!selectedArtist && artistsData.length > 0) {
          setSelectedArtist(artistsData[0]);
        }
      }
    };

    fetchArtists();
  }, [selectedArtist, setSelectedArtist]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase.from("availability").select("*");
      if (error) {
        console.error("Error fetching availability:", error);
        return;
      }

      const availabilityByArtist: { [key: string]: Availability } = {};
      data.forEach((slot) => {
        if (!availabilityByArtist[slot.artist_id]) {
          availabilityByArtist[slot.artist_id] = {};
        }
        if (slot.year === year && slot.month === monthIndex + 1) {
          availabilityByArtist[slot.artist_id][slot.day] = true;
        }
      });

      setAvailabilityMap(availabilityByArtist);
    };

    fetchAvailability();
  }, [selectedArtist]);

  const handleSelectArtist = (artist: Artist) => {
    console.log(artist, selectedArtist);
    if (!selectedArtist || artist.id !== selectedArtist.id) {
      setFade(true);
      setTimeout(() => {
        setSelectedArtist(artist);
        setSelectedDay(null);
        setFade(false);
      }, 200);
    }
  };

  const availability = selectedArtist ? availabilityMap[selectedArtist.id] || {} : {};

  return (
    <div className="calendar-panel">
      {/* Artist list */}
      <div className="artist-list">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => handleSelectArtist(artist)}
            className={`artist-item ${selectedArtist?.id === artist.id ? "selected" : ""}`}
          >
            <img src={artist.avatar_url} alt={artist.name} className="artist-avatar" />
            <strong>{artist.name}</strong>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className={`calendar ${fade ? "fade" : ""}`}>
        <h2>{`${monthName} ${year}`}</h2>
        <div className="calendar-grid">
          {["S", "M", "T", "W", "Th", "F", "S"].map((d, index) => (
            <div key={`${d}-${index}`} className="calendar-day-label">
              {d}
            </div>
          ))}
          {Array.from({ length: numDays }, (_, i) => {
            const day = i + 1;
            const isAvailable = availability[day];
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
  );
}
