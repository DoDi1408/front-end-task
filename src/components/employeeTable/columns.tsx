import { ColumnDef } from "@tanstack/react-table";
import { Tasks } from "@/lib/types";
import { Button } from "../ui/button";
import ConfirmationCheckboxCell from "./ConfirmationCheckboxCell";
import ActionsCell from "./ActionsCell";
import { Clock, CheckCircle, Trash2, CircleEllipsis } from "lucide-react";

const statusIconMap = {
  0: <CircleEllipsis className="text-blue-500" />, // Todo
  1: <Clock className="text-yellow-500" />, // In Progress
  2: <CheckCircle className="text-green-500" />, // Completed
  3: <Trash2 className="text-red-500" />, // Deleted
};

export const columns: ColumnDef<Tasks[number]>[] = [
  {
    id: "select",
    header: () => null,
    cell: ConfirmationCheckboxCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Task Name",
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "stateTask",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("stateTask") as keyof typeof statusIconMap;
      return statusIconMap[status] || null;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue<string>("dueDate") + "T00:00:00");
      const formattedDate = dueDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return formattedDate;
    },
  },
  {
    id: "viewDescription",
    header: "Description",
    cell: ({ row }) => (
      <Button
        variant="outline"
        onClick={() => {
          console.log(row.original);
        }}
      >
        View
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
];
