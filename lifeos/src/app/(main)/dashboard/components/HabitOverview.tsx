
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Check, Flame } from "lucide-react";
import { format, isSameDay, subDays } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import type { Habit } from "@/lib/types";

interface HabitWithCalculatedData extends Habit {
  isCompletedToday: boolean;
  streak: number;
}

export default function HabitOverview() {
  const { state, dispatch } = useAppContext();
  const [clientHabits, setClientHabits] = useState<HabitWithCalculatedData[]>([]);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    const calculateStreak = (completions: { date: string, completed: boolean }[]) => {
      let streak = 0;
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
              streak++;
              currentDate = subDays(currentDate, 1);
          } else {
              // Break if a day is missed
              if (streak > 0) break;
          }
      }
      return streak;
    };

    const processedHabits = state.habits.map(habit => {
      const isCompletedToday = habit.completions.some(
        (c) => c.date === todayStr && c.completed
      );
      const streak = calculateStreak(habit.completions);
      return { ...habit, isCompletedToday, streak };
    });
    setClientHabits(processedHabits);
  }, [state.habits]);


  const handleToggleHabit = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
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
  
  if (clientHabits.length === 0 && state.habits.length > 0) {
      return null; // Or a skeleton loader
  }

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {clientHabits.length > 0 ? (
          <ul className="space-y-3">
            {clientHabits.map((habit) => {
              return (
                <li
                  key={habit.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleToggleHabit(habit.id)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                        habit.isCompletedToday
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-muted-foreground hover:border-primary"
                      )}
                      aria-label={`Mark habit ${habit.name} as ${habit.isCompletedToday ? 'incomplete' : 'complete'}`}
                    >
                      {habit.isCompletedToday && <Check className="h-4 w-4" />}
                    </button>
                    <span className={cn(habit.isCompletedToday && "text-muted-foreground line-through")}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Flame
                      className={cn("h-4 w-4", habit.streak > 0 && "text-orange-500 fill-current")}
                    />
                    <span>{habit.streak}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No habits yet. Start building a new routine!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
