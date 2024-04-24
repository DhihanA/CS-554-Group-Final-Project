import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
// import { NextUIProvider } from "@nextui-org/react";
import "./App.css";

// Import all pages here
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import LearnPage from "./pages/LearnPage";

function App() {
  const navigate = useNavigate();

  return (
    // <NextUIProvider navigate={navigate}>
    <>
      {/* All route declarations go below */}

      <Routes>
        <Route path="/" element={<DashboardPage user={{}} />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/learn" element={<LearnPage />} />
      </Routes>
      {/* Footer Component (todo) here */}
    </>
    // </NextUIProvider>
  );
}

export default App;
