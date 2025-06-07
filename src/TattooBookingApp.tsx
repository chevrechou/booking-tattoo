// src/TattooBookingApp.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import ArtistPortal from "./pages/ArtistPortal/ArtistPortal";
import ArtistLogin from "./pages/Login/LoginPage";
import ArtistRegister from "./pages/Registration/ArtistRegister";
import Navbar from "./components/Navbar/Navbar";
import { supabase } from "./lib/supabase";
import MyBookings from "./pages/MyBookings/MyBookings";
import { ToastContainer } from "react-toastify";

export default function TattooBookingApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentArtistEmail, setCurrentArtistEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentArtistEmail(session?.user?.email ?? null);
      } else {
        setIsAuthenticated(false);
        setCurrentArtistEmail(null);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentArtistEmail(session.user.email ?? null);
      } else {
        setIsAuthenticated(false);
        setCurrentArtistEmail(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={1500} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/my-calendar"
          element={
            isAuthenticated ? (
              <ArtistPortal />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>Access Denied</h2>
                <p>Please log in to access the artist portal.</p>
              </div>
            )
          }
        />
        <Route
          path="/my-bookings"
          element={
            isAuthenticated ? (
              <MyBookings />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>Access Denied</h2>
                <p>Please log in to access your bookings.</p>
              </div>
            )
          }
        />
        <Route path="/login" element={<ArtistLogin />} />
        <Route path="/register" element={<ArtistRegister />} />
      </Routes>
    </Router>
  );
}
