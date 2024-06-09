import { ColumnDef } from "@tanstack/react-table";
import {
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  CircleEllipsis,
} from "lucide-react";
import { TasksManager } from "@/lib/types";

const statusIconMap = {
  0: <CircleEllipsis className="text-blue-500" />, // Todo
  1: <Clock className="text-yellow-500" />, // IN progress
  2: <CheckCircle className="text-green-500" />, // completed
  3: <Trash2 className="text-red-500" />,
};

export const columns: ColumnDef<TasksManager>[] = [
  {
    accessorKey: "description",
    header: "Task Name",
  },
  {
    accessorKey: "stateTask",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("stateTask") as keyof typeof statusIconMap;
      return statusIconMap[status] || <XCircle />;
    },
  },
  {
    accessorKey: "employeeName",
    header: "Employee Name",
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
];
