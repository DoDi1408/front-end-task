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
import axios from "axios";
import { Tasks } from "@/lib/types";

const statusIconMap = {
  0: <CircleEllipsis className="text-blue-500" />, // Todo
  1: <Clock className="text-yellow-500" />, // IN progress
  2: <CheckCircle className="text-green-500" />, // completed
  3: <Trash2 className="text-red-500" />,
};

function ConfirmationCheckboxCell({
  row,
}: {
  row: { original: Tasks[number] };
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const taskComplete = row.original.stateTask === 2;

  const completeTask = async () => {
    const res = await axios({
      method: "put",
      url: `https://api.romongo.uk/tasks/${row.original.id.toString()}/updateTask?state=2`,
    });

    if (res.status == 200) {
      window.location.reload();
    }
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

export const columns: ColumnDef<Tasks[number]>[] = [
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
    accessorKey: "description",
    header: "Task Name",
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
      const dueDate = new Date(row.getValue<string>("dueDate"));
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

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
              onClick={() => navigator.clipboard.writeText(task.id.toString())}
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
