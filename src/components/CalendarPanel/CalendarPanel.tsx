// src/components/CalendarPanel.tsx
import React, { useState } from "react";
import "./CalendarPanel.css";

type Availability = { [day: number]: boolean };

export type Artist = {
    id: number;
    name: string;
    avatar: string;
    availability: Availability;
};

type CalendarPanelProps = {
    artists: Artist[];
    selectedArtist: Artist;
    setSelectedArtist: (artist: Artist) => void;
    selectedDay: number | null;
    setSelectedDay: (day: number | null) => void;
};

export default function CalendarPanel({
    artists,
    selectedArtist,
    setSelectedArtist,
    selectedDay,
    setSelectedDay,
}: CalendarPanelProps) {
    const [fade, setFade] = useState(false);

    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const monthName = today.toLocaleString("default", { month: "long" });
    const numDays = new Date(year, monthIndex + 1, 0).getDate();

    const handleSelectArtist = (artist: Artist) => {
        if (artist.id !== selectedArtist.id) {
            setFade(true);
            setTimeout(() => {
                setSelectedArtist(artist);
                setSelectedDay(null);
                setFade(false);
            }, 200);
        }
    };

    return (
        <div className="calendar-panel">
            {/* Artist list */}
            <div className="artist-list">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        onClick={() => handleSelectArtist(artist)}
                        className={`artist-item ${selectedArtist.id === artist.id ? "selected" : ""}`}
                    >
                        <img src={artist.avatar} alt={artist.name} className="artist-avatar" />
                        <strong>{artist.name}</strong>
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className={`calendar ${fade ? "fade" : ""}`}>
                <h2>{`${monthName} ${year}`}</h2>
                <div className="calendar-grid">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                        <div key={d} className="calendar-day-label">
                            {d}
                        </div>
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
    );
}
