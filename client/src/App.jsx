import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./App.css";
import Home from "./components/Home";
import NavbarComponent from "./components/NavbarComponent";

function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      {/* !Fix this so that authenticated passes in whether user is actually logged in or not */}
      <NavbarComponent authenticated={true}></NavbarComponent>
      <NavbarComponent authenticated={false}></NavbarComponent>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* More Routes below */}
      </Routes>

      {/* Footer Component here */}
    </NextUIProvider>
  );
}

export default App;
