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
  image_url?: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("artist_email", user.email)
        .order("date", { ascending: true });

      if (!error && data) {
        setBookings(data);
        setSelectedBooking(data[0] || null); // auto-select first
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const localDate = new Date(year, month - 1, day); // fix offset
    return localDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bookings-wrapper">
      <div className="bookings-list-pane">
        <h2>My Bookings</h2>
        <ul className="booking-list">
          {bookings.map((b) => (
            <li
              key={b.id}
              className={`booking-item ${selectedBooking?.id === b.id ? "selected" : ""}`}
              onClick={() => setSelectedBooking(b)}
            >
              <strong>{b.customer_name}</strong>
              <span className="booking-date">{formatDate(b.date)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="booking-detail-pane">
        {selectedBooking ? (
          <>
            <h3>{selectedBooking.customer_name}</h3>
            <div className="booking-detail-pane-info">
              <div className="booking-detail-pane-header">
                <p><strong>Date:</strong> {formatDate(selectedBooking.date)}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>

              </div>

              <div className="booking-detail-pane-payment">
                <p><strong>Payment method:</strong> {selectedBooking.payment_method}</p>
                <p><strong>Confirmation code:</strong> {selectedBooking.confirmation_code}</p>
              </div>
            </div>
            <div className="booking-idea">
              <strong>Idea:</strong>
              <p>{selectedBooking.idea}</p>
            </div>

            {selectedBooking.image_url && (
              <>
                <p><strong>Reference Images: </strong></p>
                <div className="image-gallery">
                  <img
                    src={selectedBooking.image_url}
                    alt="Tattoo reference"
                    className="gallery-image"
                  />
                </div>
              </>
            )}

          </>
        ) : (
          <p>Select a booking to view details.</p>
        )}
      </div>
    </div>
  );

}
