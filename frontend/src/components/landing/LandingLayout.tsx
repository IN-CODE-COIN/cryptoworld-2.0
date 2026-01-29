import { ReactNode } from "react";
import { NavbarLanding } from "./NavbarLanding";
import { Footer } from "./Footer";
import { useTheme } from "../../hooks/useTheme";

type Props = {
  children: ReactNode;
};

export const LandingLayout = ({ children }: Props) => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <NavbarLanding />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
