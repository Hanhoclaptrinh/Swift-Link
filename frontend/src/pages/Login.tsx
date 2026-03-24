import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Background } from '../components/Background';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      login(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col items-center justify-center p-4 relative">
      <Background />
      
      <motion.div 
        className="w-full max-w-md glass-panel p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-agent-accent mb-8 transition-colors">
          <ArrowLeft size={16} /> Home
        </Link>
        
        <h2 className="text-3xl font-extrabold mb-2">Welcome <span className="text-agent-accent">Back</span></h2>
        <p className="text-slate-400 mb-8">Access your futuristic link management terminal.</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-agent-accent/70">Email Node</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail size={20} /></div>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 glass-input bg-agent-900 border-white/5 outline-none hover:border-agent-accent/40"
                placeholder="Enter email address..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-agent-purple/70">Security Key</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={20} /></div>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 glass-input bg-agent-900 border-white/5 outline-none hover:border-agent-purple/40"
                placeholder="Enter password..."
              />
            </div>
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-agent-accent text-black font-bold rounded-xl hover:bg-agent-accent/90 transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
          >
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" /> : (
              <>Initialize <LogIn size={20} /></>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have access? <Link to="/register" className="text-agent-purple font-semibold hover:underline">Register New Node</Link>
        </p>
      </motion.div>
    </div>
  );
}
