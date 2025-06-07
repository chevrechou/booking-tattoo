import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ArtistRegister() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Sign up with Supabase auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      alert("Registration failed: " + signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;

    // Wait for user session to persist
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      alert("User session not established yet. Try logging in.");
      return;
    }

    // Step 2: Insert user into `artists` table
    const { error: insertError } = await supabase.from("artists").insert({
      id: user.id, // ✅ foreign key from auth.users
      name: artistName,
      email: user.email,
      avatar_url: `https://i.pravatar.cc/40?u=${artistName}`,
    });

    if (insertError) {
      alert("Artist creation failed: " + insertError.message);
      return;
    }

    // Step 3: Redirect to portal
    navigate("/my-calendar");
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
