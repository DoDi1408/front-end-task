"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  CircleEllipsis,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type Payment = {
  id: string;
  date: string;
  name: string;
  taskName: string;
  status: "pending" | "In progress" | "completed" | "deleted";
};

const statusIconMap = {
  pending: <Clock className="text-yellow-500" />,
  "In progress": <CircleEllipsis className="text-blue-500" />,
  completed: <CheckCircle className="text-green-500" />,
  deleted: <Trash2 className="text-red-500" />,
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "taskName",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusIconMap;
      return statusIconMap[status] || <XCircle />;
    },
  },
  {
    accessorKey: "name",
    header: "Employee Name",
  },
  {
    accessorKey: "date",
    header: "Due Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
