import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
// import { NextUIProvider } from "@nextui-org/react";
import "./App.css";

// Import all pages here
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  const navigate = useNavigate();

  return (
    // <NextUIProvider navigate={navigate}>
    <>
      {/* All route declarations go below */}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
      {/* Footer Component (todo) here */}
    </>
    // </NextUIProvider>
  );
}

export default App;
