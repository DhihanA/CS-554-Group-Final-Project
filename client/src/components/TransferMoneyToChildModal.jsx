import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuid } from "uuid";

const TransferMoneyToChildModal = ({ toggleModal, childUserId, firstName }) => {
  const { user } = useUser();

  /* useState hooks */
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");

  const [transferMoney] = useMutation(queries.ADD_TRANSFER_TRANSACTION);

  useEffect(() => {
    document.getElementById("my_modal_2").showModal();
  }, [toggleModal]);

  /* Resets all states upon form submission/cancellation */
  const resetForm = () => {
    setAmount(1);
    setError("");
  };
  const handleIncompleteForm = () => {
    document.getElementById("my_modal_2").close();
    toggleModal();
    resetForm();
  };

  /* Form submission */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let trimmedAmount = amount.toString().trim();
    console.log(trimmedAmount);
    if (trimmedAmount.length === 0) {
      setError("Amount should not be empty");
      return;
    }

    const regex = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
    if (!regex.test(trimmedAmount)) {
      setError("Amount is not a valid number");
      return;
    }
    if (trimmedAmount.includes(".") && trimmedAmount.split(".")[1].length > 2) {
      setError("Amount cannot exceed 2 decimal places");
      return;
    }

    const handleTransferMoney = async () => {
      if (parseFloat(trimmedAmount) > 500) {
        setError(
          "Parents can only send up to $500 to their children in a single transaction"
        );
        return;
      }

      // inter-user checking to checking (parent -> child)
      try {
        await transferMoney({
          variables: {
            senderOwnerId: user.id,
            receiverOwnerId: childUserId,
            amount: parseFloat(trimmedAmount),
            description: "Transfer From Parent",
          },
        });
        document.getElementById("my_modal_2").close();
        toggleModal();
        resetForm();
      } catch (e) {
        setError(e.message);
      }
    };
    handleTransferMoney();
  };

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Transfer Money to Your Child</h3>
          <form onSubmit={handleFormSubmit} method="dialog" className="py-4">
            <p className="pb-1 font-medium text-sm">
              The transferred money will go into {firstName}'s checking account.
            </p>

            <div className="mb-4 pt-3">
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

export default TransferMoneyToChildModal;
