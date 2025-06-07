import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./MyBookings.css";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("artist_email", user.email)
        .order("date", { ascending: true });

      if (!error && data) {
        setBookings(data);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return formattedDate
}

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-title">🎯 My Confirmed Bookings</h2>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-header">
                <span className="booking-date">Date: {formatDate(b.date)}</span>
                <span className="booking-name">Name: {b.customer_name}</span>
              </div>
              <p className="booking-email">Customer email: {b.email}</p>
              <p className="booking-idea">Tattoo Idea: {b.idea}</p>
              <div className="booking-footer">
                <span>💰 Payment Method: {b.payment_method}</span>
                <span>✅ Code: {b.confirmation_code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
