// src/pages/MyBookings/MyBookings.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Booking = {
  id: number;
  date: string;
  customer_name: string;
  email: string;
  idea: string;
  payment_method: string;
  confirmation_code: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("artist_id", user.id)
        .order("date", { ascending: true });

      if (!error && data) {
        setBookings(data);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Confirmed Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id} style={{ marginBottom: "1rem" }}>
              <strong>{b.date}</strong> - {b.customer_name} ({b.email})<br />
              <em>{b.idea}</em><br />
              Payment: {b.payment_method} | Code: {b.confirmation_code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
