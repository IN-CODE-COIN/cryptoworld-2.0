import { Layout } from "antd";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./hooks/useTheme";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { SidebarMenu } from "./components/layout/SideBarMenu";
import { HeaderBar } from "./components/layout/HeaderBar";
import { MainContent } from "./components/layout/MainContent";
import { CryptoDetailLayout } from "./components/layout/CryptoDetailLayout";
import { ScrollToTop } from "./components/global/ScrollToTop";
import { Landing } from "./pages/Landing";
import { Crypto } from "./pages/pages";

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Landing (público)
  if (!isAuthenticated) {
    return (
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </ConfigProvider>
    );
  }

  // Crypto Detail (sin sidebar)
  const isCryptoDetail = location.pathname.match(/^\/crypto\/[^/]+$/);
  if (isCryptoDetail) {
    return (
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/crypto/:uuid" element={<CryptoDetailLayout><Crypto /></CryptoDetailLayout>} />
        </Routes>
      </ConfigProvider>
    );
  }

  // Dashboard (privado)
  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout className="min-h-screen" data-testid="app-layout">
        <ScrollToTop />
        <SidebarMenu
          collapsed={collapsed}
          onCollapse={setCollapsed}
          data-testid="sidebar"
        />
        <Layout>
          <HeaderBar
            data-testid="header-bar"
            collapsed={collapsed}
            toggleCollapsed={() => setCollapsed(!collapsed)}
          />
          <MainContent data-testid="main-content" />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
