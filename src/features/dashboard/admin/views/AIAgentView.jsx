import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import {
  MessageSquare,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Terminal as TerminalIcon,
  Globe,
  Database,
  Lock,
} from 'lucide-react';
import Loader from '../../../../components/shared/Loader';

// Connect to your actual backend socket
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const AdminAIAgentView = () => {
  const [loading, setLoading] = useState(true);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('STRICT');

  // Real settings state that will be sent to the LLM (OpenAI/Claude)
  const [settings, setSettings] = useState({
    personality: 'Professional',
    language: 'Bilingual',
    knowledgeBase: '',
  });

  // Metrics & Logs from Database
  const [metrics, setMetrics] = useState({
    queries: 0,
    resolution: 0,
    threats: 0,
    latency: 0,
  });
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // 1. Fetch Initial Config & Logs from Backend
  useEffect(() => {
    const fetchAIConfig = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/ai-agent/config`, {
          withCredentials: true,
        });
        setSettings(data.settings);
        setIsAgentActive(data.isActive);
        setSecurityLevel(data.securityLevel);
        setMetrics(data.metrics);
        setLogs(data.recentLogs || []);
      } catch (error) {
        toast.error('FAILED TO SYNC WITH AI CORE.');
      } finally {
        setLoading(false);
      }
    };
    fetchAIConfig();
  }, [API_URL]);

  // 2. Real-time WebSocket connection for Live AI Actions
  useEffect(() => {
    if (!isAgentActive) return;

    socket.on('ai-activity-log', newLog => {
      setLogs(prev => [...prev, newLog]);
    });

    socket.on('ai-metrics-update', newMetrics => {
      setMetrics(newMetrics);
    });

    return () => {
      socket.off('ai-activity-log');
      socket.off('ai-metrics-update');
    };
  }, [isAgentActive]);

  // Auto-scroll terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // 3. Toggle Agent Power State
  const handleToggleAgent = async () => {
    setLoading(true);
    try {
      const newState = !isAgentActive;
      await axios.post(
        `${API_URL}/ai-agent/toggle`,
        { isActive: newState },
        { withCredentials: true }
      );
      setIsAgentActive(newState);
      toast.info(`Protocol ${newState ? 'ENGAGED' : 'TERMINATED'}`, {
        icon: newState ? '⚡' : '🛑',
      });
    } catch (error) {
      toast.error('SYSTEM OVERRIDE FAILED.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Settings to Backend (This changes the AI's actual behavior)
  const saveSettings = async () => {
    try {
      await axios.put(
        `${API_URL}/ai-agent/config`,
        {
          settings,
          securityLevel,
        },
        { withCredentials: true }
      );
      toast.success('MATRIX UPDATED. RE-SYNCING AI NEURAL NET.');

      // Notify the backend to reload the prompt context
      socket.emit('reload-ai-context');
    } catch (error) {
      toast.error('FAILED TO COMMIT CHANGES.');
    }
  };

  // 5. Flush Logs
  const handleFlushLogs = async () => {
    try {
      await axios.delete(`${API_URL}/ai-agent/logs`, { withCredentials: true });
      setLogs([]);
      toast.success('MEMORY BUFFER FLUSHED.');
    } catch (error) {
      toast.error('FLUSH FAILED.');
    }
  };

  if (loading && !logs.length)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-12 font-sans selection:bg-red-50 selection:text-red-600">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <div className="h-[1px] w-12 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Artificial Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-stone-900 tracking-tighter leading-none uppercase">
            Autonomous <br />
            <span className="italic font-serif text-red-600 lowercase tracking-normal font-normal">
              — protocol.
            </span>
          </h2>
        </div>

        <div className="flex flex-col items-end gap-4">
          <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">
            Core Engine Status
          </p>
          <button
            onClick={handleToggleAgent}
            disabled={loading}
            className={`relative flex items-center gap-4 px-8 py-4 border transition-all duration-700 group overflow-hidden ${isAgentActive ? 'border-red-600 bg-red-50/10 text-red-600 hover:bg-red-600 hover:text-white' : 'border-stone-900 bg-stone-900 text-white hover:bg-stone-800'}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isAgentActive ? 'bg-red-600 group-hover:bg-white animate-pulse' : 'bg-stone-500'}`}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] relative z-10">
              {loading
                ? 'PROCESSING...'
                : isAgentActive
                  ? 'TERMINATE AGENT'
                  : 'INITIALIZE AGENT'}
            </span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 border border-stone-100 shadow-2xl shadow-stone-200/20 transition-opacity duration-1000 ${!isAgentActive && 'opacity-50 grayscale'}`}
      >
        <StatCard
          id="01"
          title="Queries Handled"
          value={metrics.queries}
          icon={<MessageSquare size={18} />}
        />
        <StatCard
          id="02"
          title="Resolution Rate"
          value={`${metrics.resolution}%`}
          icon={<Activity size={18} />}
        />
        <StatCard
          id="03"
          title="Threats Neutralized"
          value={metrics.threats}
          icon={<ShieldAlert size={18} />}
        />
        <StatCard
          id="04"
          title="Latency"
          value={`${metrics.latency}s`}
          icon={<Zap size={18} />}
        />
      </div>

      {/* Configuration & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        <div className="lg:col-span-7 space-y-12 relative z-10">
          {/* Settings Block */}
          <div className="bg-white p-10 border border-stone-100 group">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900">
                — Behavioral Matrix
              </h3>
              <Cpu size={14} className="text-stone-300" />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                    Persona Architecture
                  </label>
                  <select
                    value={settings.personality}
                    onChange={e =>
                      setSettings({ ...settings, personality: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase tracking-widest text-stone-900 focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Professional">Professional Ledger</option>
                    <option value="Casual">Casual / Empathetic</option>
                    <option value="Aggressive">
                      High-Conversion (Aggressive)
                    </option>
                  </select>
                </div>
                <div className="space-y-3 relative">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">
                    Linguistic Output
                  </label>
                  <select
                    value={settings.language}
                    onChange={e =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-stone-200 pb-3 text-[11px] font-black uppercase tracking-widest text-stone-900 focus:outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Bilingual">Bilingual (Auto-Detect)</option>
                    <option value="Bengali">Bengali Primary</option>
                    <option value="English">English Primary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Knowledge Base Ingestion</span>
                  <Database size={10} />
                </label>
                <textarea
                  value={settings.knowledgeBase}
                  onChange={e =>
                    setSettings({ ...settings, knowledgeBase: e.target.value })
                  }
                  rows="4"
                  className="w-full bg-stone-50 border border-stone-100 p-5 text-[11px] font-mono tracking-wider text-stone-600 focus:outline-none focus:border-red-600 focus:bg-white transition-all resize-none"
                  placeholder="Insert systemic rules and brand data..."
                />
              </div>

              <button
                onClick={saveSettings}
                className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 hover:text-stone-900 transition-colors flex items-center gap-3"
              >
                <div className="h-[1px] w-8 bg-current transition-all" /> Commit
                Changes
              </button>
            </div>
          </div>
        </div>

        {/* Terminal log area remains identical, but now renders real `logs` state.  */}
        <div className="lg:col-span-5 bg-[#0a0a0a] border border-stone-800 p-8 flex flex-col h-[600px] relative shadow-2xl">
          <div className="flex justify-between items-center border-b border-stone-800 pb-6 mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-100 flex items-center gap-3">
              <TerminalIcon size={14} /> Output Stream
            </h3>
            <span
              className={`text-[9px] font-mono tracking-widest ${isAgentActive ? 'text-red-500 animate-pulse' : 'text-stone-600'}`}
            >
              {isAgentActive ? '[ LIVE RECORDING ]' : '[ OFFLINE ]'}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 pr-4 custom-scrollbar">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-stone-600 shrink-0">[{log.time}]</span>
                <span
                  className={`shrink-0 font-bold ${log.type === 'ALERT' ? 'text-red-500' : log.type === 'INTENT' ? 'text-emerald-500' : 'text-stone-400'}`}
                >
                  {log.type}:
                </span>
                <span className="text-stone-300 break-words">{log.msg}</span>
              </div>
            ))}
            <div ref={logEndRef} />
            {isAgentActive && (
              <div className="flex gap-4 mt-2">
                <span className="text-stone-600">
                  [{new Date().toLocaleTimeString('en-GB', { hour12: false })}]
                </span>
                <span className="w-2 h-3 bg-red-600 animate-pulse" />
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-stone-800">
            <button
              onClick={handleFlushLogs}
              className="w-full text-center py-3 text-[9px] font-black text-stone-500 hover:text-red-500 hover:bg-stone-900 transition-all uppercase tracking-[0.4em]"
            >
              Flush Memory Buffer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, id }) => (
  <div className="bg-white p-10 flex flex-col items-start transition-all duration-700 hover:bg-stone-50/50 group relative overflow-hidden">
    <span className="absolute top-8 right-10 text-[32px] font-serif italic text-stone-50 group-hover:text-red-50 transition-colors">
      — {id}
    </span>
    <div className="mb-10 text-stone-900 group-hover:text-red-600 transition-colors">
      {icon}
    </div>
    <div className="space-y-3 relative z-10">
      <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.4em]">
        {title}
      </h3>
      <p className="text-3xl font-black text-stone-900 tracking-tighter uppercase leading-none">
        {value}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
  </div>
);

export default AdminAIAgentView;
