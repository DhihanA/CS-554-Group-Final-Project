import React, { useState, useEffect } from "react";
import AddBudgetedTransactionModal from "./AddBudgetedTransactionModal";
import TransferMoneyModal from "./TransferMoneyModal";
import { useMutation } from "@apollo/client";
import queries from "../queries.js";

const AccountCard = ({
  accountType,
  accountNumber,
  balance,
  deposits,
  withdrawals,
  accountId,
}) => {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
  const formattedDeposits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(deposits);
  const formattedWithdrawals = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(withdrawals);

  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
  const [isBTModalOpen, setIsBTModalOpen] = useState(false);
  const [isTMModalOpen, setIsTMModalOpen] = useState(false);

  const toggleLearnMoreModal = () => {
    setIsLearnMoreModalOpen(!isLearnMoreModalOpen);
  };
  // for budgeted transaction modal
  const toggleBTModal = () => {
    setIsBTModalOpen(!isBTModalOpen);
  };
  // for transfer money modal
  const toggleTMModal = () => {
    setIsTMModalOpen(!isTMModalOpen);
  };

  const [updateSavings] = useMutation(queries.UPDATE_SAVINGS_BALANCE);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const updateSavingsAccount = async () => {
      try {
        const response = await updateSavings({
          variables: { accountId: accountId },
        });
        const { currentBalance, previousBalance } =
          response.data.updateSavingsBalanceForLogin;
        // console.log("currentBalance: ", currentBalance);
        // console.log("previousBalance: ", previousBalance);
        setDifference((currentBalance - previousBalance).toFixed(2));
      } catch (e) {
        console.log(e);
      }
    };
    if (accountType === "savings account") {
      updateSavingsAccount();
    }
  }, []);

  return (
    <div className="card card-side bg-base-300 shadow-xl m-4">
      <div className="card-body flex-col justify-center">
        <h2 className="card-title justify-center text-center">
          {accountType.toUpperCase()} ({accountNumber})
        </h2>
        {accountType === "savings account" && difference > 0 && (
          <p className="justify-center text-center">
            Your balance went up ${difference} from transfers and interest
          </p>
        )}
        <p className="text-3xl font-bold text-center">{formattedBalance}</p>
        {/* <p className="text-base-content text-opacity-40 text-center"> */}
        {/* {accountType.toUpperCase() === "CHECKING ACCOUNT" ? (
            <div>
              This is a short-term account is for budgeting upcoming purchases
              and transferring money to others
            </div>
          ) : (
            <div>
              This is a long-term account for saving your money for larger
              purchases in the future
            </div>
          )} */}
        {/* </p> */}
      </div>
      <div className="divider divider-horizontal"></div>{" "}
      {/* This is to create a vertical divider */}
      <div className="flex flex-col justify-center p-4">
        <div className="card-actions flex-col items-center">
          <button className="btn btn-primary mb-2" onClick={toggleTMModal}>
            Transfer money
          </button>
          {accountType.toUpperCase() === "CHECKING ACCOUNT" && (
            <button className="btn btn-secondary mb-2" onClick={toggleBTModal}>
              Create budgeted transaction
            </button>
          )}
          <button className="btn btn-ghost" onClick={toggleLearnMoreModal}>
            Learn More
          </button>
        </div>
      </div>
      {isLearnMoreModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{accountType.toUpperCase()}</h3>
            {accountType.toUpperCase() === "CHECKING ACCOUNT" ? (
              <p>
                This is a short-term account for budgeting upcoming purchases
                and transferring money to others. Budgeting money is reversible,
                but transferring money to others is not, so be careful!
              </p>
            ) : (
              <p>
                This is a long-term account for saving your money for larger
                purchases in the future. It is better to keep money in this
                account because our high interest rate means you can earn money
                in the background!
              </p>
            )}
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={toggleLearnMoreModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isBTModalOpen && (
        <AddBudgetedTransactionModal toggleModal={toggleBTModal} />
      )}
      {isTMModalOpen && (
        <TransferMoneyModal
          toggleModal={toggleTMModal}
          accountType={accountType}
        />
      )}
    </div>
  );
};

export default AccountCard;
