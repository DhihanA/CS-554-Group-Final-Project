import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import SignUpClerk from "./pages/SignUpPage";
import LoginClerk from "./pages/LoginPage";
import {SignedIn, SignedOut} from '@clerk/clerk-react';
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
      
        <SignedIn>
          <Routes>
            <Route path="/" element={<Dashboard user={{}} />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </SignedIn>

        <SignedOut>
          <Routes>
            <Route path="/" element={<Dashboard user={{}} />} />
            <Route path="/login" element={<LoginClerk />}/>
            <Route path="/signup" element={<SignUpClerk />}/>
          </Routes>
        </SignedOut>

      {/* Footer Component (todo) here */}
    </>
    // </NextUIProvider>
  );
}

export default App;