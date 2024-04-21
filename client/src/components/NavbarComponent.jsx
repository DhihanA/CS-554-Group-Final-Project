import React from "react";
import { Link } from "react-router-dom";
import piggyBankLogo from "../assets/piggyBankIcon.png";

export default function NavbarComponent({ authenticated }) {
  const routes = {
    Transactions: "/transactions",
    Settings: "/settings",
    Learn: "/learn",
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
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
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img src={piggyBankLogo} className="h-8 mr-2" alt="Piggy Bank Logo" />
          Piggy Bank
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {authenticated &&
            Object.keys(routes).map((key) => (
              <li key={key}>
                <Link to={routes[key]}>{key}</Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="navbar-end">
        {!authenticated && (
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
    </div>
  );
}
