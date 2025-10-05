
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lessonSchema } from "@/lib/schemas";
import type { Lesson } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

type LessonFormProps = {
  subjectId: string;
  lesson?: Lesson;
  onFinished: () => void;
};

export default function LessonForm({ subjectId, lesson, onFinished }: LessonFormProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      subjectId: subjectId,
      title: lesson?.title || "",
      level: lesson?.level || "beginner",
    },
  });

  function onSubmit(values: z.infer<typeof lessonSchema>) {
    const lessonData = {
      ...values,
      id: lesson?.id || uuidv4(),
      isCompleted: lesson?.isCompleted || false,
    };

    dispatch({ type: lesson ? "UPDATE_LESSON" : "ADD_LESSON", payload: lessonData as Lesson });
    toast({
        title: `Lesson ${lesson ? 'updated' : 'added'}`,
        description: `"${values.title}" has been successfully saved.`,
    });
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Introduction to Thermodynamics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" className="w-full">
          {lesson ? "Save Changes" : "Add Lesson"}
        </Button>
      </form>
    </Form>
  );
}
