import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";

const Transactions = () => {
  const { user } = useUser();

  const avatarUrl = user.imageUrl;
  const {
    loading: loading,
    data: data,
    error: error,
  } = useQuery(queries.GET_ALL_TRANSACTIONS, {
    fetchPolicy: "cache-and-network",
    variables: {
      // userId: user.id,
      userId: "662ecfbe17460092d935a2e4",
      accountType: "checking",
    },
  });

  console.log(user);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

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
