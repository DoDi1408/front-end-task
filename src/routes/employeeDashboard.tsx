import { useState, useEffect } from "react";
import { DataTable } from "../components/employeeTable/data-table";
import { columns } from "../components/employeeTable/columns";
import { Button } from "../components/ui/button";
import axios from "axios";
import { type Tasks } from "@/lib/types";

/* const data: Tasks = [
  {
    id: 1212,
    dueDate: "2 de Julio",
    title: "Unit Tests",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    stateTask: 1,
  },
  {
    id: 212,
    dueDate: "5 de Julio",
    title: "Create Pipeline",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    stateTask: 2,
  },
]; */

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
  const [selectedTask, setSelectedTask] = useState<Tasks[number] | null>(null);
  const [data, setData] = useState<Tasks>();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://api.romongo.uk/employee/31/tasks"
      );

      console.log(response);

      setData(
        response.data.map((task: Tasks[number]) => ({
          id: task?.id,
          description: task?.description,
          stateTask: task?.stateTask,
          dueDate: task?.dueDate,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columnsWithDialog: ColumnDef<Tasks[number]>[] = columns.map(
    (column) => {
      if (column.id === "viewDescription") {
        return {
          ...column,
          cell: ({ row }: { row: { original: Tasks[number] } }) => (
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
    }
  );

  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">My Tasks</h1>
      <div className="container mx-auto py-5">
        <DataTable columns={columnsWithDialog} data={data ?? []} />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.description}</DialogTitle>
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
