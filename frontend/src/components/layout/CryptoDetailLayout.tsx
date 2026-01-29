import { ReactNode } from "react";
import { Layout } from "antd";
import { useTheme } from "../../hooks/useTheme";

type Props = {
  children: ReactNode;
};

const { Content, Header } = Layout;

export const CryptoDetailLayout = ({ children }: Props) => {
  const { theme } = useTheme();

  return (
    <Layout className="min-h-screen">
      <Header
        style={{
          backgroundColor: theme === "dark" ? "#001529" : "#fff",
          padding: "0 24px",
          borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
        }}
        className="flex items-center sticky top-0 z-50"
      >
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          CryptoWorld
        </div>
      </Header>
      <Content
        style={{
          backgroundColor: theme === "dark" ? "#001529" : "#fff",
        }}
        className="border-l border-gray-200 dark:border-gray-700"
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            backgroundColor: theme === "dark" ? "#001529" : "#fff",
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};
