
"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { StudyPlanEntry, Subject, StudyPriority, Lesson, ScheduledLesson, LessonState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import StudyCalendarGrid from "./StudyCalendarGrid";
import DailyPlanPanel from "./DailyPlanPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const priorityVariant: { [key in StudyPriority]: "destructive" | "secondary" | "default" } = {
    high: "destructive",
    medium: "secondary",
    low: "default",
};

interface DropInfo {
    day: number;
}

export default function StudyPlan() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [draggedSubject, setDraggedSubject] = useState<Subject | null>(null);
  const [draggedPlanEntry, setDraggedPlanEntry] = useState<StudyPlanEntry | null>(null);
  const [dropInfo, setDropInfo] = useState<DropInfo | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [duration, setDuration] = useState(1);
  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>([]);

  const handleDragStartSubject = (e: React.DragEvent, subject: Subject) => {
    e.dataTransfer.setData('application/json', JSON.stringify({type: 'subject', id: subject.id}));
    setDraggedSubject(subject);
    setDraggedPlanEntry(null);
  };

  const handleDragStartEntry = (e: React.DragEvent, entry: StudyPlanEntry) => {
    e.dataTransfer.setData('application/json', JSON.stringify({type: 'planEntry', id: entry.id}));
    setDraggedPlanEntry(entry);
    setDraggedSubject(null);
  };

  const handleDrop = (day: number) => {
    if (!isEditing || (!draggedSubject && !draggedPlanEntry)) return;
    
    // For existing entries, pre-fill the form
    if (draggedPlanEntry) {
        setDuration(draggedPlanEntry.duration);
        setScheduledLessons(draggedPlanEntry.lessons || []);
    }
    
    setDropInfo({ day });
    setIsScheduling(true);
  };
  
  const handleConfirmSchedule = () => {
    if (!dropInfo) return;

    let newPlan = [...state.studyPlan];
    
    if (draggedSubject) { // New entry from subject list
        const newEntry: StudyPlanEntry = {
            id: uuidv4(),
            day: dropInfo.day,
            subjectId: draggedSubject.id,
            duration: duration,
            lessons: scheduledLessons,
        };
        newPlan.push(newEntry);
    } else if (draggedPlanEntry) { // Moving or updating existing entry
        const entryIndex = newPlan.findIndex(p => p.id === draggedPlanEntry.id);
        if (entryIndex > -1) {
            newPlan[entryIndex] = {
                ...newPlan[entryIndex],
                day: dropInfo.day,
                duration: duration,
                lessons: scheduledLessons
            };
        }
    }
    
    dispatch({ type: "UPDATE_STUDY_PLAN", payload: newPlan });
    toast({ title: "Study Plan Updated", description: "Your changes have been saved." });
    
    handleCancelSchedule();
  };

  const handleCancelSchedule = () => {
    setIsScheduling(false);
    setDropInfo(null);
    setDraggedSubject(null);
    setDraggedPlanEntry(null);
    setDuration(1);
    setScheduledLessons([]);
  };

  const handleRemoveEntry = (entryId: string) => {
    const newPlan = state.studyPlan.filter(p => p.id !== entryId);
    dispatch({ type: "UPDATE_STUDY_PLAN", payload: newPlan });
    toast({ title: "Study Block Removed", description: "The item has been removed from your plan." });
  };
  
  const currentSubjectForDialog = draggedSubject || state.subjects.find(s => s.id === draggedPlanEntry?.subjectId);
  const subjectLessons = state.lessons.filter(l => l.subjectId === currentSubjectForDialog?.id);

  const handleLessonToggle = (lessonId: string) => {
    setScheduledLessons(prev => {
        const isSelected = prev.some(l => l.lessonId === lessonId);
        if (isSelected) {
            return prev.filter(l => l.lessonId !== lessonId);
        } else {
            return [...prev, { lessonId, state: 'learn', notes: '' }];
        }
    });
  }

  const handleLessonDetailChange = (lessonId: string, field: 'state' | 'notes', value: string) => {
      setScheduledLessons(prev => prev.map(l => 
          l.lessonId === lessonId ? { ...l, [field]: value } : l
      ));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Weekly Study Plan</CardTitle>
                        <CardDescription>
                            {isEditing ? "Drag subjects to a day to schedule study blocks." : "Your schedule for the week."}
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
                        {isEditing ? "Done" : "Edit Plan"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <StudyCalendarGrid 
                        studyPlan={state.studyPlan}
                        subjects={state.subjects}
                        onDrop={handleDrop}
                        onDragStartEntry={handleDragStartEntry}
                        onRemoveEntry={handleRemoveEntry}
                        isEditing={isEditing}
                    />
                </CardContent>
            </Card>
        </div>
        
        {isEditing ? (
            <Card className="self-start">
                <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                    <CardDescription>Drag a subject onto the calendar to schedule it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-2 pr-4">
                        {state.subjects.map(subject => (
                            <div
                                key={subject.id}
                                draggable
                                onDragStart={(e) => handleDragStartSubject(e, subject)}
                                className="p-3 rounded-lg border bg-card shadow-sm cursor-grab flex justify-between items-center"
                            >
                                <span className="font-medium">{subject.name}</span>
                                <Badge variant={priorityVariant[subject.priority]} className="capitalize">{subject.priority}</Badge>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        ) : (
            <DailyPlanPanel />
        )}

        <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
            <DialogContent onInteractOutside={handleCancelSchedule} className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule Study Block</DialogTitle>
                </DialogHeader>
                {currentSubjectForDialog && (
                    <div className="py-4 space-y-6">
                        <p>Configure study block for <span className="font-bold">{currentSubjectForDialog.name}</span>.</p>
                        
                        <div className="flex items-center gap-4">
                            <label htmlFor="duration" className="text-sm font-medium whitespace-nowrap">Study for</label>
                            <Select value={String(duration)} onValueChange={(val) => setDuration(Number(val))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                                        <SelectItem key={h} value={String(h)}>{h} hour{h > 1 ? 's' : ''}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium mb-2">Select and configure lessons for this block:</h4>
                            <ScrollArea className="h-64 rounded-md border p-2">
                                <div className="space-y-4">
                                {subjectLessons.length > 0 ? subjectLessons.map(lesson => {
                                    const scheduledLesson = scheduledLessons.find(sl => sl.lessonId === lesson.id);
                                    const isSelected = !!scheduledLesson;

                                    return (
                                        <div key={lesson.id} className="p-3 rounded-md bg-muted/50 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Checkbox 
                                                    id={`lesson-check-${lesson.id}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => handleLessonToggle(lesson.id)}
                                                />
                                                <label htmlFor={`lesson-check-${lesson.id}`} className="text-sm font-medium flex-grow">{lesson.title}</label>
                                                <Badge variant="outline" className="capitalize">{lesson.level}</Badge>
                                            </div>
                                            {isSelected && (
                                                <div className="space-y-2 pl-7">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs w-16">State:</label>
                                                        <Select
                                                            value={scheduledLesson.state}
                                                            onValueChange={(value) => handleLessonDetailChange(lesson.id, 'state', value)}
                                                        >
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="learn">Learn</SelectItem>
                                                                <SelectItem value="exercise">Exercise</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <label className="text-xs w-16 pt-2">Notes:</label>
                                                        <Textarea 
                                                            placeholder="Session-specific notes..."
                                                            className="h-20 text-xs"
                                                            value={scheduledLesson.notes}
                                                            onChange={(e) => handleLessonDetailChange(lesson.id, 'notes', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }) : <p className="text-sm text-muted-foreground text-center py-4">No lessons in this subject.</p>}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancelSchedule}>Cancel</Button>
                    <Button onClick={handleConfirmSchedule}>
                        {draggedPlanEntry ? 'Update Block' : 'Add Block'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
