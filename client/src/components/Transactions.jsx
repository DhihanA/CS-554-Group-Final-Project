import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import queries from "../queries";

const Transactions = () => {
  const { user } = useUser();
  const [usersByAccountId, setUsersByAccountId] = useState({});

  const avatarUrl = user.imageUrl;

  //TODO: UNCOMMENT user.id AFTER GET_ALL_TRANSACTIONS FULLY WORKS
  // const queryMultiple = () => {
  //   const res1 = useQuery(queries.GET_ALL_TRANSACTIONS, {
  //     variables: {
  //       // userId: user.id,
  //       userId: "6632dfa8f44750c0af69ca7d", //!TESTING
  //       accountType: "checking",
  //     },
  //     fetchPolicy: "cache-and-network",
  //   });
  //   const res2 = useQuery(queries.GET_ALL_TRANSACTIONS, {
  //     variables: {
  //       // userId: user.id,
  //       userId: "6632dfa8f44750c0af69ca7d", //!TESTING
  //       accountType: "savings",
  //     },
  //     fetchPolicy: "cache-and-network",
  //   });
  //   return [res1, res2];
  // };
  // const [
  //   { loading: loadingChecking, data: checkingData, error: checkingError },
  //   { loading: loadingSavings, data: savingsData, error: savingsError },
  // ] = queryMultiple();

  const {
    loading: loadingChecking,
    data: checkingData,
    error: checkingError,
  } = useQuery(queries.GET_ALL_TRANSACTIONS, {
    variables: {
      // userId: user.id,
      userId: "6632dfa8f44750c0af69ca7d", //!TESTING
      accountType: "checking",
    },
    fetchPolicy: "cache-and-network",
  });

  //!UNCOMMENT below when getUserByAccountId done
  // const [getUserByAccountId, { called, loading, data }] = useLazyQuery(
  //   queries.GET_USER_BY_ACCOUNT_ID
  // );

  // const fetchUserData = (accountId) => {
  //   if (!usersByAccountId[accountId]) {
  //     getUserByAccountId({ variables: { accountId } });
  //   }
  // };

  // useEffect(() => {
  //   if (data && data.getUserByAccountId) {
  //     const newUserDetails = {
  //       ...usersByAccountId,
  //       [data.getUserByAccountId.id]: data.getUserByAccountId,
  //     };
  //     setUsersByAccountId(newUserDetails);
  //   }
  // }, [data, usersByAccountId]);

  if (
    !user ||
    loadingChecking
    // || loadingSavings
  ) {
    return <div>Loading...</div>;
  }

  if (checkingError) return <div>{checkingError.message}</div>;
  // if (savingsError) return <div>{savingsError.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center">
      {" "}
      {/* Modified to stack vertically and center items */}
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl mb-4">
        {" "}
        {/* Added margin-bottom for spacing */}
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">CHECKING ACCOUNT Transactions</h2>
          <div className="divider"></div>
          {/* Other content remains unchanged */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatarUrl} />
              </div>
            </div>
            <p className="flex-grow font-semibold">Jose Perez</p>
            <p className="text-success">"Amount" USD</p>
            <p className="text-gray-500">9/20/2021</p>
            <p className="text-gray-500">9:41 AM</p>
            <p className="text-gray-500">This is a sample description!</p>
            <p className="text-gray-500">Transfer from Parent</p>
          </div>
        </div>
      </div>
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">SAVINGS ACCOUNT Transactions</h2>
          <div className="divider"></div>
          {/* Other content remains unchanged */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatarUrl} />
              </div>
            </div>
            <p className="flex-grow font-semibold">Jose Perez</p>
            <p className="text-success">"Amount" USD</p>
            <p className="text-gray-500">9/20/2021</p>
            <p className="text-gray-500">9:41 AM</p>
            <p className="text-gray-500">This is a sample description!</p>
            <p className="text-gray-500">Transfer from Parent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
