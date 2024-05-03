import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Clock,
  CheckCircle,
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
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Payment = {
  id: string;
  date: string;
  taskName: string;
  status: "pending" | "In progress" | "completed" | "deleted";
  description?: string;
  isCompleted?: boolean;
};

const statusIconMap = {
  pending: <Clock className="text-yellow-500" />,
  "In progress": <CircleEllipsis className="text-blue-500" />,
  completed: <CheckCircle className="text-green-500" />,
  deleted: <Trash2 className="text-red-500" />,
};

function ConfirmationCheckboxCell({ row }: { row: { original: Payment } }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskComplete, setTaskComplete] = useState(
    row.original.isCompleted || false
  );

  const completeTask = () => {
    row.original.isCompleted = true;
    setTaskComplete(true);
    setConfirmOpen(false);
  };

  return (
    <>
      <Checkbox
        checked={taskComplete}
        onCheckedChange={() => {
          if (!taskComplete) setConfirmOpen(true);
        }}
        aria-label="Complete task"
        disabled={taskComplete}
      />
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure this task is complete?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-x-20 mt-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Back to table
              </Button>
              <Button variant="default" onClick={completeTask}>
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ConfirmationCheckboxCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskName",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusIconMap;
      return statusIconMap[status] || null;
    },
  },
  {
    accessorKey: "date",
    header: "Due Date",
  },
  {
    id: "viewDescription",
    header: "Description",
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
