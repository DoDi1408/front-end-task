import React from "react";

import { DataTable } from "../components/employeeTable/data-table";
import { Payment, columns } from "../components/employeeTable/columns";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed5s2f",
    amount: 120,
    status: "pending",
    email: "m@example.com",
  },
];

const Dashboard = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Dashboard;
