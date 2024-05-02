import React, { useState } from "react";
import { DataTable } from "../components/employeeTable/data-table";
import { Payment, columns } from "../components/employeeTable/columns";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";

const data: Payment[] = [
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    taskName: "CI Flow",
    status: "pending",
    description: "Configure the CI pipeline for the project.",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    taskName: "CD Pipeline",
    status: "completed",
    description: "Implement the CD pipeline for the deployment.",
  },
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    taskName: "Build Blast",
    status: "deleted",
    description: "Blast the builds and deploy.",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    taskName: "Deploy Dash",
    status: "In progress",
    description: "Setup the deployment dashboard.",
  },
];

const EmployeeDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Payment | null>(null);

  const columnsWithDialog: ColumnDef<Payment>[] = columns.map((column) => {
    if (column.id === "viewDescription") {
      return {
        ...column,
        cell: ({ row }: { row: { original: Payment } }) => (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedTask(row.original);
              setDialogOpen(true);
            }}
          >
            View
          </Button>
        ),
      };
    }
    return column;
  });

  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">Tasks</h1>
      <div className="container mx-auto py-5">
        <DataTable columns={columnsWithDialog} data={data} />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.taskName}</DialogTitle>
            <DialogDescription>
              {selectedTask?.description || "No description available"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeDashboard;
