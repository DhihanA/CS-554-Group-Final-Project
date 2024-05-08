import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import TransferMoneyToChildModal from "./TransferMoneyToChildModal.jsx";
import queries from "../queries.js";

const ChildCard = ({ id, firstName, lastName, imageUrl }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(
    queries.CHECKING_ACCOUNT_INFO_BY_USER_ID,
    {
      variables: {
        userId: id,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [isTMModalOpen, setIsTMModalOpen] = useState(false);

  // for transfer money modal
  const toggleTMModal = () => {
    setIsTMModalOpen(!isTMModalOpen);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.getCheckingAccountInfo.balance);

  return (
    <div className="card card-side bg-base-300 shadow-xl m-4 flex items-center">
      <figure className="pl-5 pt-8 self-start">
        <img
          src={imageUrl}
          alt={`${firstName} ${lastName}`}
          className="w-24 h-24 rounded-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        <p className="text-3xl font-bold">{formattedBalance}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={toggleTMModal}>
            Transfer Money
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/transactions/${id}`)}
          >
            View Transactions
          </button>
        </div>
      </div>
      {isTMModalOpen && (
        <TransferMoneyToChildModal
          toggleModal={toggleTMModal}
          childUserId={id}
          firstName={firstName}
        />
      )}
    </div>
  );
};

export default ChildCard;
