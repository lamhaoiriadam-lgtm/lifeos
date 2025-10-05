"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import type { Habit } from "@/lib/types";
import { format, subDays, isSameDay } from "date-fns";
import { Check, Flame, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useState, useEffect, useMemo } from "react";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { dispatch } = useAppContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggleToday = () => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayCompletion = habit.completions.find(c => c.date === todayStr);

    let newCompletions;
    if (todayCompletion) {
      newCompletions = habit.completions.map(c => 
        c.date === todayStr ? { ...c, completed: !c.completed } : c
      );
    } else {
      newCompletions = [...habit.completions, { date: todayStr, completed: true }];
    }

    dispatch({ type: 'UPDATE_HABIT', payload: { ...habit, completions: newCompletions } });
  };
  
  const { streak, isCompletedToday } = useMemo(() => {
    const calculateStreak = (completions: { date: string, completed: boolean }[]) => {
      let currentStreak = 0;
      const sortedCompletions = completions
        .filter(c => c.completed)
        .map(c => new Date(c.date))
        .sort((a, b) => b.getTime() - a.getTime());

      if (sortedCompletions.length === 0) return 0;
      
      let currentDate = new Date();
      // If not completed today, check streak from yesterday
      if (!sortedCompletions.some(d => isSameDay(d, currentDate))) {
          currentDate = subDays(currentDate, 1);
      }
      
      // If the most recent completion wasn't today or yesterday, streak is 0
      if(!isSameDay(sortedCompletions[0], currentDate) && !isSameDay(sortedCompletions[0], subDays(new Date(), 1))) return 0;

      for (const date of sortedCompletions) {
          if (isSameDay(date, currentDate)) {
              currentStreak++;
              currentDate = subDays(currentDate, 1);
          } else {
              break;
          }
      }
      return currentStreak;
    };
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const completedToday = habit.completions.some(c => c.date === todayStr && c.completed);
    
    return {
        streak: calculateStreak(habit.completions),
        isCompletedToday: completedToday
    };

  }, [habit.completions]);


  const weekDays = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();

  const handleDelete = () => {
    dispatch({ type: 'DELETE_HABIT', payload: habit.id });
  }

  if (!isClient) {
    return null; // Or a skeleton loader
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{habit.name}</CardTitle>
          <CardDescription>{habit.category}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(habit)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the habit "{habit.name}". Are you sure?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between rounded-md bg-muted p-3">
          <span className="font-medium">Current Streak</span>
          <div className="flex items-center gap-1">
            <Flame className={cn("h-5 w-5", streak > 0 ? "text-orange-500 fill-current" : "text-muted-foreground")} />
            <span className="font-bold text-lg">{streak} days</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Last 7 Days</p>
          <div className="flex justify-between gap-1">
            {weekDays.map(day => {
              const completed = habit.completions.some(c => c.completed && isSameDay(new Date(c.date), day));
              return (
                <div key={day.toString()} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{format(day, 'E')}</span>
                  <div className={cn("w-6 h-6 rounded flex items-center justify-center", completed ? 'bg-green-500' : 'bg-muted')}>
                    {completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleToggleToday} className="w-full" variant={isCompletedToday ? "secondary" : "default"}>
          <Check className="mr-2 h-4 w-4" />
          {isCompletedToday ? "Mark as Incomplete" : "Complete for Today"}
        </Button>
      </CardFooter>
    </Card>
  );
}
