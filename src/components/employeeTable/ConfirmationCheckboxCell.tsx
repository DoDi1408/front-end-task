import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Tasks } from "@/lib/types";

function ConfirmationCheckboxCell({
  row,
}: {
  row: { original: Tasks[number] };
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const taskComplete = row.original.stateTask === 2;

  const completeTask = async () => {
    const token = localStorage.getItem("jwt");
    const task = {
      id: row.original.id,
      dueDate: row.original.dueDate,
      description: row.original.description,
      title: row.original.title,
      stateTask: 2,
    };

    try {
      const res = await axios({
        method: "put",
        url: `https://api.romongo.uk/tasks/updateTask`,
        headers: {
          token: token || "",
        },
        data: task,
      });

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
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

export default ConfirmationCheckboxCell;
