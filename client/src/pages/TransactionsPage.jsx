import React from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import AccountCard from "../components/AccountCard";

const TransactionsPage = () => {
  return (
    <BasePage>
      <div>
        <Transactions></Transactions>
        <div className="p-6 min-h-screen"></div>
      </div>
    </BasePage>
  );
};

export default TransactionsPage;
