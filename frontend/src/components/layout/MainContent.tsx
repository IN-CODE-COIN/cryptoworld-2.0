import { useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Pricing,
  Home,
  Contact,
  Legal,
  Account,
  Cartera,
  Watchlist,
  Crypto,
} from "../../pages/pages";
import { useTheme } from "../../hooks/useTheme.ts";
import { ProtectedRoute } from "../auth/ProtectedRoute.tsx";
import { WalletMovementForm } from "../wallet/WalletMovementForm.tsx";
import { ShowMovementsList } from "../wallet/ShowMovementsList.tsx";
import { WalletTransactionForm } from "../wallet/WalletTransactionForm.tsx";

const { Content } = Layout;
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const MainContent: React.FC = () => {
  const { theme } = useTheme();
  return (
    <>
      <ScrollToTop />
      <Content
        style={{
          backgroundColor: theme === "dark" ? "#001529" : "#fff",
        }}
        className="sm:border-l border-gray-200 dark:border-gray-700"
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            backgroundColor: theme === "dark" ? "#001529" : "#fff",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/cartera"
              element={
                <ProtectedRoute>
                  <Cartera />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cartera/create"
              element={
                <ProtectedRoute>
                  <WalletMovementForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cartera/moves"
              element={
                <ProtectedRoute>
                  <ShowMovementsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cartera/transaction/create"
              element={
                <ProtectedRoute>
                  <WalletTransactionForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/crypto/:uuid" element={<Crypto />} />
          </Routes>
        </div>
      </Content>
    </>
  );
};
