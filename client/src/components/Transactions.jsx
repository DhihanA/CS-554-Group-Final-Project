import React from "react";

const Transactions = () => {
  return (
    <>
      <div className="card w-96 bg-base-100 shadow-xl mx-4">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Latest Transactions</h2>
          <div className="divider"></div>
          {/* Transaction Item */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              </div>
            </div>
            <p className="flex-grow font-semibold">Jose Perez</p>
            <p className="text-success">4500 USD</p>
            <p className="text-gray-500">9/20/2021</p>
          </div>
          {/* Repeated Transaction Item */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              </div>
            </div>
            <p className="flex-grow font-semibold">Jose Perez</p>
            <p className="text-success">4500 USD</p>
            <p className="text-gray-500">9/20/2021</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
