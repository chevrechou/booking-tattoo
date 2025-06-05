// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export default function ProtectedRoute({ isAuthenticated, children }: Props) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
