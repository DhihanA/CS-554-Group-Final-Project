import React from "react";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   Link,
//   Button,
// } from "@nextui-org/react";

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
      {/* {authenticated ? (
        <Navbar>
          <NavbarBrand>
            <Link color="foreground" href="/">
              Dashboard
            </Link>
          </NavbarBrand>
          <NavbarContent className="" justify="center">
            {Object.keys(routes).map((key) => (
              <NavbarItem key={key}>
                <Link color="foreground" href={routes[key]}>
                  {key}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      ) : (
        <Navbar>
          <NavbarBrand>
            <Link color="foreground" href="/">
              Piggy Bank
            </Link>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem className="lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )} */}
    </div>
  );
}
