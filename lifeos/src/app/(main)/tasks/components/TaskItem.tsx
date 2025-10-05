
"use client";

import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  task: Task;
}

const priorityClasses: { [key in TaskPriority]: string } = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

export default function TaskItem({ task }: TaskItemProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();

  const handleToggleStatus = () => {
    const newStatus: TaskStatus = task.status === "done" ? "inProgress" : "done";
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    };
    dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    if (newStatus === "done") {
        toast({ title: "Task Completed!", description: `"${task.title}" marked as done.`})
    }
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
    toast({ title: 'Task deleted', description: 'The task has been removed.'});
  };

  return (
    <div className={cn(
      "flex items-center gap-4 rounded-md border p-3 bg-card",
      "transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5",
      priorityClasses[task.priority],
      "border-l-4",
       task.status === 'done' && 'bg-muted'
    )}>
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={handleToggleStatus}
        aria-label="Mark task as done"
        id={`task-${task.id}`}
      />
      <label htmlFor={`task-${task.id}`} className="flex-grow cursor-pointer">
        <p className={cn("font-medium", task.status === 'done' && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
        <p className="text-sm text-muted-foreground">
          Due: {format(new Date(task.dueDate), "MMM d")}
        </p>
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
             {/* Edit functionality can be added here if needed */}
             <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
             </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
