import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useTheme } from "../../hooks/useTheme";

export const ScrollToTop: React.FC = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-2 right-2 lg:bottom-6 lg:right-6 z-50">
      {isVisible && (
        <Button
          title="Ir arriba"
          color={theme === "dark" ? "default" : "primary"}
          variant={theme === "dark" ? "outlined" : "solid"}
          className="shadow-lg transition-colors duration-300 ease-in-out"
          shape="circle"
          onClick={scrollToTop}
          icon={<ArrowUpOutlined />}
        />
      )}
    </div>
  );
};
