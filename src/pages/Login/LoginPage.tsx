// src/pages/ArtistLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Registration/ArtistRegister.css";

type Artist = {
  name: string;
  password: string;
};

export default function ArtistLogin({
  artists,
  onLogin,
}: {
  artists: Artist[];
  onLogin: (artistName: string) => void;
}) {
  const [artistName, setArtistName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = artists.find(
      (a) => a.name === artistName && a.password === password
    );
    if (match) {
      onLogin(artistName);
      navigate("/artist");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Artist Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
