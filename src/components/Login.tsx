import React, { useState } from 'react';
import { Wallet, User, Lock, Eye, EyeOff, Facebook, Apple, Chrome } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(); // Mock login logic
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
      
      {/* Main Glass Card */}
      <div className="glass-panel w-full max-w-sm p-8 rounded-3xl flex flex-col items-center animate-fade-in relative overflow-hidden">
        
        {/* Decorative gloss effect */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">Welcome Back!</h1>
        
        {/* Icon */}
        <div className="mb-8 p-4 rounded-full bg-white/20 glass shadow-lg">
          <Wallet size={48} className="text-emerald-500" strokeWidth={1.5} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          {/* Username Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={20} className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/40 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white/60 focus:ring-2 focus:ring-emerald-400/50 transition-all shadow-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/40 border border-white/40 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white/60 focus:ring-2 focus:ring-emerald-400/50 transition-all shadow-sm"
            />
           
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl text-white font-semibold text-lg shadow-lg transform transition-transform active:scale-95 bg-gradient-to-r from-blue-400 to-emerald-400 hover:from-blue-500 hover:to-emerald-500"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between w-full mt-4 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-800 hover:underline">Forgot Password?</a>
          <a href="#" className="hover:text-gray-800 hover:underline">Create Account</a>
        </div>

        {/* Social Login */}
        <div className="mt-8 w-full">
          <div className="relative flex py-2 items-center">
             <div className="flex-grow border-t border-gray-400/30"></div>
             <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR CONTINUE WITH</span>
             <div className="flex-grow border-t border-gray-400/30"></div>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
             {/* Google */}
             <button className="p-3 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors shadow-sm text-red-500">
                <Chrome size={24} />
             </button>
             {/* Facebook */}
             <button className="p-3 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors shadow-sm text-blue-600">
                <Facebook size={24} />
             </button>
             {/* Apple */}
             <button className="p-3 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors shadow-sm text-gray-900">
                <Apple size={24} />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
