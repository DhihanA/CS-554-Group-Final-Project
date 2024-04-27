import React from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import AccountCard from "../components/AccountCard";

const DashboardPage = ({ user }) => {
  return (
    <BasePage>
      <div>
        {/* <Card />
        <Card />
        <Card /> */}
        {/* <Transactions></Transactions> */}
        <div className="p-6 min-h-screen">
          {new Date().getHours() < 12 && (
            <h1 className="text-2xl font-bold m-4">Good morning, user! </h1>
            //   <h1 className="text-2xl font-bold m-4">
            //   Good morning, {user.firstName}!
            // </h1>
          )}
          {
            new Date().getHours() < 18 ? (
              <h1 className="text-2xl font-bold m-4">Good afternoon, user! </h1>
            ) : (
              //   <h1 className="text-2xl font-bold m-4">
              //   Good afternoon, {user.firstName}!
              // </h1>
              <h1 className="text-2xl font-bold m-4">Good evening, user! </h1>
            )
            //   <h1 className="text-2xl font-bold m-4">
            //   Good evening, {user.firstName}!
            // </h1>
          }

          <h1 className="text-2xl font-bold m-4">Bank accounts</h1>
          <AccountCard
            accountType="checking account"
            accountNumber="...3137"
            balance={1053.0}
            deposits={5005.09}
            withdrawals={2430.0}
          />
          <AccountCard
            accountType="savings account"
            accountNumber="...2227"
            balance={5363.38}
            deposits={0}
            withdrawals={0}
          />
        </div>
      </div>
    </BasePage>
  );
};

export default DashboardPage;
