import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, CheckCircle, ArrowRight, Activity, Zap, Scissors, QrCode, X } from 'lucide-react';
import axios from 'axios';
import { Background } from './components/Background';

const API_BASE = 'http://localhost:3000'; // Hardcorded for now, assuming BE runs on 3000

interface RecentUrl {
  shortUrl: string;
  originalUrl: string;
  shortCode?: string;
}

function App() {
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

  // Load recent URLs from localStorage
  useEffect(() => {
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
  }, []);

  const saveRecentUrls = (newUrls: RecentUrl[]) => {
    setRecentUrls(newUrls);
    localStorage.setItem('swiftlink_recent', JSON.stringify(newUrls));
  };

  const fetchQrForCode = async (code: string) => {
    setQrLoading(true);
    setQrError('');
    try {
      const response = await axios.get(`${API_BASE}/${code}/qr`);
      setQrDataUrl(response.data);
      setQrShortCode(code);
    } catch (err: any) {
      let errorMsg = 'Unable to fetch QR code';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setQrError(errorMsg);
      setQrDataUrl(null);
      setQrShortCode(null);
    } finally {
      setQrLoading(false);
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');

    try {
      const payload: any = { originalUrl: url };
      if (customCode.trim()) {
        payload.shortCode = customCode.trim();
      }

      const response = await axios.post(`${API_BASE}/urls/shorten`, payload);

      const newShortUrl = `${API_BASE}/${response.data.shortCode}`;
      const newItem: RecentUrl = { shortUrl: newShortUrl, originalUrl: url, shortCode: response.data.shortCode };

      // Update recent urls (keep max 5, remove duplicates if any)
      const filteredUrls = recentUrls.filter(item => item.shortUrl !== newShortUrl);
      const updatedUrls = [newItem, ...filteredUrls].slice(0, 5);

      saveRecentUrls(updatedUrls);

      // Show QR code for the newly created link
      await fetchQrForCode(response.data.shortCode);

      // Reset form
      setUrl('');
      setCustomCode('');
    } catch (err: any) {
      // BE errors like validation or "Short code already exists" will be caught here
      let errorMsg = 'Failed to shorten URL';
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMsg = err.response.data.message.join(', ');
        } else {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 flex flex-col pt-16 pb-12 px-4 sm:px-6 relative selection:bg-agent-accent/30 overflow-hidden">
      <Background />

      {/* Header section with futuristic typography */}
      <motion.div
        className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border-agent-accent/20">
          <Zap size={16} className="text-agent-accent" />
          <span className="text-sm tracking-wide text-agent-accent uppercase">Hyper-speed routing active</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-agent-accent to-agent-purple text-glow">Swift</span>
          <span className="text-slate-100">Link</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto tracking-wide">
          Transform your endless links into sleek, custom futuristic nodes.
        </p>
      </motion.div>

      {/* Main Form glass panel */}
      <motion.main
        className="w-full max-w-2xl mx-auto glass-panel p-6 sm:p-8 relative z-10 before:content-[''] before:absolute before:inset-0 before:rounded-lg before:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleShorten} className="relative z-20 flex flex-col gap-5">
          {/* URL Input */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-agent-accent to-agent-purple rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <div className="absolute left-5 text-agent-accent/60">
                <Link2 size={24} />
              </div>
              <input
                type="url"
                required
                placeholder="Initialize sequence with target URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full py-4 pl-14 pr-4 glass-input text-lg bg-agent-900/80 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            {/* Custom Code Input */}
            <div className="relative flex-1 group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-agent-purple/50 group-hover:text-agent-purple/80 transition-colors">
                <Scissors size={20} />
              </div>
              <input
                type="text"
                placeholder="Custom node alias (optional)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="w-full py-4 pl-14 pr-4 glass-input text-base bg-agent-900/80 outline-none focus:border-agent-purple hover:border-agent-purple/50 focus:ring-agent-purple/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="py-4 px-8 bg-agent-accent/10 border border-agent-accent/40 text-agent-accent hover:bg-agent-accent hover:text-black hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 uppercase text-sm sm:w-auto w-full shrink-0"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Activity size={18} />
                </motion.div>
              ) : (
                <>
                  Engage <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-red-400 mt-5 text-center text-sm bg-red-500/10 py-3 rounded-lg border border-red-500/20"
            >
              System Error: {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Recent Links Section */}
      <AnimatePresence>
        {recentUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto relative z-10"
          >
            <div className="flex items-center gap-4 mb-5 px-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-agent-accent/30"></div>
              <span className="text-xs uppercase tracking-widest text-agent-accent/80 font-semibold">Active Nodes ({recentUrls.length}/5)</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-agent-accent/30"></div>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {recentUrls.map((item, index) => (
                  <motion.div
                    key={item.shortUrl}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/5 hover:border-agent-accent/30 hover:bg-agent-800/80 transition-colors gap-4 group"
                  >
                    <div className="overflow-hidden flex-1 w-full relative z-10">
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-medium text-agent-accent group-hover:text-white transition-colors truncate block mb-1 drop-shadow-md"
                      >
                        {item.shortUrl}
                      </a>
                      <p className="text-xs text-slate-400 truncate w-full" title={item.originalUrl}>
                        {item.originalUrl}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center self-end sm:self-auto">
                      <button
                        onClick={() => fetchQrForCode(item.shortCode ?? extractCodeFromUrl(item.shortUrl))}
                        className="p-3 bg-agent-900/50 border border-white/10 hover:border-agent-accent/50 hover:bg-agent-accent/20 hover:text-agent-accent shadow-lg hover:shadow-neon-cyan rounded-lg transition-all text-slate-300 shrink-0 relative z-20"
                        title="View QR code"
                      >
                        <QrCode size={20} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(item.shortUrl, index)}
                        className="p-3 bg-agent-900/50 border border-white/10 hover:border-agent-accent/50 hover:bg-agent-accent/20 hover:text-agent-accent shadow-lg hover:shadow-neon-cyan rounded-lg transition-all text-slate-300 shrink-0 relative z-20"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? <CheckCircle className="text-green-400" size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {qrDataUrl && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrDataUrl(null)}
          >
            <motion.div
              className="relative w-full max-w-sm bg-agent-950/90 border border-white/10 rounded-2xl shadow-xl p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">QR code</h3>
                  <p className="text-xs text-slate-400">Download or scan to open your link.</p>
                </div>
                <button
                  onClick={() => setQrDataUrl(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-300"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center justify-center mb-4">
                {qrLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="h-12 w-12 rounded-full border-4 border-agent-accent/40 border-t-agent-accent animate-spin"
                    />
                    <p className="text-xs text-slate-400">Generating QR code…</p>
                  </div>
                ) : qrError ? (
                  <p className="text-sm text-red-300 text-center">{qrError}</p>
                ) : (
                  <img
                    src={qrDataUrl}
                    alt="QR code"
                    className="h-48 w-48 rounded-lg bg-white/10 p-2"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={qrDataUrl ?? ''}
                  download={`swiftlink-${qrShortCode ?? 'qr'}.png`}
                  className="w-full text-center py-3 rounded-xl bg-agent-accent text-black font-semibold hover:bg-agent-accent/90 transition"
                >
                  Download QR image
                </a>
                <button
                  onClick={() => setQrDataUrl(null)}
                  className="w-full text-center py-3 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative footer elements */}
      <motion.div
        className="mt-12 pb-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs tracking-widest text-slate-600 uppercase">
          Powered by Deepmind Architecture &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

export default App;
