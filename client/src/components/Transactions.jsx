import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";

const Transactions = () => {
  const { user } = useUser();
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransaction, setDeleteTransaction] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // get all transactions data for this user
  const { loading, data, error } = useQuery(queries.GET_ALL_TRANSACTIONS, {
    variables: { userId: user.id },
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
            variables: { userId: user.id },
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
              variables: { userId: user.id },
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
        link.download = `${user.id}_transactions`;
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

  const resetForm = () => {
    setEditTransaction(null);
    setDeleteTransaction(null);
    setErrorMsg("");
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleCancelDelete = () => {
    resetForm();
  };

  const submitEdit = async () => {
    const trimmedAmount = editTransaction.amount.toString().trim();

    if (trimmedAmount.length === 0) {
      setErrorMsg("Amount should not be empty");
      return;
    }

    const regex = /^\d+(\.\d{1,2})?$/;
    const isValid = regex.test(trimmedAmount);
    if (!isValid) {
      setErrorMsg(
        "Amount should be a whole number or a number with up to 2 decimal places"
      );
      return;
    }

    if (trimmedAmount.split(".")[1]?.length > 2) {
      setErrorMsg("Amount cannot exceed 2 decimal places");
      return;
    }

    try {
      await editBudgetedTransaction({
        variables: {
          userId: user.id,
          transactionId: editTransaction._id,
          newAmount: parseFloat(parseFloat(editTransaction.amount).toFixed(2)),
          newDescription: editTransaction.description,
        },
      });
      resetForm();
    } catch (err) {
      setErrorMsg(err.message);
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
      resetForm();
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
    <div className="flex flex-col items-center justify-center">
      <div className="card w-full max-w-4xl bg-base-300 shadow-xl mb-4">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl">Your Transactions</h2>
          <div className="divider"></div>
          {data.getAllTransactions.length === 0 ? (
            <h2 className="card-title text-xl">
              You currently have no transactions.
            </h2>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="grid grid-cols-8 gap-4 py-2 text-center font-bold">
                <div className="col-span-1">Sender</div>
                <div className="col-span-0.5"></div>
                <div className="col-span-1">Receiver</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-1">Description</div>
                <div className="col-span-1">Actions</div>
              </div>
              {data.getAllTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="grid grid-cols-8 gap-4 items-center text-center py-2"
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
                  {transaction.type === "Budgeted" && (
                    <div className="col-span-1">
                      <button
                        className="btn btn-primary mb-2"
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleDownload}>
        Download PDF
      </button>
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
              <button className="btn" onClick={handleCancelEdit}>
                Cancel
              </button>
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
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
              <button className="btn" onClick={handleCancelDelete}>
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
