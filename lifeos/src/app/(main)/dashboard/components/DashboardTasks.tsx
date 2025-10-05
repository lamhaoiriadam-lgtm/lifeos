"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { format, isToday, isFuture } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const priorityVariant: { [key: string]: "destructive" | "secondary" | "default" } = {
  high: "destructive",
  medium: "secondary",
  low: "default",
};

export default function DashboardTasks() {
  const { state } = useAppContext();

  const upcomingTasks = useMemo(() => {
    return state.tasks
      .filter(
        (task) =>
          task.status !== "done" && (isToday(new Date(task.dueDate)) || isFuture(new Date(task.dueDate)))
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [state.tasks]);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length > 0 ? (
          <ul className="space-y-3">
            {upcomingTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-muted-foreground">
                    Due: {format(new Date(task.dueDate), "MMM d")}
                  </span>
                </div>
                <Badge variant={priorityVariant[task.priority]}>
                  {task.priority}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No upcoming tasks. Enjoy your day!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
