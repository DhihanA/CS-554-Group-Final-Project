import React from "react";
import { Card, Avatar } from "@nextui-org/react";

const Transactions = () => {
  return (
    <Card className="max-w-[400px] mx-4">
      <Card className="py-10">
        <div className="p-center mb-5">
          <p>Latest Transactions</p>
        </div>

        {/* Transaction Item */}
        <div className="flex items-center justify-between gap-6 py-4">
          <Avatar
            size="md"
            pointer
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            bordered
            color="gradient"
            stacked
          />
          <p size="$base" weight="semibold">
            Jose Perez
          </p>
          <p className="p-green-600" size="$xs">
            4500 USD
          </p>
          <p className="p-gray-600" size="$xs">
            9/20/2021
          </p>
        </div>
        <div className="flex items-center justify-between gap-6 py-4">
          <Avatar
            size="md"
            pointer
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            bordered
            color="gradient"
            stacked
          />
          <p size="$base" weight="semibold">
            Jose Perez
          </p>
          <p className="p-green-600" size="$xs">
            4500 USD
          </p>
          <p className="p-gray-600" size="$xs">
            9/20/2021
          </p>
        </div>
      </Card>
    </Card>
  );
};

export default Transactions;
