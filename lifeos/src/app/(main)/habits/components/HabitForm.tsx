"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { habitSchema } from "@/lib/schemas";
import type { Habit } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

type HabitFormProps = {
  habit?: Habit;
  onFinished: () => void;
};

export default function HabitForm({ habit, onFinished }: HabitFormProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      category: habit?.category || "health",
    },
  });

  function onSubmit(values: z.infer<typeof habitSchema>) {
    const habitData = {
      ...values,
      id: habit?.id || uuidv4(),
      createdAt: habit?.createdAt || new Date().toISOString(),
      completions: habit?.completions || [],
    };

    dispatch({ type: habit ? "UPDATE_HABIT" : "ADD_HABIT", payload: habitData as Habit });
    toast({
        title: `Habit ${habit ? 'updated' : 'added'}`,
        description: `"${values.name}" has been successfully ${habit ? 'updated' : 'added'}.`,
    });
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Read for 20 minutes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {habit ? "Save Changes" : "Create Habit"}
        </Button>
      </form>
    </Form>
  );
}
