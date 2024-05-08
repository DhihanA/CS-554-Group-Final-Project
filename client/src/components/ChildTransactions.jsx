import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import queries from "../queries";

const ChildTransactions = () => {
  const { id } = useParams();

  // get all transactions data for this user
  const {
    loading: loading,
    data: data,
    error: error,
  } = useQuery(queries.GET_ALL_TRANSACTIONS, {
    variables: {
      userId: id,
    },
    fetchPolicy: "cache-and-network",
  });
  const [generatePDF] = useMutation(queries.GENERATE_PDF_MUTATION);

  console.log(data);

  const handleDownload = async () => {
    try {
      const pdfData = await generatePDF({
        variables: {
          transactions: JSON.stringify(data.getAllTransactions),
          userId: id,
        },
      });

      if (pdfData && pdfData.data && pdfData.data.downloadTransactions) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${pdfData.data.downloadTransactions}`;
        link.download = `${id}_transactions.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error downloading the transactions PDF:", err);
    }
  };

  if (!data || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl mb-4">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl">Your Child's Transactions</h2>
          <div className="divider"></div>
          {data.getAllTransactions.length === 0 ? (
            <h2 className="card-title text-xl">
              You currently have no transactions.
            </h2>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-7 gap-4 py-2 text-center font-bold">
                <div className="col-span-1">Sender</div>
                <div className="col-span-0.5"></div>
                <div className="col-span-1">Receiver</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-1">Description</div>
              </div>
              {data.getAllTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="grid grid-cols-7 gap-4 items-center text-center py-2"
                >
                  <div className="col-span-1">
                    <div className="avatar">
                      <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={transaction.sender.owner.imageUrl} alt="" />
                      </div>
                    </div>
                    <div className="font-semibold">
                      {`${transaction.sender.owner.firstName} ${transaction.sender.owner.lastName}`}
                    </div>
                  </div>

                  <div className="col-span-1 text-3xl">➡️</div>

                  <div className="col-span-1">
                    <div className="avatar">
                      <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={transaction.receiver.owner.imageUrl} alt="" />
                      </div>
                    </div>
                    <div className="font-semibold">
                      {`${transaction.receiver.owner.firstName} ${transaction.receiver.owner.lastName}`}
                    </div>
                  </div>

                  <div className="col-span-1 text-success">
                    ${transaction.amount} USD
                  </div>
                  <div className="col-span-1 text-gray-500">
                    {new Date(transaction.dateOfTransaction).toLocaleDateString(
                      "en-US"
                    )}
                  </div>
                  <div className="col-span-1 text-gray-500">
                    {new Date(transaction.dateOfTransaction).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </div>
                  <div className="col-span-1 text-gray-500">
                    {transaction.description}
                  </div>
                  <div className="col-span-1"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleDownload}>
        Download PDF
      </button>
    </div>
  );
};

export default ChildTransactions;
