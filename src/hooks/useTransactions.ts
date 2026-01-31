import { useState } from 'react';

export interface Transaction {
    id: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    icon?: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: '1', description: 'Uber (Transport)', category: 'Transport', amount: 24.50, type: 'expense', date: '2026-01-31' },
    { id: '2', description: 'Salary', category: 'Salary', amount: 4000.00, type: 'income', date: '2026-01-30' },
    { id: '3', description: 'Restaurant', category: 'Food', amount: 120.00, type: 'expense', date: '2026-01-29' },
    { id: '4', description: 'Netflix', category: 'Entertainment', amount: 39.90, type: 'expense', date: '2026-01-28' },
];

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTx = { ...transaction, id: Math.random().toString(36).substr(2, 9) };
        setTransactions([newTx, ...transactions]);
    };

    const totalBalance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

    const chartData = Object.keys(expensesByCategory).map(cat => ({
        name: cat,
        value: expensesByCategory[cat]
    }));

    return {
        transactions,
        addTransaction,
        totalBalance,
        totalIncome,
        totalExpense,
        chartData
    };
};
