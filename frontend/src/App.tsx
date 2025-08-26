import { Layout } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./hooks/useTheme";
import { useState } from "react";
import { SidebarMenu } from "./components/layout/SideBarMenu";
import { HeaderBar } from "./components/layout/HeaderBar";
import { MainContent } from "./components/layout/MainContent";
import { ScrollToTop } from "./components/global/ScrollToTop";

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout className="min-h-screen">
        <ScrollToTop />
        <SidebarMenu collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout>
          <HeaderBar
            collapsed={collapsed}
            toggleCollapsed={() => setCollapsed(!collapsed)}
          />
          <MainContent />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
