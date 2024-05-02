import react from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import "./App.css";
import ClerkEventHandlers from "./components/ClerkEventHandlers";

// Import all pages here
import HeroPage from "./pages/HeroPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
// import SettingsPage from "./pages/SettingsPage";
import LearnPage from "./pages/LearnPage";
import SignUpClerk from "./pages/SignUpPage";
import LoginClerk from "./pages/LoginPage";

function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded)
    return <span className="loading loading-infinity loading-lg"></span>;

  let isParent;
  if (isSignedIn && user) isParent = user.publicMetadata.parent;

  return (
    <>
      <ClerkEventHandlers />
      <Routes>
        {/* Authenticated user routes go below */}

        {/* This is the only path both adults+children can access: */}
        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transactions"
          element={
            isSignedIn && !isParent ? <TransactionsPage /> : <Navigate to="/" />
          }
        />
        {/* <Route
        path="/settings"
        element={isSignedIn ? <SettingsPage /> : <Navigate to="/" />}
      /> */}
        <Route
          path="/learn"
          element={
            isSignedIn && !isParent ? <LearnPage /> : <Navigate to="/" />
          }
        />

        {/* Unauthenticated user routes go below */}
        {!isSignedIn && <Route path="/" element={<HeroPage />} />}

        <Route
          path="/login"
          element={!isSignedIn ? <LoginClerk /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!isSignedIn ? <SignUpClerk /> : <Navigate to="/dashboard" />}
        />

        {/* Redirect any unknown paths */}
        <Route
          path="*"
          element={<Navigate replace to={isSignedIn ? "/dashboard" : "/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
