import {React, useState} from "react";
import BasePage from "./BasePage";
import Card from "../components/CardComponent";
import Transactions from "../components/Transactions";
import AccountCard from "../components/AccountCard";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import queries from "../queries";

const DashboardPage = ({ isParent }) => {
  const [checkingAccInfo, setCheckingAccInfo] = useState(undefined);
  const [savingsAccInfo, setSavingsAccInfo] = useState(undefined);

  const { user } = useUser();

  console.log('user.id here: ', user.id);
  // console.log(user);

  //TODO: UNCOMMENT user.id AFTER GET_ALL_TRANSACTIONS FULLY WORKS
  // const queryMultiple = () => {
  //   const res1 = useQuery(queries.CHECKING_ACCOUNT_INFO_BY_USER_ID, {
  //     variables: {
  //       userId: user.id
  //       // accountType: "checking",
  //     },
  //     fetchPolicy: "cache-and-network",
  //   });
  //   const res2 = useQuery(queries.SAVINGS_ACCOUNT_INFO_BY_USER_ID, {
  //     variables: {
  //       userId: user.id
  //       // accountType: "savings",
  //     },
  //     fetchPolicy: "cache-and-network",
  //   });
  //   return [res1, res2];
  // };
  // const [
  //   { loading: loadingChecking, data: checkingData, error: checkingError },
  //   { loading: loadingSavings, data: savingsData, error: savingsError },
  // ] = queryMultiple();

  // * successful single query of checking acc info by user ID
  const {loading: checkingLoading, error: checkingError, data: checkingData} = useQuery(queries.CHECKING_ACCOUNT_INFO_BY_USER_ID, {
    variables: {
      userId: user.id
      // accountType: "checking",
    },
    fetchPolicy: "cache-and-network",
  });
  // if (checkingLoading) {
  //   return <div></div>
  // }

  // console.log(checkingData);
  // if (checkingData) { 
  //   const {getCheckingAccountInfo} = checkingData;
  //   setCheckingAccInfo(getCheckingAccountInfo); 
  //   console.log(getCheckingAccountInfo);
  // }


    // * successful single query of savings acc info by user ID
    const {loading: savingsLoading, error: savingsError, data: savingsData} = useQuery(queries.SAVINGS_ACCOUNT_INFO_BY_USER_ID, {
      variables: {
        userId: user.id
        // accountType: "savings",
      },
      fetchPolicy: "cache-and-network",
    });
    // console.log(savingsData);
    // if (savingsData) { 
    //   const {getSavingsAccountInfo} = savingsData; 
    //   setSavingsAccInfo(getSavingsAccountInfo);
    //   console.log(getSavingsAccountInfo);
    // }

    // if (savingsError) {
    //   return (
    //     <div>u fucked up: {savingsError.message}</div>
    //   )
    // }

  
  // if (checkingData) {
  //   const {getCheckingAccountInfo} = checkingData;
  //   return (
  //     <div>
  //       it worked!!! helllooooooo
  //     </div>
  //   )
  // }
  // else if (checkingLoading) {
  //   return (
  //   <div>loading...!!!</div>
  //   )
  // }
  // else if (checkingError) {
  //   return (
  //     <div><h1>u fucked up: {checkingError.message}</h1></div>
  //   )
  // }

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = (
      <h1 className="text-2xl font-bold m-4">
        Good morning, {user.firstName} {isParent && <> (PARENT)</>}
      </h1>
    );
  } else if (hour < 18) {
    greeting = (
      <h1 className="text-2xl font-bold m-4">
        Good afternoon, {user.firstName} {isParent && <> (PARENT)</>}
      </h1>
    );
  } else {
    greeting = (
      <h1 className="text-2xl font-bold m-4">
        Good evening, {user.firstName} {isParent && <> (PARENT)</>}
      </h1>
    );
  }

  if (checkingData && savingsData) {
    const {getCheckingAccountInfo} = checkingData;
    // setCheckingAccInfo(getCheckingAccountInfo); 
    console.log(getCheckingAccountInfo);

    const {getSavingsAccountInfo} = savingsData;
    console.log(getSavingsAccountInfo);



    return (
      <BasePage>
        <div className="flex justify-center">
          {" "}
          {/* Added to center content */}
          <div className="p-6 min-h-screen max-w-4xl w-full">
            {" "}
            {/* Set maximum width and full width */}
            {greeting}
            <h1 className="text-2xl font-bold m-4">Bank accounts</h1>
            <AccountCard
              accountType="checking account"
              accountNumber="...3137"
              balance={getCheckingAccountInfo.balance}
              deposits={5005.09}
              withdrawals={2430.0}
            />
            <AccountCard
              accountType="savings account"
              accountNumber="...2227"
              balance={getSavingsAccountInfo.currentBalance}
              deposits={0}
              withdrawals={0}
            />
          </div>
        </div>
      </BasePage>
    );
  }
  else if (checkingError || savingsError) {
    return (
      <BasePage>
        <div className="flex justify-center">
          {" "}
          <div className="p-6 min-h-screen max-w-4xl w-full">
            {" "}
            <h1 className="text-2xl font-bold m-4">Something went wrong...</h1>
          </div>
        </div>
      </BasePage>
    );  

  }

};

export default DashboardPage;
