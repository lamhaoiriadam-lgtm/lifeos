
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Edit } from "lucide-react";
import { format, differenceInDays, differenceInHours, differenceInMinutes, isValid } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema } from "@/lib/schemas";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "The expert in anything was once a beginner.",
    "Believe you can and you're halfway there.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The future belongs to those who believe in the beauty of their dreams."
];

export default function ExamCountdown() {
  const { state, dispatch } = useAppContext();
  const exam = state.exams.length > 0 ? state.exams[0] : null;
  const [isEditing, setIsEditing] = useState(!exam);
  const [currentQuote, setCurrentQuote] = useState("");

  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: exam?.name || "Final Exams",
      date: exam?.date || "",
    },
  });

  useEffect(() => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    const interval = setInterval(() => {
        setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateCountdown = (targetDate: string | null) => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0 };
    const now = new Date();
    const target = new Date(targetDate);

    if (!isValid(target) || target <= now) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    let days = differenceInDays(target, now);
    let hours = differenceInHours(target, now) % 24;
    let minutes = differenceInMinutes(target, now) % 60;
    
    return { days, hours, minutes };
  };

  const [countdown, setCountdown] = useState(calculateCountdown(exam?.date || null));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(exam?.date || null));
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [exam]);

  const onSubmit = (values: z.infer<typeof examSchema>) => {
    const examData = {
        ...values,
        id: exam?.id || uuidv4(),
    };
    dispatch({ type: "SET_EXAM", payload: examData });
    setCountdown(calculateCountdown(examData.date));
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        {isEditing || !exam ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-lg font-medium">Set Your Exam Date</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="exam-name" className="text-sm font-medium">Exam Name</label>
                        <Input id="exam-name" {...form.register("name")} />
                    </div>
                    <div>
                        <label htmlFor="exam-date" className="text-sm font-medium">Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={`w-[240px] justify-start text-left font-normal ${!form.watch('date') && "text-muted-foreground"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch('date') ? format(new Date(form.watch('date')), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={form.watch('date') ? new Date(form.watch('date')) : undefined}
                                onSelect={(date) => form.setValue("date", date ? format(date, "yyyy-MM-dd") : "")}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="submit">Set Countdown</Button>
                </div>
                {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
            </form>
        ) : (
            <div className="text-center relative">
                <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <p className="text-muted-foreground">Countdown to {exam.name}</p>
                <div className="flex justify-center items-baseline gap-4 my-2">
                    <div>
                        <span className="text-5xl font-bold">{countdown.days}</span>
                        <span className="text-lg text-muted-foreground"> days</span>
                    </div>
                    <div>
                        <span className="text-5xl font-bold">{countdown.hours}</span>
                        <span className="text-lg text-muted-foreground"> hours</span>
                    </div>
                    <div>
                        <span className="text-5xl font-bold">{countdown.minutes}</span>
                        <span className="text-lg text-muted-foreground"> mins</span>
                    </div>
                </div>
                <p className="text-sm italic text-muted-foreground">"{currentQuote}"</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
