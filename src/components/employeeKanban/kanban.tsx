import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  DragEvent,
} from "react";
import { FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../ui/button";
import { Tasks } from "../../lib/types";

export const CustomKanban = ({
  tasks,
  setTasks,
}: {
  tasks: Tasks;
  setTasks: Dispatch<SetStateAction<Tasks>>;
}) => {
  return (
    <div className="h-screen w-full bg-[#F4F3F2] text-neutral-50 flex justify-center items-center p-4">
      <Board tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

const Board = ({
  tasks,
  setTasks,
}: {
  tasks: Tasks;
  setTasks: Dispatch<SetStateAction<Tasks>>;
}) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const formattedTasks = tasks.map((task) => ({
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      column: mapStateTaskToColumn(task.stateTask),
    }));
    setCards(formattedTasks);
  }, [tasks]);

  const completeTask = async () => {
    if (!selectedCard) return;

    const token = localStorage.getItem("jwt");
    const task = {
      id: selectedCard.id,
      title: selectedCard.title,
      description: selectedCard.description,
      dueDate: selectedCard.dueDate,
      stateTask: 2,
    };

    try {
      await axios.put("https://api.romongo.uk/tasks/updateTask", task, {
        headers: { token: token || "" },
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === parseInt(selectedCard.id)
            ? { ...task, stateTask: 2 }
            : task
        )
      );

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCard.id ? { ...card, column: "done" } : card
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedCard(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCard) return;

    const token = localStorage.getItem("jwt");

    try {
      await axios.delete(
        `https://api.romongo.uk/tasks/deleteTask/${selectedCard.id}`,
        {
          headers: { token: token || "" },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== parseInt(selectedCard.id))
      );

      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== selectedCard.id)
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedCard(null);
    }
  };

  const handleDragEnd = async (e: DragEvent, targetColumn: ColumnType) => {
    const cardId = e.dataTransfer.getData("cardId");

    const updatedCards = [...cards];
    const draggedCardIndex = updatedCards.findIndex(
      (card) => card.id === cardId
    );
    if (draggedCardIndex === -1) return;

    if (targetColumn === "done") {
      setSelectedCard(updatedCards[draggedCardIndex]);
      setConfirmOpen(true);
      return;
    }

    updatedCards[draggedCardIndex].column = targetColumn;

    const token = localStorage.getItem("jwt");
    const updatedTask = updatedCards[draggedCardIndex];
    const task = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      dueDate: updatedTask.dueDate,
      stateTask: mapColumnToStateTask(updatedTask.column),
    };

    try {
      await axios.put("https://api.romongo.uk/tasks/updateTask", task, {
        headers: { token: token || "" },
      });

      setCards(updatedCards);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === parseInt(task.id) ? { ...t, stateTask: task.stateTask } : t
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <>
      <div className="flex h-full w-full max-w-screen-lg gap-4 overflow-hidden p-6 bg-white shadow-lg rounded-xl">
        <Column
          title="TO DO"
          column="todo"
          headingColor="text-blue-500"
          cards={cards}
          handleDragEnd={handleDragEnd}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-yellow-500"
          cards={cards}
          handleDragEnd={handleDragEnd}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-green-500"
          cards={cards}
          handleDragEnd={handleDragEnd}
          setConfirmOpen={setConfirmOpen}
          setSelectedCard={setSelectedCard}
        />
        <BurnBarrel
          cards={cards}
          setSelectedCard={setSelectedCard}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
        />
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure this task is complete?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-x-20 mt-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={completeTask}>
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
              <Button variant="default" onClick={handleDeleteConfirm}>
                Yes, delete it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const mapStateTaskToColumn = (stateTask: number): ColumnType => {
  switch (stateTask) {
    case 0:
      return "todo";
    case 1:
      return "doing";
    case 2:
      return "done";
    default:
      return "todo";
  }
};

const columnBackgroundColors = {
  todo: "bg-blue-100",
  doing: "bg-yellow-100",
  done: "bg-green-100",
};

const columnHeaderColors = {
  todo: "bg-blue-500",
  doing: "bg-yellow-500",
  done: "bg-green-500",
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  handleDragEnd: (e: DragEvent, column: ColumnType) => void;
  setConfirmOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedCard?: Dispatch<SetStateAction<CardType | null>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  handleDragEnd,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const onDragEnd = (e: DragEvent) => handleDragEnd(e, column);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const filteredCards = cards.filter((card) => card.column === column);

  const minHeight = Math.max(100, Math.min(500, filteredCards.length * 50));

  return (
    <div
      className={`flex flex-col w-48 border border-neutral-300 rounded-md shadow-md ${
        active ? "bg-neutral-300/50" : "bg-neutral-100"
      }`}
      style={{ minHeight: `${minHeight}px` }}
      onDrop={onDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={`p-2 flex items-center justify-between rounded-t-md ${columnBackgroundColors[column]}`}
      >
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded bg-blue-100 text-blue-600 px-2 py-0.5 text-xs font-semibold">
          {filteredCards.length}
        </span>
      </div>
      <div className="flex-1 p-2 transition-colors overflow-auto">
        {filteredCards.length === 0 && (
          <div
            className="text-center text-neutral-400"
            style={{ minHeight: "50px" }}
          >
            No tasks here
          </div>
        )}
        {filteredCards.map((card) => (
          <Card key={card.id} {...card} handleDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
};

const mapColumnToStateTask = (column: ColumnType): number => {
  switch (column) {
    case "todo":
      return 0;
    case "doing":
      return 1;
    case "done":
      return 2;
    default:
      return 0;
  }
};

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
};

const Card = ({
  title,
  id,
  column,
  description,
  dueDate,
  handleDragStart,
}: CardProps) => {
  const onDragStart = (e: DragEvent) =>
    handleDragStart(e, { title, id, column, description, dueDate });

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <div draggable="true" onDragStart={onDragStart}>
        <motion.div
          layout
          layoutId={id}
          className="cursor-grab rounded border border-neutral-300 bg-white p-2 active:cursor-grabbing shadow-lg"
        >
          <div
            className={`h-1 w-full ${columnHeaderColors[column]} mb-2`}
          ></div>
          <p className="text-sm text-neutral-800">{title}</p>
        </motion.div>
      </div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({
  cards,
  setSelectedCard,
  setDeleteConfirmOpen,
}: {
  cards: CardType[];
  setSelectedCard: Dispatch<SetStateAction<CardType | null>>;
  setDeleteConfirmOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    const cardToDelete = cards.find((c) => c.id === cardId) || null;
    setSelectedCard(cardToDelete);
    setDeleteConfirmOpen(true);
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 place-content-center rounded border text-3xl ${
        active
          ? "border-red-200 bg-red-200 text-red-500"
          : "border-red-400 bg-red-200 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type ColumnType = "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  description: string;
  dueDate: string;
  column: ColumnType;
};
