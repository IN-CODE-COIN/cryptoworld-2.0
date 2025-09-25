import { useState } from "react";
import { Menu, Layout } from "antd";
import { ButtonCollapseSider } from "../global/ButtonCollapseSider";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { navItems } from "../../config/navigationConfig";
import type { NavItem } from "../../config/navigationConfig";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../global/AuthButton";
import iconLogo from "/icon_logo.svg";
import iconLogoDark from "/icon_logo_white.svg";
import { SearchCrypto } from "../global/SearchCrypto";

const { Sider } = Layout;

type Props = {
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
};

export const SidebarMenu = ({ collapsed, onCollapse }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const findKeyByPath = (path: string): string | undefined => {
    for (const item of navItems) {
      if (item.path === path) return item.key;
      if (item.children) {
        const child = item.children.find((c) => c.path === path);
        if (child) return child.key;
      }
    }
    return "1";
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const target = [
      ...navItems,
      ...navItems.flatMap((i) => i.children || []),
    ].find((item) => item.key === e.key);

    if (!target) return;

    if (target.action === "searchModal") {
      setSearchModalVisible(true);
      return;
    }

    if (target.path) {
      navigate(target.path);
    }

    if (isMobile) {
      onCollapse(true);
    }
  };

  const buildMenuItems = (items: NavItem[]): MenuProps["items"] => {
    return items
      .filter((item) => !item.protected || isAuthenticated)
      .map(({ key, icon, i18nKey, label, children, action }) => ({
        key,
        icon,
        label: i18nKey ?? label ?? key,
        children: children ? buildMenuItems(children) : undefined,
        action,
      }));
  };

  return (
    <>
      <Sider
        breakpoint="sm"
        collapsedWidth={isMobile ? 0 : 80}
        collapsed={collapsed}
        collapsible={true}
        onCollapse={onCollapse}
        onBreakpoint={(broken) => setIsMobile(broken)}
        width={isMobile ? "100vw" : 200}
        style={{
          height: "100dvh",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          zIndex: isMobile ? 99 : "auto",
          overflow: "hidden",
          backgroundColor: theme === "dark" ? "#001529" : "#fff",
        }}
      >
        <div className="demo-logo-vertical p-4 flex justify-between items-center">
          <img
            src={theme === "dark" ? iconLogoDark : iconLogo}
            alt="Logo CryptoWorld"
            style={{
              marginInline: collapsed ? "auto" : 3,
              width: "6rem",
              height: "auto",
            }}
            className="dark:fill-white dark:stroke-white"
          />
          <ButtonCollapseSider
            collapsed={collapsed}
            toggleCollapsed={() => onCollapse(!collapsed)}
            theme={theme}
            iconSize={20}
            className="sm:block hidden"
            style={{ display: isMobile ? "block" : "none" }}
          />
        </div>
        <Menu
          theme={theme === "dark" ? "dark" : "light"}
          mode="inline"
          selectedKeys={[findKeyByPath(location.pathname)!]}
          onClick={handleMenuClick}
          items={buildMenuItems(navItems)}
          style={{ border: "none" }}
        />
        <div
          className={`${
            !isAuthenticated
              ? "hidden"
              : isMobile
              ? "hidden"
              : collapsed && isAuthenticated
              ? "absolute bottom-16 left-5"
              : "absolute bottom-16 left-5"
          }`}
        >
          <AuthButton />
          <span
            className={`dark:text-white mx-1 ${
              collapsed ? "hidden" : "inline"
            }`}
          >
            {user?.name}
          </span>
        </div>
      </Sider>
      <SearchCrypto
        searchModalVisible={searchModalVisible}
        setSearchModalVisible={setSearchModalVisible}
        onMobileNavigate={() => {
          if (isMobile) {
            onCollapse(true);
          }
        }}
      />
    </>
  );
};
