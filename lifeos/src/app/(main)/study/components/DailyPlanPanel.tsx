
"use client";

import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Lesson, ScheduledLesson } from '@/lib/types';
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TodayLesson extends Lesson {
    subjectName: string;
    sessionNotes: string;
    sessionState: 'learn' | 'exercise';
}

export default function DailyPlanPanel() {
  const { state, dispatch } = useAppContext();

  // getDay() returns 0 for Sunday, 1 for Monday, etc. which matches our studyPlan day index.
  const todayIndex = getDay(new Date());

  const todaysLessons: TodayLesson[] = useMemo(() => {
    // Get all study plan entries for today
    const todaysEntries = state.studyPlan.filter(entry => entry.day === todayIndex);

    if (todaysEntries.length === 0) {
      return [];
    }

    // Get all scheduled lessons for today
    const todaysScheduledLessons: ScheduledLesson[] = todaysEntries.flatMap(entry => entry.lessons || []);

    // Map scheduled lessons to full lesson objects with extra info
    return todaysScheduledLessons.map(scheduledLesson => {
        const lesson = state.lessons.find(l => l.id === scheduledLesson.lessonId);
        if (!lesson) return null; // Should not happen if data is consistent

        const subject = state.subjects.find(s => s.id === lesson.subjectId);
        return {
            ...lesson,
            subjectName: subject?.name || 'Unknown Subject',
            sessionNotes: scheduledLesson.notes,
            sessionState: scheduledLesson.state
        };
    }).filter((l): l is TodayLesson => l !== null);
  }, [state.studyPlan, state.lessons, state.subjects, todayIndex]);

  const handleToggleLesson = (lessonId: string) => {
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (lesson) {
        dispatch({ type: 'UPDATE_LESSON', payload: { ...lesson, isCompleted: !lesson.isCompleted } });
    }
  };

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>Daily Plan - {format(new Date(), 'eeee')}</CardTitle>
        <CardDescription>Lessons scheduled for today.</CardDescription>
      </CardHeader>
      <CardContent>
        {todaysLessons.length > 0 ? (
          <ScrollArea className="h-96">
            <Accordion type="single" collapsible className="w-full pr-4">
              {todaysLessons.map(lesson => (
                <AccordionItem value={lesson.id} key={lesson.id}>
                    <AccordionTrigger className="hover:no-underline">
                        <div
                            className="flex items-center gap-3 flex-grow"
                            >
                            <Checkbox
                                id={`lesson-${lesson.id}`}
                                checked={lesson.isCompleted}
                                onClick={(e) => { e.stopPropagation(); handleToggleLesson(lesson.id); }}
                            />
                            <label
                                htmlFor={`lesson-${lesson.id}`}
                                className={cn("flex-grow text-sm font-medium leading-none text-left", lesson.isCompleted && "line-through text-muted-foreground")}
                            >
                                {lesson.title}
                                <p className="text-xs text-muted-foreground font-normal">{lesson.subjectName}</p>
                            </label>
                            <Badge variant={lesson.sessionState === 'learn' ? 'default' : 'secondary'} className="capitalize">{lesson.sessionState}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="px-4 py-2 space-y-2 text-sm text-muted-foreground">
                            <p className="italic">Session Notes:</p>
                            <p>{lesson.sessionNotes || "No specific notes for this session."}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-sm text-muted-foreground text-center px-4">
              No specific lessons scheduled for today. Check your weekly plan or add something in "Edit Plan" mode.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
