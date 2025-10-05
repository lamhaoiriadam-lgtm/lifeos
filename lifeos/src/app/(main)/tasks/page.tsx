
"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import TaskForm from "./components/TaskForm";
import { isToday, isTomorrow, isWithinInterval, startOfWeek, endOfWeek, format, addDays } from "date-fns";
import WeeklyTasksCard from "./components/WeeklyTasksCard";
import DailyTasksCard from "./components/DailyTasksCard";

export default function TasksPage() {
  const { state } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultDueDate, setDefaultDueDate] = useState<string | undefined>(undefined);

  const { weeklyTasks, todayTasks, tomorrowTasks } = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const allTasks = state.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return {
      weeklyTasks: allTasks.filter(task => isWithinInterval(new Date(task.dueDate), { start: weekStart, end: weekEnd })),
      todayTasks: allTasks.filter(task => isToday(new Date(task.dueDate))),
      tomorrowTasks: allTasks.filter(task => isTomorrow(new Date(task.dueDate))),
    };
  }, [state.tasks]);

  const handleAddTask = (date: Date) => {
    setDefaultDueDate(format(date, "yyyy-MM-dd"));
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setDefaultDueDate(undefined);
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyTasksCard 
          title="Today" 
          tasks={todayTasks} 
          onAddTask={() => handleAddTask(new Date())}
        />
        <DailyTasksCard 
          title="Tomorrow" 
          tasks={tomorrowTasks}
          onAddTask={() => handleAddTask(addDays(new Date(), 1))}
        />
      </div>

      <WeeklyTasksCard 
        tasks={weeklyTasks}
        onAddTask={() => handleAddTask(new Date())}
      />

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onFinished={handleCloseForm}
            dueDate={defaultDueDate}
          />
          </DialogContent>
      </Dialog>
    </div>
  );
}


