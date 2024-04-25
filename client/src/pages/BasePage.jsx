import React from "react";
import "../index.css";
import NavbarComponent from "../components/NavbarComponent";
// import FooterComponent from "../components/FooterComponent";
import {SignedIn, SignedOut} from '@clerk/clerk-react';

const BasePage = ({ children }) => {
  return (
    <>
      {/* !TODO Fix this so that authenticated passes in whether user is actually logged in or not */}

      {/* pass in user content below; if not authenticated, pass in undefined */}
      {/* (passing in an empty object for now) */}
      <SignedIn>
        <NavbarComponent user={{}}></NavbarComponent>
      </SignedIn>
      <SignedOut>
        <NavbarComponent user={undefined}></NavbarComponent>
      </SignedOut>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
      {/* <FooterComponent /> */}
    </>
  );
};

export default BasePage;
