import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  // Link,
  Button,
} from "@nextui-org/react";

import { Link } from "react-router-dom";

import piggyBankLogo from "../assets/piggyBankIcon.png";

export default function NavbarComponent({ authenticated }) {
  const routes = {
    Transactions: "/transactions",
    Settings: "/settings",
    Learn: "/learn",
    // "Checkings Account": "/checkings",
    // "Savings Account": "/savings",
  };
  return (
    <div>
      {authenticated ? (
        <Navbar>
          <NavbarBrand>
            <Link color="foreground" to="/">
              Dashboard
            </Link>
          </NavbarBrand>
          <NavbarContent className="" justify="center">
            {Object.keys(routes).map((key) => (
              <NavbarItem key={key}>
                <Link color="foreground" to={routes[key]}>
                  {key}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="#">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="#" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      ) : (
        <></>
      )}
    </div>
  );
}
