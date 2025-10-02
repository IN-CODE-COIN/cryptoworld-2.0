import { Layout, Grid } from "antd";
import { ButtonCollapseSider } from "../global/ButtonCollapseSider";
import { BreadcrumbComponent } from "../global/BreadcrumbComponent";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../global/AuthButton";

const { Header } = Layout;

type Props = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

export const HeaderBar = ({ collapsed, toggleCollapsed }: Props) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = screens.xs && !screens.sm;

  const isMobileBoxShadow =
    isMobile && theme !== "dark"
      ? "shadow-xs"
      : isMobile && theme === "dark"
      ? "shadow-sm shadow-gray-100"
      : "";

  return (
    <Header
      style={{
        backgroundColor: theme === "dark" ? "#001529" : "#fff",
        margin: 0,
        padding: isMobile ? 2 : 0,
        position: isMobile ? "sticky" : "relative",
        top: isMobile ? 0 : undefined,
        zIndex: isMobile ? 100 : undefined,
      }}
      className={`flex justify-between items-center ${isMobileBoxShadow} sm:border-l border-gray-200 dark:border-gray-700`}
    >
      <ButtonCollapseSider
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        theme={theme}
        iconSize={20}
        style={{ display: isMobile ? "flex" : "none" }}
      />

      <BreadcrumbComponent
        style={{
          display: isMobile ? "block" : "none",
          cursor: "default",
          color: theme === "dark" ? "#fff" : "#001529",
          fontSize: "1rem",
        }}
        separator
      />

      <div
        data-testid="auth-button-wrapper"
        className={`${
          isMobile
            ? "flex me-1"
            : isAuthenticated
            ? "hidden"
            : "absolute right-2"
        }`}
      >
        <AuthButton />
      </div>
    </Header>
  );
};
