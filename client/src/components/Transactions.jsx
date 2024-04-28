import React from "react";
import { useUser } from "@clerk/clerk-react";

const Transactions = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }
  const avatarUrl = user.imageUrl;

  return (
    <div className="flex justify-center">
      {" "}
      {/* Horizontal centering only */}
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        {" "}
        {/* Larger card size */}
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">All Your Transactions</h2>
          <div className="divider"></div>
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatarUrl} />
              </div>
            </div>
            <p className="flex-grow font-semibold">Jose Perez</p>
            <p className="text-success">"Amount" USD</p>
            <p className="text-gray-500">9/20/2021</p>
            <p className="text-gray-500">9:41 AM</p>
            <p className="text-gray-500">This is a sample description!</p>
            <p className="text-gray-500">Transfer from Parent</p>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              </div>
            </div>
            <p className="flex-grow font-semibold">
              SenderName ➡️ RecipientName
            </p>
            <p className="text-success">4500 USD</p>
            <p className="text-gray-500">9/20/2021</p>
            <p className="text-gray-500">10:21 PM</p>
            <p className="text-gray-500">
              This is a another sample description Lorem ipsum dolor sit, amet
              consectetur adipisicing elit. Qui, excepturi ipsum voluptates
              minus earum corporis impedit, recusandae fugiat architecto
              deserunt sit tempora animi ullam maxime mollitia accusantium,
              officia praesentium error.!
            </p>
            <p className="text-gray-500">Transfer between friends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
