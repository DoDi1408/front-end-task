import { useState, useEffect } from "react";
import { DataTable } from "../components/employeeTable/data-table";
import { Payment, columns } from "../components/employeeTable/columns";
import { Button } from "../components/ui/button";
import axios from "axios";
import { type Tasks } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";

const EmployeeDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Payment | null>(null);
  const [data, setData] = useState<Tasks>();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/employee/22/tasks"
      );

      setData(
        response.data.map((task) => ({
          id: task.id,
          description: task.description,
          stateTask: task.stateTask,
          dueDate: task.dueDate,
          startDate: task.startDate,
        }))
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
