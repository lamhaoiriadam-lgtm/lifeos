
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Flame, CalendarDays } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useMemo, useState, useEffect } from "react";
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface SummaryData {
    workoutsThisWeek: number;
    totalDurationThisMonth: number;
    totalWorkoutsThisMonth: number;
}

export default function FitnessSummary() {
  const { state } = useAppContext();
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const workoutsThisWeek = state.workouts.filter((w) =>
      isWithinInterval(new Date(w.date), { start: weekStart, end: weekEnd })
    ).length;

    const totalDurationThisMonth = state.workouts.filter((w) =>
      isWithinInterval(new Date(w.date), { start: monthStart, end: monthEnd })
    ).reduce((sum, w) => sum + w.duration, 0);

    const totalWorkoutsThisMonth = state.workouts.filter((w) =>
        isWithinInterval(new Date(w.date), { start: monthStart, end: monthEnd })
    ).length;

    setSummary({ workoutsThisWeek, totalDurationThisMonth, totalWorkoutsThisMonth });
  }, [state.workouts]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.workoutsThisWeek ?? '-'}</div>
          <p className="text-xs text-muted-foreground">sessions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Duration (Month)</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary ? (summary.totalDurationThisMonth / 60).toFixed(1) : '-'}h</div>
          <p className="text-xs text-muted-foreground">Total time this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts (Month)</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.totalWorkoutsThisMonth ?? '-'}</div>
          <p className="text-xs text-muted-foreground">sessions this month</p>
        </CardContent>
      </Card>
    </div>
  );
}
