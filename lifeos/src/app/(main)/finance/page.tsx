
"use client";

import { useState, useMemo, useEffect } from "react";
import FinanceSummary from "./components/FinanceSummary";
import TransactionList from "./components/TransactionList";
import CategoryChart from "./components/CategoryChart";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import TransactionForm from "./components/TransactionForm";
import { useAppContext } from "@/context/AppContext";
import { getMonth, getYear, subMonths, addMonths, format } from "date-fns";
import type { Transaction } from "@/lib/types";
import TransactionSuccessAnimation from "./components/TransactionSuccessAnimation";

export default function FinancePage() {
  const { state } = useAppContext();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [lastAddedTransaction, setLastAddedTransaction] = useState<Transaction | null>(null);

  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!currentDate) {
      setCurrentDate(new Date());
    }
  }, [currentDate]);

  useEffect(() => {
    if (currentDate) {
      const month = getMonth(currentDate);
      const year = getYear(currentDate);
      const filtered = state.transactions.filter(t => {
        const tDate = new Date(t.date);
        return getMonth(tDate) === month && getYear(tDate) === year;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.createdAt).getTime());
      setMonthlyTransactions(filtered);
    }
  }, [state.transactions, currentDate]);

  const summary = useMemo(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [monthlyTransactions]);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedTransaction(undefined);
    setIsFormOpen(true);
  }

  const handleFormFinished = (newTransaction?: Transaction) => {
    setIsFormOpen(false);
    setSelectedTransaction(undefined);
    if (newTransaction && !selectedTransaction) { // only animate for new transactions
        setLastAddedTransaction(newTransaction);
    }
  };

  const handleAnimationComplete = () => {
    setLastAddedTransaction(null);
  }

  const handleMonthChange = (amount: number) => {
    if (currentDate) {
      setCurrentDate(prevDate => prevDate ? addMonths(prevDate, amount) : new Date());
    }
  }

  if (!currentDate) {
    return <div>Loading...</div>; // Or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleMonthChange(-1)}>Previous</Button>
            <h1 className="text-xl md:text-2xl font-bold text-center w-48">{format(currentDate, 'MMMM yyyy')}</h1>
            <Button variant="outline" onClick={() => handleMonthChange(1)}>Next</Button>
        </div>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
        </Button>
      </div>
      
      <FinanceSummary {...summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <TransactionList transactions={monthlyTransactions} onEdit={handleEdit}/>
        </div>
        <CategoryChart transactions={monthlyTransactions} />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
          </DialogHeader>
          <TransactionForm transaction={selectedTransaction} onFinished={handleFormFinished} />
        </DialogContent>
      </Dialog>
      
      <TransactionSuccessAnimation 
        transaction={lastAddedTransaction}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
}
