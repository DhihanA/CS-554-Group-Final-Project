import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import queries from "../queries";

const Transactions = () => {
  const { user } = useUser();
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransaction, setDeleteTransaction] = useState(null);

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
  const [editBudgetedTransaction] = useMutation(
    queries.EDIT_BUDGETED_TRANSACTION
  );
  const [deleteBudgetedTransaction] = useMutation(
    queries.DELETE_BUDGETED_TRANSACTION,
    {
      update: (cache, { data }) => {
        if (data.deleteBudgetedTransaction.success) {
          const existingTransactions = cache.readQuery({
            query: queries.GET_ALL_TRANSACTIONS,
            variables: {
              userId: user.id,
              checkingAccountId: user.publicMetadata.checkingAccountId,
              savingsAccountId: user.publicMetadata.savingsAccountId,
            },
          });

          if (existingTransactions) {
            cache.writeQuery({
              query: queries.GET_ALL_TRANSACTIONS,
              data: {
                getAllTransactions:
                  existingTransactions.getAllTransactions.filter(
                    (transaction) => transaction._id !== deleteTransaction._id
                  ),
              },
              variables: {
                userId: user.id,
              },
            });
          }
        }
      },
    }
  );

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

  const handleEdit = (transaction) => {
    setEditTransaction({ ...transaction });
  };

  const handleDelete = (transaction) => {
    setDeleteTransaction(transaction);
  };

  const submitEdit = async () => {
    try {
      await editBudgetedTransaction({
        variables: {
          userId: user.id,
          transactionId: editTransaction._id,
          newAmount: parseFloat(editTransaction.amount),
          newDescription: editTransaction.description,
        },
      });
      setEditTransaction(null); // Close modal after submission
    } catch (err) {
      console.error("Error editing transaction:", err);
    }
  };

  const submitDelete = async () => {
    try {
      await deleteBudgetedTransaction({
        variables: {
          ownerId: user.id,
          transactionId: deleteTransaction._id,
        },
      });
      setDeleteTransaction(null); // Close modal after submission
    } catch (err) {
      console.error("Error deleting transaction:", err);
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
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl mb-4">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">All Your Transactions</h2>
          <div className="divider"></div>
          {data.getAllTransactions.length === 0 ? (
            <h2 className="card-title text-xl">
              You currently have no transactions.
            </h2>
          ) : (
            data.getAllTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={transaction.sender.owner.imageUrl} />
                  </div>
                </div>
                <p className="flex-grow font-semibold">
                  {transaction.type === "Budgeted" ||
                  transaction.type === "SavingToCheckingTransfer" ||
                  transaction.type === "CheckingToSavingTransfer" ? (
                    <>
                      {`${transaction.sender.owner.firstName} ${transaction.sender.owner.lastName}`}
                    </>
                  ) : (
                    <>
                      {`${transaction.sender.owner.firstName} ${transaction.sender.owner.lastName} ➡️ ${transaction.receiver.owner.firstName} ${transaction.receiver.owner.lastName}`}
                    </>
                  )}
                </p>
                <p className="text-success">${transaction.amount} USD</p>
                <p className="text-gray-500">
                  {new Date(transaction.dateOfTransaction).toLocaleDateString(
                    "en-US"
                  )}
                </p>
                <p className="text-gray-500">
                  {new Date(transaction.dateOfTransaction).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
                <p className="text-gray-500">{transaction.description}</p>
                <p className="text-gray-500">{transaction.type}</p>
                {transaction.type === "Budgeted" && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(transaction)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <button onClick={handleDownload}>Download PDF</button>
      {editTransaction && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Transaction</h3>
            <input
              type="text"
              placeholder="Amount"
              className="input input-bordered w-full max-w-xs"
              value={editTransaction.amount}
              onChange={(e) =>
                setEditTransaction({
                  ...editTransaction,
                  amount: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="input input-bordered w-full max-w-xs"
              value={editTransaction.description}
              onChange={(e) =>
                setEditTransaction({
                  ...editTransaction,
                  description: e.target.value,
                })
              }
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={submitEdit}>
                Save
              </button>
              <button className="btn" onClick={() => setEditTransaction(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTransaction && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this transaction?
            </h3>
            <div className="modal-action">
              <button className="btn btn-error" onClick={submitDelete}>
                Delete
              </button>
              <button
                className="btn"
                onClick={() => setDeleteTransaction(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
