import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Battery, Wifi, Signal, MoreHorizontal, Plus, FileText, ShoppingBag, Coffee, Car, Home, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import AddTransactionModal from './AddTransactionModal';

const CHART_COLORS = ['#34D399', '#60A5FA', '#F87171', '#FBBF24', '#A78BFA'];

// Helper to get icons based on category (mock)
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'food': return <Coffee size={20} />;
        case 'transport': return <Car size={20} />;
        case 'salary': return <FileText size={20} />;
        case 'entertainment': return <ShoppingBag size={20} />;
        default: return <Home size={20} />;
    }
};

const Dashboard: React.FC = () => {
    const { totalBalance, totalIncome, totalExpense, transactions, chartData, addTransaction, deleteTransaction, currentDate, nextMonth, prevMonth, user, updateAvatar } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const PRESET_AVATARS = [
        "https://i.pravatar.cc/150?img=12",
        "https://i.pravatar.cc/150?img=3",
        "https://i.pravatar.cc/150?img=5",
        "https://i.pravatar.cc/150?img=8",
        "https://i.pravatar.cc/150?img=15",
        "https://i.pravatar.cc/150?img=20",
        "https://i.pravatar.cc/150?img=32",
        "https://i.pravatar.cc/150?img=45"
    ];

    return (
        <div className="w-full pb-24 pt-4 px-4 min-h-screen flex flex-col max-w-md mx-auto relative">
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addTransaction}
            />

            {/* Profile Selection Modal */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}>
                    <div className="glass-panel w-full max-w-sm p-6 rounded-3xl animate-fade-in relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Profile Picture</h3>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {PRESET_AVATARS.map((url, index) => (
                                <button key={index} onClick={() => { updateAvatar(url); setIsProfileOpen(false); }} className="rounded-full overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all">
                                    <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="mb-2 text-sm text-gray-500 font-semibold">Or use custom URL:</div>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="https://example.com/image.png"
                                value={customUrl}
                                onChange={e => setCustomUrl(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl bg-white/50 border border-gray-200 text-sm"
                            />
                            <button
                                onClick={() => { if (customUrl) { updateAvatar(customUrl); setIsProfileOpen(false); setCustomUrl(''); } }}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                                Save
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 text-gray-500">or</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <label className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors w-full">
                                Upload from Computer
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            updateAvatar(e.target.files[0]);
                                            setIsProfileOpen(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* 1. Status Bar Mock */}
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-6 px-2">
                <span>{format(new Date(), 'h:mm a')}</span>
                <div className="flex gap-2 items-center">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <Battery size={14} />
                </div>
            </div>

            {/* 2. Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-black/5 rounded-full"><ChevronLeft size={16} className="text-gray-600" /></button>
                        <span className="text-gray-600 font-medium whitespace-nowrap min-w-[100px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
                        <button onClick={nextMonth} className="p-1 hover:bg-black/5 rounded-full"><ChevronRight size={16} className="text-gray-600" /></button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                </div>
                <button onClick={() => setIsProfileOpen(true)} className="p-1 glass rounded-full hover:scale-105 transition-transform cursor-pointer relative group">
                    <img
                        src={user?.avatarUrl || "https://i.pravatar.cc/150?img=12"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px]">Edit</span>
                    </div>
                </button>
            </div>

            {/* 3. Total Balance Card */}
            <div className="glass-panel p-6 rounded-3xl mb-6 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-80"></div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Balance</p>
                <h3 className="text-4xl font-bold text-gray-800">
                    R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <div className="mt-4 flex justify-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-xs font-semibold">+ 4.5% vs last month</span>
                </div>
            </div>

            {/* 4. Income & Expense Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center items-center">
                    <span className="text-xs text-gray-500 mb-1">Revenue</span>
                    <span className="text-lg font-bold text-emerald-500">
                        R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center items-center">
                    <span className="text-xs text-gray-500 mb-1">Expenses</span>
                    <span className="text-lg font-bold text-red-500">
                        R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* 5. Donut Chart */}
            <div className="glass-panel p-6 rounded-3xl mb-6 flex flex-col items-center">
                <h4 className="text-gray-700 font-semibold mb-4 w-full text-left">Spending Breakdown</h4>
                <div className="w-full h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text mock */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-gray-500">EXPENSES</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full mt-4 space-y-2">
                    {chartData.map((item, index) => (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                <span className="text-gray-600">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-700">{Math.round((item.value / totalExpense) * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Recent Transactions */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-gray-700 font-bold text-lg">Recent Transactions</h4>
                    <button className="p-1 hover:bg-black/5 rounded-full"><MoreHorizontal size={20} className="text-gray-400" /></button>
                </div>

                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="glass p-4 rounded-2xl flex justify-between items-center hover:bg-white/40 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-100/50 text-red-500'}`}>
                                    {getCategoryIcon(tx.category)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{tx.description}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(tx.date), 'MMM d, h:mm a')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTransaction(tx.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white transform hover:scale-105 active:scale-95 transition-all z-50">
                <Plus size={28} />
            </button>

        </div>
    );
};


export default Dashboard;
