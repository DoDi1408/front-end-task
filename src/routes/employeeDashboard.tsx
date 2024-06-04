import { useState, useEffect } from "react";
import { DataTable } from "../components/employeeTable/data-table";
import { columns } from "../components/employeeTable/columns";
import { CustomKanban } from "../components/employeeKanban/kanban";
import { Button } from "../components/ui/button";
import axios from "axios";
import { type Tasks } from "@/lib/types";
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
  const [data, setData] = useState<Tasks>([]);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const config = {
          headers: { token: token },
        };
        try {
          const response = await axios.get(
            "https://api.romongo.uk/employee/tasks",
            config
          );
          console.log("Data received:", response.data);
          const newToken = response.headers["new-token"];
          if (newToken) {
            localStorage.setItem("jwt", newToken);
          }
          const formattedData = response.data.map((task: Tasks[number]) => ({
            id: task.id,
            title: task.title || "Untitled Task",
            description: task.description,
            stateTask: task.stateTask,
            dueDate: task.dueDate.substring(0, 10),
          }));
          console.log("Formatted Data:", formattedData);
          setData(formattedData);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Failed to fetch tasks:", error.message);
            if (error.response) {
              console.error("Error response data:", error.response.data);
            }
          }
        }
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
        ) : column.cell ? (
          column.cell({ row })
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
          <DataTable columns={columnsWithDialog} data={data} />
        ) : (
          <CustomKanban />
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
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
