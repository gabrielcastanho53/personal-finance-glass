import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (tx: any) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            description,
            amount: parseFloat(amount),
            category,
            type,
            date,
        });
        onClose();
        // Reset form
        setAmount('');
        setDescription('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="glass-panel w-full max-w-sm rounded-3xl p-6 relative animate-fade-in z-10 bg-white/60">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50">
                    <X size={20} className="text-gray-500" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6">Add Transaction</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Type Toggle */}
                    <div className="flex p-1 bg-gray-200/50 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white shadow-sm text-red-500' : 'text-gray-500'}`}
                        >
                            Expense
                        </button>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 font-medium ml-1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full mt-1 p-3 bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-lg font-bold text-gray-800 placeholder-gray-300"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 font-medium ml-1">Description</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-1 p-3 bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 placeholder-gray-400"
                            placeholder="e.g. Lunch"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-medium ml-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full mt-1 p-3 bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                            >
                                <option>Food</option>
                                <option>Transport</option>
                                <option>Entertainment</option>
                                <option>Salary</option>
                                <option>Health</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium ml-1">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full mt-1 p-3 bg-white/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r from-blue-400 to-emerald-400 active:scale-95 transition-transform"
                    >
                        Save Transaction
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
