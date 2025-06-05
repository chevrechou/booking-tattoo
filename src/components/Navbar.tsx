import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({
  isAuthenticated,
  artistName,
  onLogout,
}: {
  isAuthenticated: boolean;
  artistName: string | null;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title">
          InkBook
        </Link>
      </div>
      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-artist">Hi, {artistName}!</span>
            <button className="navbar-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
