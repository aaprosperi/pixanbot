'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  category: string;
  action: string;
  details: Record<string, unknown>;
  session_id: string | null;
  duration_ms: number | null;
  cost: number | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  exec: 'text-blue-400',
  file: 'text-green-400',
  api: 'text-purple-400',
  conversation: 'text-yellow-400',
  deploy: 'text-orange-400',
  cost: 'text-pink-400',
  error: 'text-red-400',
  system: 'text-neutral-400',
};

const CATEGORY_ICONS: Record<string, string> = {
  exec: '⚡',
  file: '📄',
  api: '🔌',
  conversation: '💬',
  deploy: '🚀',
  cost: '💰',
  error: '❌',
  system: '⚙️',
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
}

function formatAction(action: string) {
  return action.replace(/tool:/g, '').replace(/:start/g, ' →').replace(/:end/g, ' ✓');
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      const url = filter === 'all' 
        ? 'https://pixan-logs.vercel.app/api/logs?limit=100'
        : `https://pixan-logs.vercel.app/api/logs?category=${filter}&limit=100`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setLogs(data.logs);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [filter, autoRefresh]);

  const categories = ['all', 'exec', 'conversation', 'error', 'system', 'cost'];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl hover:opacity-70">✦</a>
            <h1 className="text-2xl font-light">Activity Logs</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-sm px-3 py-1 rounded ${
                autoRefresh ? 'bg-green-900 text-green-400' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {autoRefresh ? '● Live' : '○ Paused'}
            </button>
            
            {/* Refresh button */}
            <button
              onClick={fetchLogs}
              className="text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {cat === 'all' ? 'All' : `${CATEGORY_ICONS[cat] || '•'} ${cat}`}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mb-6 text-sm text-neutral-500">
          <span>{logs.length} entries</span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-neutral-500 text-center py-12">
            Loading logs...
          </div>
        )}

        {/* Logs list */}
        {!loading && (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 py-2 px-3 rounded hover:bg-neutral-900/50 group"
              >
                {/* Time */}
                <span className="text-neutral-600 text-sm font-mono w-20 flex-shrink-0">
                  {formatTime(log.timestamp)}
                </span>
                
                {/* Category */}
                <span className={`text-sm w-24 flex-shrink-0 ${CATEGORY_COLORS[log.category] || 'text-neutral-400'}`}>
                  {CATEGORY_ICONS[log.category] || '•'} {log.category}
                </span>
                
                {/* Action */}
                <span className="text-neutral-300 flex-1">
                  {formatAction(log.action)}
                </span>
                
                {/* Details (on hover) */}
                <span className="text-neutral-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-xs truncate">
                  {log.details?.toolCallId ? `#${String(log.details.toolCallId).slice(-8)}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && logs.length === 0 && (
          <div className="text-neutral-500 text-center py-12">
            No logs found
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-neutral-800 text-neutral-600 text-sm">
        <div className="flex justify-between">
          <span>✦ An&apos;s Activity Log</span>
          <a href="https://github.com/aaprosperi/pixanbot" className="hover:text-white">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
