import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Background } from '../components/Background';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register
      await axios.post('http://localhost:3000/auth/register', { email, password, name });
      // Then Login automatically
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      login(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col items-center justify-center p-4 relative">
      <Background />
      
      <motion.div 
        className="w-full max-w-md glass-panel p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-agent-accent mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Terminal
        </Link>
        
        <h2 className="text-3xl font-extrabold mb-2">Create <span className="text-agent-purple">Node</span></h2>
        <p className="text-slate-400 mb-8">Join the elite network of link management.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">Display Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><User size={20} /></div>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full py-3 pl-12 pr-4 glass-input bg-agent-900 border-white/5 outline-none hover:border-agent-accent/40"
                placeholder="Commander Name..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">Email Address</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail size={20} /></div>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-12 pr-4 glass-input bg-agent-900 border-white/5 outline-none hover:border-agent-purple/40"
                placeholder="Ex: nexus@corp.io"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">Security Key</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={20} /></div>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-12 pr-4 glass-input bg-agent-900 border-white/5 outline-none hover:border-agent-purple/40"
                placeholder="Min. 8 characters..."
              />
            </div>
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-agent-purple text-white font-bold rounded-xl hover:bg-agent-purple/90 transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 mt-4 shadow-lg shadow-agent-purple/20"
          >
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : (
              <>Construct Account <UserPlus size={20} /></>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-3 bg-red-400/10 border border-red-400/20 text-red-400 text-center text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have access? <Link to="/login" className="text-agent-accent font-semibold hover:underline">Login to Terminal</Link>
        </p>
      </motion.div>
    </div>
  );
}
