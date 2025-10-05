
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { TransactionCategory } from "@/lib/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { transactionSchema } from "@/lib/schemas";
import type { Transaction, IncomeCategory, ExpenseCategory } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TransactionFormProps = {
  transaction?: Transaction;
  onFinished: (newTransaction?: Transaction) => void;
};

const incomeCategories: IncomeCategory[] = ['salary', 'freelance', 'investment', 'other'];
const expenseCategories: ExpenseCategory[] = ['food', 'transport', 'entertainment', 'education', 'health', 'shopping', 'bills', 'other'];

export default function TransactionForm({ transaction, onFinished }: TransactionFormProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || 'expense',
      amount: transaction?.amount || undefined,
      category: transaction?.category || (transaction?.type === 'income' ? 'salary' : 'food'),
      date: transaction?.date || "",
      note: transaction?.note || '',
    },
  });

  useEffect(() => {
    if (!transaction) {
      form.setValue('date', format(new Date(), "yyyy-MM-dd"));
    }
  }, [form, transaction]);

  const transactionType = form.watch("type");
  
  useEffect(() => {
    if (transactionType === 'income') {
        form.setValue('category', 'salary');
    } else {
        form.setValue('category', 'food');
    }
  }, [transactionType, form]);


  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const transactionData: Transaction = {
      id: transaction?.id || uuidv4(),
      createdAt: transaction?.createdAt || new Date().toISOString(),
      type: values.type,
      amount: values.amount,
      category: values.category as TransactionCategory,
      date: values.date,
      note: values.note,
    };

    dispatch({ type: transaction ? "UPDATE_TRANSACTION" : "ADD_TRANSACTION", payload: transactionData });
    toast({
        title: `Transaction ${transaction ? 'updated' : 'added'}`,
        description: `A new ${values.type} of $${values.amount} has been recorded.`,
    });
    onFinished(transactionData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Income</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Expense</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {(transactionType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lunch with friends" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {transaction ? "Save Changes" : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
