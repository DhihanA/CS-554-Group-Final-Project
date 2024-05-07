import react, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useUser, useClerk, SignedOut, SignedIn } from "@clerk/clerk-react";
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
import HowTo from "./pages/HowTo";
import CustomDataForm from "./pages/CustomDataForm";

function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded)
    // return <span className="loading loading-infinity loading-lg"></span>;
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );

  return (
    <>
      {/* <ClerkEventHandlers /> */}

      <SignedOut>
        <Routes>
          <Route path="/signup" element={<SignUpClerk />} />
          <Route path="/login" element={<LoginClerk />} />
          <Route path="/howto" element={<HowTo />} />
          <Route path="/" element={<HeroPage />} />
          <Route path="*" element={<Navigate replace to={"/"} />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <ParentRoutes user={user} isSignedIn={isSignedIn} />
        <ChildRoutes user={user} isSignedIn={isSignedIn} />
        <NoRoleRoutes user={user} isSignedIn={isSignedIn} />
      </SignedIn>
    </>
  );
}

const ParentRoutes = ({ isSignedIn, user }) => {
  if (isSignedIn && user && user.publicMetadata.verificationCode) {
    return (
      <Routes>
        <Route path="/dashboard" element={<DashboardPage isParent={true} />} />
        <Route path="/howto" element={<HowTo />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
        <Route
          path="/transactions/:id"
          element={<DashboardPage isParent={true} />} // change this to child transactions of current parent
        />
      </Routes>
    );
  }
  return null;
};

const ChildRoutes = ({ isSignedIn, user }) => {
  if (isSignedIn && user && user.publicMetadata.parentId) {
    return (
      <Routes>
        <Route path="/dashboard" element={<DashboardPage isParent={false} />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/howto" element={<HowTo />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    );
  }
  return null;
};

const NoRoleRoutes = ({ isSignedIn, user }) => {
  if (isSignedIn && !user.publicMetadata.role) {
    return (
      <Routes>
        <Route path="/fillinfo" element={<CustomDataForm />} />
        <Route path="*" element={<Navigate replace to="/fillinfo" />} />
      </Routes>
    );
  }
  return null;
};

export default App;
