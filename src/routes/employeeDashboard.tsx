import React from "react";

import { DataTable } from "../components/employeeTable/data-table";
import { Payment, columns } from "../components/employeeTable/columns";

const data: Payment[] = [
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    taskName: "CI Flow",
    status: "pending",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    taskName: "CD Pipeline",
    status: "completed",
  },
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    taskName: "Build Blast",
    status: "deleted",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    taskName: "Deploy Dash",
    status: "In progress",
  },
];

const EmployeeDashboard = () => {
  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">Tasks</h1>
      <div className="container mx-auto py-5">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default EmployeeDashboard;
