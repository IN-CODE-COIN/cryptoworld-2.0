import { createContext } from "react";

export type UserType = {
  id: number;
  name: string;
  email: string;
  rol: "normal" | "pro";
  balance: number;
  trial_ends_at?: string | Date;
  frequency?: "mensual" | "anual";
  pro_started_at?: string | Date;
  has_used_trial: boolean;
};
type AuthContextType = {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
