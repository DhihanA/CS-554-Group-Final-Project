import React from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import AccountCard from "../components/AccountCard";

const Dashboard = () => {
  return (
    <BasePage>
      <div>
        {/* <Card />
        <Card />
        <Card /> */}
        <Transactions></Transactions>
        <div className="p-6 min-h-screen">
          <h1 className="text-2xl font-bold">Bank accounts</h1>
          <AccountCard
            accountType="checkings account"
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

export default Dashboard;
