
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskItem from "./TaskItem";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WeeklyTasksCardProps {
  tasks: Task[];
  onAddTask: () => void;
}

export default function WeeklyTasksCard({ tasks, onAddTask }: WeeklyTasksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Tasks</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddTask}>
            <Plus className="h-5 w-5"/>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60">
            {tasks.length > 0 ? (
                <div className="space-y-4 pr-4">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
                </div>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">No tasks for this week.</p>
                </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

