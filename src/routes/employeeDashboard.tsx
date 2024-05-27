import { useState, useEffect } from "react";
import { DataTable } from "../components/employeeTable/data-table";
import { columns } from "../components/employeeTable/columns";
import { CustomKanban } from "../components/employeeKanban/kanban";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios
        .get("https://api.romongo.uk/employee/31/tasks")
        .catch(console.error);
      if (response) {
        setData(
          response.data.map((task: Tasks[number]) => ({
            id: task.id,
            description: task.description,
            stateTask: task.stateTask,
            dueDate: task.dueDate.substring(0, 10),
          }))
        );
      }
    };
    fetchTasks();
  }, []);

  const columnsWithDialog: ColumnDef<Tasks[number]>[] = columns.map(
    (column) => ({
      ...column,
      cell: ({ row }) =>
        column.id === "viewDescription" ? (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedTask(row.original);
              setDialogOpen(true);
            }}
          >
            View
          </Button>
        ) : null,
    })
  );

  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">My Tasks</h1>
      <div className="flex justify-end pr-1 mx-20">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm inline-block">
          <Select defaultValue="table" onValueChange={setViewMode}>
            <SelectTrigger className="px-3 py-2">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table View</SelectItem>
              <SelectItem value="kanban">Kanban View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="container mx-auto py-5">
        {viewMode === "table" ? (
          <DataTable columns={columnsWithDialog} data={data ?? []} />
        ) : (
          <CustomKanban />
        )}
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
