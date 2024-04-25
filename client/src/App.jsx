import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import "./App.css";

// Import all pages here
import HeroPage from "./pages/HeroPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import LearnPage from "./pages/LearnPage";
import SignUpClerk from "./pages/SignUpPage";
import LoginClerk from "./pages/LoginPage";

function App() {
  const navigate = useNavigate();

  return (
    <>
      {/* All route declarations go below */}

      <SignedIn>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage user={{}} />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/learn" element={<LearnPage />} />
        </Routes>
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/login" element={<LoginClerk />} />
          <Route path="/signup" element={<SignUpClerk />} />
        </Routes>
      </SignedOut>

      {/* Footer Component (todo) here */}
    </>
  );
}

export default App;
