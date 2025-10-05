
"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Subject, Lesson, StudyLevel } from "@/lib/types";
import LessonForm from "./LessonForm";
import { cn } from "@/lib/utils";

interface LessonListProps {
  subject: Subject;
}

const levelColors: { [key in StudyLevel]: string } = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-orange-500",
    expert: "bg-red-500",
};

export default function LessonList({ subject }: LessonListProps) {
  const { state, dispatch } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>(undefined);
  const [levelFilter, setLevelFilter] = useState<"all" | StudyLevel>("all");

  const lessons = useMemo(() => {
    let subjectLessons = state.lessons.filter(l => l.subjectId === subject.id);
    if (levelFilter !== "all") {
        subjectLessons = subjectLessons.filter(l => l.level === levelFilter);
    }
    return subjectLessons;
  }, [state.lessons, subject.id, levelFilter]);

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLesson(undefined);
    setIsFormOpen(true);
  };

  const handleFormFinished = () => {
    setIsFormOpen(false);
    setEditingLesson(undefined);
  };

  const toggleLessonComplete = (lesson: Lesson) => {
    dispatch({ type: "UPDATE_LESSON", payload: { ...lesson, isCompleted: !lesson.isCompleted } });
  };

  const handleDelete = (lessonId: string) => {
    dispatch({ type: "DELETE_LESSON", payload: lessonId });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{subject.name} Lessons</CardTitle>
        <CardDescription>
            All lessons for {subject.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter by level:</span>
                <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as "all" | StudyLevel)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
                    </DialogHeader>
                    <LessonForm subjectId={subject.id} lesson={editingLesson} onFinished={handleFormFinished} />
                </DialogContent>
            </Dialog>
        </div>

        {lessons.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
            {lessons.map(lesson => (
                <AccordionItem value={lesson.id} key={lesson.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4 flex-grow">
                            <Checkbox
                                checked={lesson.isCompleted}
                                onClick={(e) => { e.stopPropagation(); toggleLessonComplete(lesson); }}
                            />
                            <span className={cn("flex-grow text-left", lesson.isCompleted && "line-through text-muted-foreground")}>
                                {lesson.title}
                            </span>
                            <Badge variant="outline" className="capitalize flex-shrink-0">
                                <span className={cn("h-2 w-2 rounded-full mr-2", levelColors[lesson.level])}></span>
                                {lesson.level}
                            </Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="px-4 py-2 space-y-4">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the lesson "{lesson.title}". Are you sure?
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(lesson.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <h3 className="text-xl font-semibold">No lessons for this subject</h3>
                <p className="text-muted-foreground mt-2 mb-4">Add your first lesson to get started.</p>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
