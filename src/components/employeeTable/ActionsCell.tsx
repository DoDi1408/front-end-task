import { useState } from "react";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Tasks } from "@/lib/types";

function ActionsCell({ row }: { row: { original: Tasks[number] } }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const task = row.original;

  const deleteTask = async () => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.delete(`https://api.romongo.uk/tasks/deleteTask/${task.id}`, {
        headers: { token: token || "" },
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
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
            Copy task ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 bg-red-100 hover:bg-red-200"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash2 className="mr-2 text-red-600" /> Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this task?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-x-20 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={deleteTask}>
                Yes, delete it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ActionsCell;
