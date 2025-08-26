import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../hooks/AuthHelpers";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};
