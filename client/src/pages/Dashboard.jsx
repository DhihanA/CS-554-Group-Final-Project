import React from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";

const Dashboard = () => {
  return (
    <BasePage>
      <div>
        {/* <Card />
        <Card />
        <Card /> */}
        <Transactions></Transactions>
      </div>
    </BasePage>
  );
};

export default Dashboard;
