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
import { Textarea } from "@/components/ui/textarea";
import { quoteSchema } from "@/lib/schemas";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type QuoteFormProps = {
  bookId?: string;
  onFinished: () => void;
};

export default function QuoteForm({ bookId, onFinished }: QuoteFormProps) {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      bookId: bookId || "",
      text: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof quoteSchema>) {
    const quoteData = {
      ...values,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_QUOTE", payload: quoteData });
    toast({
      title: "Quote Added",
      description: "Your new quote has been saved.",
    });
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!bookId && (
            <FormField
                control={form.control}
                name="bookId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Book</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {state.books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                            {book.title}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea placeholder="The beginning of wisdom is this: Get wisdom." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. A reminder to always seek knowledge." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Quote
        </Button>
      </form>
    </Form>
  );
}
