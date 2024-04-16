import React from "react";
import "../index.css";
import NavbarComponent from "../components/NavbarComponent";
// import FooterComponent from "../components/FooterComponent";

const BasePage = ({ children }) => {
  return (
    <>
      {/* !TODO Fix this so that authenticated passes in whether user is actually logged in or not */}
      <NavbarComponent authenticated={true}></NavbarComponent>
      <NavbarComponent authenticated={false}></NavbarComponent>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
      {/* <FooterComponent /> */}
    </>
  );
};

export default BasePage;
