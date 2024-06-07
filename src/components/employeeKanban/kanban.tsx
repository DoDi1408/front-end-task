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
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Tasks } from "@/lib/types";

export const CustomKanban = ({ tasks }: { tasks: Tasks }) => {
  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-50">
      <Board tasks={tasks} />
    </div>
  );
};

const Board = ({ tasks }: { tasks: Tasks }) => {
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

  const handleCompleteConfirm = async () => {
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
    const task = {
      id: selectedCard.id,
      title: selectedCard.title,
      description: selectedCard.description,
      dueDate: selectedCard.dueDate,
      stateTask: 3,
    };

    try {
      await axios.put("https://api.romongo.uk/tasks/updateTask", task, {
        headers: { token: token || "" },
      });

      await axios.delete(
        `https://api.romongo.uk/tasks/deleteTask/${selectedCard.id}`,
        {
          headers: { token: token || "" },
        }
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

  return (
    <>
      <div className="flex h-full w-full gap-3 overflow-hidden p-12 bg-white shadow-md rounded-xl">
        <Column
          title="TO DO"
          column="todo"
          headingColor="text-blue-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-yellow-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-green-500"
          cards={cards}
          setCards={setCards}
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
              <Button variant="default" onClick={handleCompleteConfirm}>
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

const mapStateTaskToColumn = (stateTask: number): ColumnType => {
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

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
  setConfirmOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedCard?: Dispatch<SetStateAction<CardType | null>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  setConfirmOpen,
  setSelectedCard,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);

    const updatedCards = [...cards];
    const draggedCardIndex = updatedCards.findIndex(
      (card) => card.id === cardId
    );
    if (draggedCardIndex === -1) return;

    const targetColumn = column;

    if (targetColumn === "done" && setConfirmOpen && setSelectedCard) {
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
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

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
      className={`flex flex-col w-56 border border-neutral-300 rounded-md shadow-md ${
        active ? "bg-neutral-300/50" : "bg-neutral-100"
      }`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="p-2 flex items-center justify-between bg-neutral-100 rounded-t-md">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-800">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex-1 p-2 transition-colors overflow-auto"
      >
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
  handleDragStart: Function;
};

const Card = ({
  title,
  id,
  column,
  description,
  dueDate,
  handleDragStart,
}: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { title, id, column, description, dueDate })
        }
        className="cursor-grab rounded border border-neutral-300 bg-white p-3 active:cursor-grabbing"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <p className="text-sm text-neutral-800">{title}</p>
      </motion.div>
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
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
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
