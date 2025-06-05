// src/pages/ArtistRegister.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistRegister.css";

export default function ArtistRegister({
  onRegister,
}: {
  onRegister: (artistName: string, password: string) => void;
}) {
  const [artistName, setArtistName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artistName && password) {
      onRegister(artistName, password);
      navigate("/artist");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Artist Registration</h2>
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
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
