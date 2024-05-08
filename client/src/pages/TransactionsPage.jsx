import React from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import ChildTransactions from "../components/ChildTransactions";
import AccountCard from "../components/AccountCard";

const TransactionsPage = ({ isParent }) => {
  return (
    <BasePage>
      <div>
        {isParent ? (
          <ChildTransactions></ChildTransactions>
        ) : (
          <Transactions></Transactions>
        )}

        <div className="p-6 min-h-screen"></div>
      </div>
    </BasePage>
  );
};

export default TransactionsPage;
