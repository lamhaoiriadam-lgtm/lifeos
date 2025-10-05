"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { Trash2, Dumbbell, HeartPulse, Wind, Trophy } from "lucide-react";
import type { WorkoutType } from "@/lib/types";

const workoutIcons: { [key in WorkoutType]: React.ElementType } = {
    strength: Dumbbell,
    cardio: HeartPulse,
    yoga: Wind,
    sports: Trophy,
    other: Dumbbell,
};

export default function WorkoutLog() {
  const { state, dispatch } = useAppContext();
  
  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_WORKOUT", payload: id });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
        <CardDescription>Your recent workouts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.workouts.length > 0 ? (
              state.workouts.map((workout) => {
                const Icon = workoutIcons[workout.type];
                return (
                    <TableRow key={workout.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span>{workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>
                            </div>
                        </TableCell>
                        <TableCell>{workout.duration} min</TableCell>
                        <TableCell>{format(new Date(workout.date), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{workout.notes}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No workouts logged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
