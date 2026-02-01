
import { useState, useEffect } from 'react';
import { api } from '../api';

export interface Transaction {
    id: number;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    icon?: string;
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [user, setUser] = useState<{ id: number; email: string; avatarUrl?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await api.getTransactions(currentDate.getMonth() + 1, currentDate.getFullYear());
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentDate]);

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const newTx = await api.addTransaction(transaction);
            // Only add to list if it belongs to current month view
            const txDate = new Date(newTx.date);
            if (txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear()) {
                setTransactions([newTx, ...transactions]);
            }
        } catch (error) {
            console.error("Failed to add transaction:", error);
        }
    };

    const deleteTransaction = async (id: number) => {
        try {
            await api.deleteTransaction(id);
            setTransactions(transactions.filter(tx => tx.id !== id));
        } catch (error) {
            console.error("Failed to delete transaction:", error);
        }
    };

    const updateAvatar = async (avatar: string | File) => {
        try {
            const data = await api.updateProfile(avatar);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            console.error("Failed to update avatar:", error);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
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
        deleteTransaction,
        updateAvatar,
        user,
        totalBalance,
        totalIncome,
        totalExpense,
        chartData,
        currentDate,
        nextMonth,
        prevMonth
    };
};
