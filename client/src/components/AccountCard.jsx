import React, { useState } from "react";

const AccountCard = ({
  accountType,
  accountNumber,
  balance,
  deposits,
  withdrawals,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="card card-side bg-base-300 shadow-xl">
      <div className="card-body flex-col justify-center">
        <h2 className="card-title justify-center text-center">
          {accountType.toUpperCase()} ({accountNumber})
        </h2>
        <p className="text-3xl font-bold text-center">{formattedBalance}</p>
        <p className="text-base-content text-opacity-40 text-center">
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
        </p>
      </div>
      <div className="divider divider-horizontal"></div>{" "}
      {/* This is to create a vertical divider */}
      <div className="flex flex-col justify-center p-4">
        <div className="mb-4">
          <p className="text-sm text-success text-center">
            +{formattedDeposits}
          </p>
          <p className="text-xs text-base-content text-opacity-40 text-center">
            Deposits this month
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-error text-center">
            -{formattedWithdrawals}
          </p>
          <p className="text-xs text-base-content text-opacity-40 text-center">
            Withdrawals this month
          </p>
        </div>
        <div className="card-actions flex-col items-center">
          <button className="btn btn-primary mb-2">Transfer money</button>
          <button className="btn btn-ghost" onClick={toggleModal}>
            Learn More
          </button>
        </div>
      </div>
      {isModalOpen && (
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
              <button className="btn btn-primary" onClick={toggleModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountCard;
