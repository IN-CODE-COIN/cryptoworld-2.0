import React from "react";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export type Props = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  theme?: "light" | "dark";
  iconSize?: number;
  style?: React.CSSProperties;
  className?: string;
};

export const ButtonCollapseSider: React.FC<Props> = ({
  collapsed,
  toggleCollapsed,
  theme = "light",
  iconSize = 20,
  style,
  className,
}) => {
  const icon = collapsed ? <MenuOutlined /> : <CloseOutlined />;

  return (
    <Button
      type="text"
      icon={icon}
      onClick={toggleCollapsed}
      className={className}
      style={{
        fontSize: `${iconSize}px`,
        color: theme === "dark" ? "#fff" : "#001529",
        margin: 0,
        padding: 0,
        ...style,
      }}
    />
  );
};
