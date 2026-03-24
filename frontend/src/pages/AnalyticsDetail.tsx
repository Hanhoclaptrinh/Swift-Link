import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Globe, Monitor, Zap, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Background } from '../components/Background';

const API_BASE = 'http://localhost:3000';

interface AnalyticsData {
  totalClicks: number;
  todayClicks: number;
  dailyStats: { date: string; clicks: number }[];
  topReferrers: { name: string; count: number }[];
  topBrowsers: { name: string; count: number }[];
}

export function AnalyticsDetail() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${API_BASE}/analytics/${code}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-agent-950 flex flex-col items-center justify-center gap-4 text-agent-accent">
        <Activity size={48} className="animate-spin" />
        <p className="font-mono tracking-widest text-sm uppercase">Acquiring Node Data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-agent-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 max-w-md border-red-500/20">
          <h2 className="text-red-400 text-xl font-bold mb-4">Error: {error || 'Data not found'}</h2>
          <Link to="/" className="inline-flex items-center gap-2 text-agent-accent hover:underline">
            <ArrowLeft size={16} /> Return to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col pt-12 pb-12 px-4 sm:px-6 relative">
      <Background />

      <motion.div 
        className="max-w-5xl mx-auto w-full relative z-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-agent-accent transition-colors group">
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-agent-accent/20 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span>Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full glass-panel border-agent-accent/30 text-agent-accent font-mono text-sm uppercase flex items-center gap-2">
              <Zap size={14} /> Node: {code}
            </div>
            <a 
              href={`${API_BASE}/${code}`} 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-agent-accent/40 text-slate-400 hover:text-agent-accent"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
          Node <span className="text-agent-accent">Analytics</span>
        </h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={100} />
            </div>
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Total Clicks</p>
            <h3 className="text-5xl font-black text-white">{data.totalClicks.toLocaleString()}</h3>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-agent-accent to-transparent rounded-full" />
          </div>

          <div className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-agent-purple">
              <Zap size={100} />
            </div>
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Today's Traffic</p>
            <h3 className="text-5xl font-black text-agent-purple">{data.todayClicks.toLocaleString()}</h3>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-agent-purple to-transparent rounded-full" />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6">
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-agent-accent" /> Click Trend (Last 7 Days)
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#00d2ff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#00d2ff" 
                    strokeWidth={3} 
                    dot={{ fill: '#00d2ff', r: 6 }} 
                    activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Monitor size={18} className="text-agent-purple" /> Top Browsers
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topBrowsers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={70} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.topBrowsers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#00d2ff', '#a855f7', '#3b82f6', '#10b981', '#f43f5e'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 glass-panel p-6">
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-400" /> Top Referral Sources
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {data.topReferrers.map((ref, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-xs text-slate-400 uppercase tracking-tighter mb-1 truncate" title={ref.name}>{ref.name}</p>
                  <p className="text-2xl font-bold">{ref.count}</p>
                </div>
              ))}
              {data.topReferrers.length === 0 && (
                <p className="text-slate-500 italic col-span-full">No referral data recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
