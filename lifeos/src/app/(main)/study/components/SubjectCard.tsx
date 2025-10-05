
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Subject, StudyPriority, Lesson } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subject: Subject) => void;
  onEdit: (subject: Subject) => void;
}

const priorityVariant: { [key in StudyPriority]: "destructive" | "secondary" | "default" } = {
  high: "destructive",
  medium: "secondary",
  low: "default",
};

export default function SubjectCard({ subject, onSelect, onEdit }: SubjectCardProps) {
  const { state, dispatch } = useAppContext();

  const { totalLessons, completedLessons, progress } = useMemo(() => {
    const subjectLessons = state.lessons.filter(l => l.subjectId === subject.id);
    const total = subjectLessons.length;
    const completed = subjectLessons.filter(l => l.isCompleted).length;
    const progressValue = total > 0 ? (completed / total) * 100 : 0;
    return { totalLessons: total, completedLessons: completed, progress: progressValue };
  }, [state.lessons, subject.id]);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_SUBJECT', payload: subject.id });
  };

  return (
    <Card className="flex flex-col relative group transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEdit(subject)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete "{subject.name}" and all its lessons. Are you sure?
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
        </div>
        <div className="flex-grow cursor-pointer" onClick={() => onSelect(subject)}>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                <CardTitle>
                    {subject.name}
                </CardTitle>
                <CardDescription>
                    <Badge variant={priorityVariant[subject.priority]} className="capitalize">{subject.priority} Priority</Badge>
                </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm capitalize text-muted-foreground">Current Level: {subject.level}</p>
                    <p className="text-sm text-muted-foreground">
                        {completedLessons} / {totalLessons} lessons completed
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={progress} className="w-full" />
            </CardFooter>
        </div>
    </Card>
  );
}
