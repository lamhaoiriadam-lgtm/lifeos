
"use client";
import { useState, useEffect } from "react";
import {
  CheckSquare,
  Target,
  DollarSign,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import SummaryCard from "./components/SummaryCard";
import WelcomeHeader from "./components/WelcomeHeader";
import { useAppContext } from "@/context/AppContext";
import { isToday, startOfWeek, endOfWeek, isWithinInterval, getMonth, getYear } from "date-fns";
import DashboardTasks from "./components/DashboardTasks";
import HabitOverview from "./components/HabitOverview";

interface SummaryData {
    tasks: { value: string; description: string; };
    habits: { value: string; description: string; };
    finance: { value: string; description: string; };
    study: { value: string; description: string; };
    fitness: { value: string; description: string; };
}

export default function DashboardPage() {
  const { state } = useAppContext();
  const [summaries, setSummaries] = useState<SummaryData | null>(null);

  useEffect(() => {
    const today = new Date();

    const tasksCompletedToday = state.tasks.filter(
      (task) =>
        task.status === "done" && task.completedAt && isToday(new Date(task.completedAt))
    ).length;
    const totalTasksToday = state.tasks.filter((task) =>
        task.dueDate && isToday(new Date(task.dueDate))
    ).length;

    const habitsCompletedToday = state.habits.filter((habit) =>
      habit.completions.some(
        (c) => c.completed && isToday(new Date(c.date))
      )
    ).length;

    const currentMonth = getMonth(today);
    const currentYear = getYear(today);
    const monthlyIncome = state.transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'income' && getMonth(tDate) === currentMonth && getYear(tDate) === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = state.transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' && getMonth(tDate) === currentMonth && getYear(tDate) === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const monthBalance = monthlyIncome - monthlyExpenses;

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const studyHoursThisWeek =
      state.studySessions
        .filter((session) =>
          isWithinInterval(new Date(session.date), {
            start: weekStart,
            end: weekEnd,
          })
        )
        .reduce((total, session) => total + session.duration, 0) / 60;

    const workoutsThisWeek = state.workouts.filter((workout) =>
      isWithinInterval(new Date(workout.date), {
        start: weekStart,
        end: weekEnd,
      })
    ).length;

    setSummaries({
      tasks: {
        value: `${tasksCompletedToday} / ${totalTasksToday}`,
        description: "Tasks for today",
      },
      habits: {
        value: `${habitsCompletedToday} / ${state.habits.length}`,
        description: "Habits for today",
      },
      finance: {
        value: `$${monthBalance.toFixed(2)}`,
        description: `Income: $${monthlyIncome.toFixed(2)}, Expenses: $${monthlyExpenses.toFixed(2)}`,
      },
      study: {
        value: `${studyHoursThisWeek.toFixed(1)}h`,
        description: "Studied this week",
      },
      fitness: {
        value: `${workoutsThisWeek}`,
        description: "Workouts this week",
      },
    });
  }, [state]);

  if (!summaries) {
    // You can render a loading skeleton here if you prefer
    return (
        <div className="flex-1 space-y-4">
            <WelcomeHeader />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <SummaryCard title="Tasks" value="-" description="Loading..." icon={CheckSquare} />
                <SummaryCard title="Habits" value="-" description="Loading..." icon={Target} />
                <SummaryCard title="Month Balance" value="-" description="Loading..." icon={DollarSign} />
                <SummaryCard title="Study" value="-" description="Loading..." icon={BookOpen} />
                <SummaryCard title="Fitness" value="-" description="Loading..." icon={Dumbbell} />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DashboardTasks />
                <HabitOverview />
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <WelcomeHeader />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Tasks"
          {...summaries.tasks}
          icon={CheckSquare}
          color="text-primary"
        />
        <SummaryCard
          title="Habits"
          {...summaries.habits}
          icon={Target}
          color="text-green-500"
        />
        <SummaryCard
          title="Month Balance"
          {...summaries.finance}
          icon={DollarSign}
          color={summaries.finance.value.startsWith('-') ? "text-red-500" : "text-green-500"}
        />
        <SummaryCard
          title="Study"
          {...summaries.study}
          icon={BookOpen}
          color="text-purple-500"
        />
        <SummaryCard
          title="Fitness"
          {...summaries.fitness}
          icon={Dumbbell}
          color="text-orange-500"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardTasks />
        <HabitOverview />
      </div>
    </div>
  );
}
