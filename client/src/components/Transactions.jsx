import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import queries from "../queries";

const Transactions = () => {
  const { user } = useUser();

  // get all transactions data for this user
  const {
    loading: loading,
    data: data,
    error: error,
  } = useQuery(queries.GET_ALL_TRANSACTIONS, {
    variables: {
      userId: user.id    
    },
    fetchPolicy: "cache-and-network",
  });
  const [generatePDF] = useMutation(queries.GENERATE_PDF_MUTATION);

  const handleDownload = async () => {
    try {
      const pdfData = await generatePDF({
        variables: {
          transactions: JSON.stringify(data.getAllTransactions),
          userId: user.id,
        },
      });

      if (pdfData && pdfData.data && pdfData.data.downloadTransactions) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${pdfData.data.downloadTransactions}`;
        link.download = "transactions.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error downloading the transactions PDF:", err);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center">
      {" "}
      {/* Modified to stack vertically and center items */}
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl mb-4">
        {" "}
        {/* Added margin-bottom for spacing */}
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">All Your Transactions</h2>
          <div className="divider"></div>
          {data.getAllTransactions.length === 0 ? (
            <>
              <h2 className="card-title text-xl">
                You currently have no transactions. Send money to a friend or
                transfer money to your savings to see some!
              </h2>
            </>
          ) : (
            data.getAllTransactions.map((transaction) => {
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={user.imageUrl} />
                    </div>
                  </div>
                  <p className="flex-grow font-semibold">{`${transaction.sender.owner.firstName} ${transaction.sender.owner.lastName}`}</p>
                  <p className="text-success">${transaction.amount} USD</p>
                  <p className="text-gray-500">
                    {new Date(transaction.dateOfTransaction).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                  <p className="text-gray-500">
                    {new Date(transaction.dateOfTransaction).toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )}
                  </p>
                  <p className="text-gray-500">{transaction.description}</p>
                  <p className="text-gray-500">{transaction.type}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default Transactions;
