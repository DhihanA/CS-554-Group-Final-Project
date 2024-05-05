import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
// import piggyBankLogo from "../assets/piggyBankIcon.png";
import piggyBankLogo from "../assets/piggyBankIconColored.png";

import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function NavbarComponent() {
  const { isSignedIn, isLoaded, user } = useUser();
  let isParent = false;
  if (isSignedIn && user && user.publicMetadata.verificationCode)
    isParent = true;

  // https://dev.to/kunalukey/how-to-add-dark-mode-toggle-in-reactjs-tailwindcss-daisyui-1af9
  // learned how to do it from the above article and accompaning vid
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
    // "dark" // anytime application is opened in a new tab, it starts off in dark mode. fixed the above issue of first change not doing anything
  );

  // update state on toggle
  const handleToggle = (e) => {
    // if sun icon is present on screen, then you are on light mode, otherwise dark
    // if we want it to where if the sun icon is present, you have to press it to enter light mode, just swap the setTheme statements below
    // (as in "press the sun to go into light mode" VS "sun icon is present which means you are in light mode" [i went with the latter cuz it made more sense to me])
    if (e.target.checked) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.documentElement.setAttribute("data-theme", localTheme);
  }, [theme]);

  let routes = {};
  if (!isParent) {
    routes = {
      "My Transactions": "/transactions",
      "Learn n' Earn": "/learn",
      "How To Start": "/howto", // added the ability to navigate to how to section in the navbar
    };
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        {isSignedIn && !isParent && (
          <div className="dropdown">
            <label tabIndex="0" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </label>
            <ul
              tabIndex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {Object.keys(routes).map((key) => (
                <li key={key}>
                  <Link to={routes[key]}>{key}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSignedIn && (
          <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
            <img
              src={piggyBankLogo}
              className="h-8 mr-2"
              alt="Piggy Bank Logo"
            />
            Piggy Bank
          </Link>
        )}
        {!isSignedIn && (
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <img
              src={piggyBankLogo}
              className="h-8 mr-2"
              alt="Piggy Bank Logo"
            />
            Piggy Bank
          </Link>
        )}
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {isSignedIn &&
            Object.keys(routes).map((key) => (
              <li key={key}>
                <Link to={routes[key]}>{key}</Link>
              </li>
            ))}
        </ul>
      </div>

      {/* ICON to switch between light & dark mode  */}
      <div className="navbar-center hidden lg:flex">
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onChange={handleToggle} checked={theme === "light"}/>
          {/* if light mode, show sun icon, otherwise show moon icon */}
          {theme === "light" ? (
            <svg className="swap-on fill-current w-10 h-10 transition duration-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              {/* sun icon */}
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
          ) : (
            <svg className="swap-off fill-current w-10 h-10 transition duration-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              {/* moon icon */}
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          )}
        </label>
      </div>

      <div className="navbar-end">
        {!isSignedIn && (
          <div>
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
      <div>
        <UserButton
          afterSignOutUrl="/"
          onClick={() => {
            setIsMobileMenuOpen(false);
            localStorage.clear();
          }}
        />
      </div>
    </div>
  );
}
