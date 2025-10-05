"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";

interface CategoryChartProps {
  transactions: Transaction[];
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[])
    .sort((a,b) => b.amount - a.amount);
    
  const chartConfig = {
    amount: {
        label: "Amount",
        color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {expenseData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis
                    dataKey="category"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    width={80}
                />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="amount" radius={4} fill="var(--color-amount)" />
            </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
        ) : (
            <div className="flex h-[250px] w-full items-center justify-center">
                <p className="text-muted-foreground">No expense data for this month.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
