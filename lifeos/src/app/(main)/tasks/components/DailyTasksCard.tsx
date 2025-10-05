
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskItem from "./TaskItem";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DailyTasksCardProps {
  title: string;
  tasks: Task[];
  onAddTask: () => void;
}

export default function DailyTasksCard({ title, tasks, onAddTask }: DailyTasksCardProps) {
  const isToday = title === "Today";

  return (
    <Card className={cn(
      "transition-all duration-200 ease-in-out hover:shadow-lg",
      isToday ? "border-primary/50" : "",
      !isToday && "bg-muted/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={cn(isToday && "text-primary")}>{title}</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddTask}>
            <Plus className="h-5 w-5"/>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {tasks.length > 0 ? (
            <div className="space-y-4 pr-4">
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">No tasks for {title.toLowerCase()}.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
