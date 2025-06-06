// src/pages/ArtistRegister.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ArtistRegister() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sign up the artist
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Registration failed: " + authError.message);
      return;
    }

    // Insert into artists table
    const { error: insertError } = await supabase.from("artists").insert({
      name: artistName,
      email,
      avatar_url: `https://i.pravatar.cc/40?u=${artistName}`
    });

    if (insertError) {
      alert("Artist creation failed: " + insertError.message);
      return;
    }

    navigate("/artist"); // redirect after success
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
