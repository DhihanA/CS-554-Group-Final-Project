import { React, useState } from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import AccountCard from "../components/AccountCard";
import ChildCard from "../components/ChildCard";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import queries from "../queries";

const DashboardPage = ({ isParent }) => {
  const { user } = useUser();
  console.log("user here: ", user.id);

  // https://medium.com/@khorvath3327/implementing-a-hashing-algorithm-in-node-js-9bbe56caab28
  // func to create a 4 digut num based on ther checking/savings acc id
  const createAccNum = (id) => {
    let hash = 5381;

    for (let i = 0; i < id.length; i++) {
      hash = (hash * 33) ^ id.charCodeAt(i);
    }
    hash = hash >>> 0; // making sure its positive
    const code = hash % 10000; // making it 4 digits

    // returning the 4-digit stringified code, making sure its padded with leading 0s if need be
    return code.toString().padStart(4, "0");
  };

  // * successful single query of checking acc info by user ID
  const {
    loading: checkingLoading,
    error: checkingError,
    data: checkingData,
  } = useQuery(queries.CHECKING_ACCOUNT_INFO_BY_USER_ID, {
    variables: {
      userId: user.id,
    },
    fetchPolicy: "network-only",
    pollInterval: 1500,
  });

  // * successful single query of savings acc info by user ID
  const {
    loading: savingsLoading,
    error: savingsError,
    data: savingsData,
  } = useQuery(queries.SAVINGS_ACCOUNT_INFO_BY_USER_ID, {
    variables: {
      userId: user.id,
    },
    fetchPolicy: "network-only",
    pollInterval: 1500,
  });

  const {
    loading: getChildrenLoading,
    error: getChildrenError,
    data: getChildrenData,
  } = useQuery(queries.GET_CHILDREN_BY_PARENT_ID, {
    variables: {
      parentUserId: user.id,
    },
    fetchPolicy: "network-only",
    pollInterval: 1500,
  });

  console.log(getChildrenData);

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = (
      <h1 className="text-2xl font-bold m-4">Good morning, {user.firstName}</h1>
    );
  } else if (hour < 18) {
    greeting = (
      <h1 className="text-2xl font-bold m-4">
        Good afternoon, {user.firstName}
      </h1>
    );
  } else {
    greeting = (
      <h1 className="text-2xl font-bold m-4">Good evening, {user.firstName}</h1>
    );
  }

  if (!isParent && checkingData && savingsData) {
    const { getCheckingAccountInfo } = checkingData;
    // setCheckingAccInfo(getCheckingAccountInfo);
    // console.log(getCheckingAccountInfo);

    const { getSavingsAccountInfo } = savingsData;
    // console.log(getSavingsAccountInfo);

    const checkingAccNum = createAccNum(getCheckingAccountInfo._id);
    // console.log("checking acc ID code: ", checkingAccNum);

    const savingsAccNum = createAccNum(getSavingsAccountInfo._id);
    // console.log("checking acc ID code: ", savingsAccNum);

    return (
      <BasePage>
        <div className="flex justify-center">
          {" "}
          {/* Added to center content */}
          <div className="p-6 min-h-screen max-w-4xl w-full">
            {" "}
            {/* Set maximum width and full width */}
            {greeting}
            <h1 className="text-2xl font-bold m-4">Bank Accounts</h1>
            <AccountCard
              accountType="checking account"
              accountNumber={`...${checkingAccNum}`}
              balance={getCheckingAccountInfo.balance}
            />
            <AccountCard
              accountType="savings account"
              accountNumber={`...${savingsAccNum}`}
              balance={getSavingsAccountInfo.currentBalance}
              accountId={getSavingsAccountInfo._id}
            />
          </div>
        </div>
      </BasePage>
    );
  } else if (!isParent && (checkingError || savingsError)) {
    return (
      <BasePage>
        <div className="flex justify-center">
          {" "}
          <div className="p-6 min-h-screen max-w-4xl w-full">
            {" "}
            <h1 className="text-2xl font-bold m-4">
              {checkingError
                ? checkingError.message
                : savingsError
                ? savingsError.message
                : "Something went wrong..."}
            </h1>
          </div>
        </div>
      </BasePage>
    );
  } else if (isParent && getChildrenData) {
    return (
      <BasePage>
        <div className="flex justify-center">
          {" "}
          <div className="p-6 min-h-screen max-w-4xl w-full">
            {" "}
            {greeting}
            <p className="pl-4">
              Your verification code is:{" "}
              <span className="font-bold">
                {user.publicMetadata.verificationCode}
              </span>
            </p>
            <p className="pl-4">
              Give this to your children when they sign up.
            </p>
            <h1 className="text-xl font-bold m-4">Your Children:</h1>
            {getChildrenData.getChildren.map((child) => {
              return (
                <div key={child.id}>
                  <ChildCard
                    id={child.id}
                    firstName={child.firstName}
                    lastName={child.lastName}
                    imageUrl={child.imageUrl}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </BasePage>
    );
  }
};

export default DashboardPage;
