import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
// import { NextUIProvider } from "@nextui-org/react";
import "./App.css";

// Import all pages here
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import Quiz from './pages/Quiz'

function App() {
  const navigate = useNavigate();

  return (
    // <NextUIProvider navigate={navigate}>
    <>
      {/* All route declarations go below */}

      <Routes>
        <Route path="/" element={<Dashboard user={{}} />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/learn" element={<Quiz />} /> {/* learn n' earn quiz */}
      </Routes>
      {/* Footer Component (todo) here */}
    </>
    // </NextUIProvider>
  );
}

export default App;
