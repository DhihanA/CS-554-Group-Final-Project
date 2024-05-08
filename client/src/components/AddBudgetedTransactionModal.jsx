import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries.js";
import { useUser } from "@clerk/clerk-react";

const AddBudgetedTransactionModal = ({ toggleModal }) => {
  const { user } = useUser();

  /* useState hooks */
  const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [addBudgetedTransaction] = useMutation(queries.ADD_BUDGETED_TRANSACTION);

  useEffect(() => {
    document.getElementById("my_modal_1").showModal();
  }, [toggleModal]);

  /* Functions */
  /* Resets all states upon form submission/cancellation */
  const resetForm = () => {
    setTransactionName("");
    setAmount(1);
    setDescription("");
    setError("");
  };
  const handleIncompleteForm = () => {
    document.getElementById("my_modal_1").close();
    toggleModal();
    resetForm();
  };

  /* Form submission */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // let trimmedTransactionName = transactionName.trim();
    let trimmedAmount = amount.toString().trim();
    let trimmedDescription = description.trim();
    // if (trimmedTransactionName.length === 0) {
    //   setError("Transaction Name should not be empty");
    //   return;
    // }
    if (trimmedAmount.length === 0) {
      setError("Amount should not be empty");
      return;
    }
    const regex = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
    if (!regex.test(trimmedAmount)) {
      setError("Amount is not a valid number");
      return;
    }
    if (trimmedAmount.includes('.') && trimmedAmount.split('.')[1].length > 2) {
      setError("Amount cannot exceed 2 decimal places");
      return;
    }
    if (trimmedDescription.length === 0) {
      setError("Description should not be empty");
      return;
    }

    const handleAddBudgetedTransaction = async () => {
      try {
        await addBudgetedTransaction({
          variables: {
            addBudgetedTransactionOwnerId2: user.id,
            addBudgetedTransactionAmount2: parseFloat(trimmedAmount).toFixed(2),
            addBudgetedTransactionDescription2: trimmedDescription
          },
        });
        document.getElementById("my_modal_1").close();
        // alert('Successful budgeted transaction');
        toggleModal();
        resetForm();
      } catch (e) {
        setError(e.message);
      }
    };

    handleAddBudgetedTransaction();
  };

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Budgeted Transaction</h3>
          <form onSubmit={handleFormSubmit} method="dialog" className="py-4">
            <p className="pb-1 font-medium text-sm">This transaction is for setting aside money for a short-term purchase.</p>
            <p className="pb-1 font-medium text-sm">You can edit/delete them in My Transactions, if you change your mind.</p>
            <div className="mb-4">
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary mr-2"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleIncompleteForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AddBudgetedTransactionModal;
