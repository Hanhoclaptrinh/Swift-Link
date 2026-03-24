import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, CheckCircle, ArrowRight, Activity, Zap, Scissors, QrCode, X, BarChart2, LogOut, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { Background } from '../components/Background';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

interface RecentUrl {
  shortUrl: string;
  originalUrl: string;
  shortCode?: string;
  clicks?: number;
}

export function Home() {
  const { user, token, logout } = useAuth();
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrShortCode, setQrShortCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState('');

  const extractCodeFromUrl = (shortUrl: string) => {
    const parts = shortUrl.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? '';
  };

  useEffect(() => {
    const fetchLinks = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE}/urls/mine`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const mapped = res.data.map((item: any) => ({
            ...item,
            shortUrl: `${API_BASE}/${item.shortCode}`
          }));
          setRecentUrls(mapped);
        } catch (err) {
          console.error("Failed to fetch user links");
        }
      } else {
        const saved = localStorage.getItem('swiftlink_recent');
        if (saved) {
          try {
            const parsed: RecentUrl[] = JSON.parse(saved);
            const normalized = parsed.map((item) => ({
              ...item,
              shortCode: item.shortCode ?? extractCodeFromUrl(item.shortUrl),
            }));
            setRecentUrls(normalized);
          } catch (e) {
            console.error('Failed to parse recent URLs');
          }
        }
      }
    };

    fetchLinks();
  }, [token]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');

    try {
      const payload: any = { originalUrl: url };
      if (customCode.trim()) payload.shortCode = customCode.trim();

      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.post(`${API_BASE}/urls/shorten`, payload, { headers });
      const newShortUrl = `${API_BASE}/${response.data.shortCode}`;
      const newItem: RecentUrl = { 
        shortUrl: newShortUrl, 
        originalUrl: url, 
        shortCode: response.data.shortCode,
        clicks: 0 
      };

      if (token) {
        // Just refresh the list from server
        setRecentUrls([newItem, ...recentUrls].slice(0, 10));
      } else {
        const filteredUrls = recentUrls.filter(item => item.shortUrl !== newShortUrl);
        const updatedUrls = [newItem, ...filteredUrls].slice(0, 5);
        setRecentUrls(updatedUrls);
        localStorage.setItem('swiftlink_recent', JSON.stringify(updatedUrls));
      }

      await fetchQrForCode(response.data.shortCode);
      setUrl('');
      setCustomCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const fetchQrForCode = async (code: string) => {
    setQrLoading(true);
    setQrError('');
    try {
      const response = await axios.get(`${API_BASE}/${code}/qr`);
      setQrDataUrl(response.data);
      setQrShortCode(code);
    } catch (err: any) {
      setQrError('Unable to fetch QR code');
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col pt-8 pb-12 px-4 sm:px-6 relative selection:bg-agent-accent/30">
      <Background />

      {/* Auth Header */}
      <div className="max-w-5xl mx-auto w-full flex justify-end mb-8 relative z-50">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-agent-purple/30">
              <UserIcon size={16} className="text-agent-purple" />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 rounded-full glass-panel shadow-lg hover:bg-red-500/20 hover:text-red-400 transition-colors border-red-500/20"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 rounded-full text-sm font-bold border border-white/10 hover:bg-white/5 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 rounded-full text-sm font-bold bg-agent-accent text-black hover:bg-agent-accent/90 transition-all shadow-lg shadow-agent-accent/20">
              Register
            </Link>
          </div>
        )}
      </div>

      <motion.div
        className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border-agent-accent/20">
          <Zap size={16} className="text-agent-accent" />
          <span className="text-sm tracking-wide text-agent-accent uppercase">Hyper-speed routing active</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-agent-accent to-agent-purple text-glow">Swift</span>
          <span className="text-slate-100">Link</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Transform your endless links into sleek, custom futuristic nodes.
        </p>
      </motion.div>

      <motion.main
        className="w-full max-w-2xl mx-auto glass-panel p-6 sm:p-8 relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <form onSubmit={handleShorten} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-agent-accent to-agent-purple rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center">
              <div className="absolute left-5 text-agent-accent/60"><Link2 size={24} /></div>
              <input
                type="url" required placeholder="Initialize sequence with target URL..."
                value={url} onChange={(e) => setUrl(e.target.value)}
                className="w-full py-4 pl-14 pr-4 glass-input text-lg bg-agent-900/80 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1 group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-agent-purple/50"><Scissors size={20} /></div>
              <input
                type="text" placeholder="Custom node alias (optional)"
                value={customCode} onChange={(e) => setCustomCode(e.target.value)}
                className="w-full py-4 pl-14 pr-4 glass-input text-base bg-agent-900/80 outline-none"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="py-4 px-8 bg-agent-accent/10 border border-agent-accent/40 text-agent-accent hover:bg-agent-accent hover:text-black rounded-xl font-bold transition-all uppercase text-sm sm:w-auto w-full"
            >
              {loading ? <Activity size={18} className="animate-spin" /> : "Engage"}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="text-red-400 mt-5 text-center text-sm bg-red-500/10 py-3 rounded-lg">
              System Error: {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <AnimatePresence>
        {recentUrls.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-5 px-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-agent-accent/30"></div>
              <span className="text-xs uppercase tracking-widest text-agent-accent/80 font-semibold">
                {user ? `Personal Terminal (${recentUrls.length})` : `Recent Nodes (${recentUrls.length}/5)`}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-agent-accent/30"></div>
            </div>

            <div className="flex flex-col gap-3">
              {recentUrls.map((item, index) => (
                <motion.div key={item.shortUrl} layout className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                  <div className="overflow-hidden flex-1 w-full">
                    <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-medium text-agent-accent hover:text-white truncate block mb-1">
                      {item.shortUrl}
                    </a>
                    <p className="text-xs text-slate-400 truncate w-full flex items-center gap-2">
                       {item.clicks !== undefined && (
                         <span className="px-1.5 py-0.5 bg-agent-purple/20 text-agent-purple rounded text-[10px] font-bold">{item.clicks} CLICKS</span>
                       )}
                       {item.originalUrl}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center self-end sm:self-auto">
                    <Link
                      to={`/analytics/${item.shortCode ?? extractCodeFromUrl(item.shortUrl)}`}
                      className="p-3 bg-agent-900/50 border border-white/10 hover:border-agent-purple/50 hover:bg-agent-purple/20 hover:text-agent-purple rounded-lg transition-all text-slate-300"
                      title="View Analytics"
                    >
                      <BarChart2 size={20} />
                    </Link>

                    <button
                      onClick={() => fetchQrForCode(item.shortCode ?? extractCodeFromUrl(item.shortUrl))}
                      className="p-3 bg-agent-900/50 border border-white/10 hover:border-agent-accent/50 hover:bg-agent-accent/20 hover:text-agent-accent rounded-lg transition-all text-slate-300"
                    >
                      <QrCode size={20} />
                    </button>

                    <button
                      onClick={() => copyToClipboard(item.shortUrl, index)}
                      className="p-3 bg-agent-900/50 border border-white/10 hover:border-agent-accent/50 hover:bg-agent-accent/20 hover:text-agent-accent rounded-lg transition-all text-slate-300"
                    >
                      {copiedIndex === index ? <CheckCircle className="text-green-400" size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {qrDataUrl && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setQrDataUrl(null)}>
            <motion.div className="relative w-full max-w-sm bg-agent-950/90 border border-white/10 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-lg font-semibold text-white">QR code</h3></div>
                <button onClick={() => setQrDataUrl(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-300"><X size={18} /></button>
              </div>
              <div className="flex items-center justify-center mb-6">
                {qrLoading ? <div className="animate-spin h-10 w-10 border-4 border-agent-accent rounded-full border-t-transparent" /> : <div className="p-3 bg-white rounded-xl"><img src={qrDataUrl} className="h-44 w-44" /></div>}
              </div>
              <a href={qrDataUrl ?? ''} download="qr.png" className="w-full text-center py-4 bg-agent-accent text-black rounded-xl font-bold block shadow-lg shadow-agent-accent/20">Download PNG</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-12 pb-8 text-center"><p className="text-xs text-slate-600 uppercase tracking-widest">Powered by Deepmind Architecture &copy; {new Date().getFullYear()}</p></footer>
    </div>
  );
}
