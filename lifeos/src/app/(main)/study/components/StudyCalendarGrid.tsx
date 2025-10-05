
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { StudyPlanEntry, Subject, StudyPriority } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudyCalendarGridProps {
  studyPlan: StudyPlanEntry[];
  subjects: Subject[];
  onDrop: (day: number) => void;
  onDragStartEntry: (e: React.DragEvent, entry: StudyPlanEntry) => void;
  onRemoveEntry: (entryId: string) => void;
  isEditing: boolean;
}

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const priorityColors: { [key in StudyPriority]: string } = {
    high: 'bg-red-500/20 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200',
    medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200',
    low: 'bg-green-500/20 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200',
};

const StudyCalendarGrid: React.FC<StudyCalendarGridProps> = ({ studyPlan, subjects, onDrop, onDragStartEntry, onRemoveEntry, isEditing }) => {
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {weekDays.map((day, dayIndex) => (
        <div key={day} className="text-center font-semibold p-2 border-b border-r bg-muted/50">
          {day}
        </div>
      ))}

      {weekDays.map((_, dayIndex) => (
        <div
          key={dayIndex}
          className={cn(
            "min-h-96 border-b border-r p-2 space-y-2",
            isEditing && dragOverDay === dayIndex ? 'bg-primary/20' : '',
            isEditing ? 'overflow-visible' : 'overflow-hidden'
          )}
          onDragOver={(e) => { e.preventDefault(); if (isEditing) setDragOverDay(dayIndex); }}
          onDragLeave={() => setDragOverDay(null)}
          onDrop={(e) => { e.preventDefault(); onDrop(dayIndex); setDragOverDay(null); }}
        >
          <ScrollArea className="h-96">
            <div className="space-y-2 pr-4">
              {studyPlan.filter(entry => entry.day === dayIndex).map(entry => {
                const subject = getSubjectById(entry.subjectId);
                if (!subject) return null;

                return (
                  <div
                    key={entry.id}
                    draggable={isEditing}
                    onDragStart={(e) => onDragStartEntry(e, entry)}
                    className={cn(
                      "rounded-lg p-2 border overflow-hidden group relative text-sm",
                      isEditing && "cursor-grab",
                      priorityColors[subject.priority]
                    )}
                  >
                    <p className="font-bold leading-tight">{subject.name}</p>
                    <div className="flex items-center text-xs opacity-80 mt-1">
                        <Clock className="w-3 h-3 mr-1"/>
                        <span>{entry.duration} hour{entry.duration > 1 ? 's' : ''}</span>
                    </div>
                    {entry.lessons.length > 0 && (
                        <div className="flex items-center text-xs opacity-80 mt-1">
                            <BookOpen className="w-3 h-3 mr-1"/>
                            <span>{entry.lessons.length} lesson{entry.lessons.length > 1 ? 's' : ''}</span>
                        </div>
                    )}
                    {isEditing && (
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); onRemoveEntry(entry.id); }}
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};

export default StudyCalendarGrid;
