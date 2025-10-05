"use client";

import { useState } from "react";
import HabitCard from "./components/HabitCard";
import HabitForm from "./components/HabitForm";
import { useAppContext } from "@/context/AppContext";
import type { Habit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HabitsPage() {
  const { state } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);

  const handleEdit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedHabit(undefined);
    setIsFormOpen(true);
  }

  const handleFormFinished = () => {
    setIsFormOpen(false);
    setSelectedHabit(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Habit
        </Button>
      </div>
      {state.habits.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="text-xl font-semibold">No habits yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">Start building positive routines by adding your first habit.</p>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Habit
            </Button>
        </div>
      )}
       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedHabit ? "Edit Habit" : "Add New Habit"}</DialogTitle>
          </DialogHeader>
          <HabitForm habit={selectedHabit} onFinished={handleFormFinished} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
