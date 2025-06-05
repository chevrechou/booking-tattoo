import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import BookingPage from "./pages/BookingPage";
import ArtistPortal from "./pages/ArtistPortal/ArtistPortal";
import ArtistLogin from "./pages/Login/LoginPage";
import Navbar from "./components/Navbar";
import ArtistRegister from "./pages/Registration/ArtistRegister";

export default function TattooBookingApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<string | null>(null);
  const [registeredArtists, setRegisteredArtists] = useState<
    { name: string; password: string }[]
  >([]);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        artistName={currentArtist}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentArtist(null);
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route
          path="/artist"
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
          path="/login"
          element={
            <ArtistLogin
              artists={registeredArtists}
              onLogin={(artistName) => {
                setCurrentArtist(artistName);
                setIsAuthenticated(true);
              }}
            />
          }
        />
        <Route
          path="/register"
          element={
            <ArtistRegister
              onRegister={(artistName, password) => {
                setRegisteredArtists((prev) => [...prev, { name: artistName, password }]);
                setIsAuthenticated(true);
                setCurrentArtist(artistName);
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}
