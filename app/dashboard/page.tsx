"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar, Clock, Edit3, Plus, Save, User, X, Timer, Moon, Sun } from "lucide-react";
import Image from "next/image";

interface Log {
  id: string;
  content: string;
  timeMinutes: number;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [newLog, setNewLog] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number | "">("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTimeMinutes, setEditTimeMinutes] = useState<number | "">("");
  const [darkMode, setDarkMode] = useState(false);

  // Load previous logs - this would connect to your API in production
  useEffect(() => {
    // Mock data for demonstration
    const mockLogs = [
      {
        id: "1",
        content: "Implemented GitHub OAuth authentication using NextAuth.js. Had to troubleshoot CORS issues with the callback URL, but finally got it working smoothly.",
        timeMinutes: 120,
        createdAt: "2025-04-05T14:30:00Z",
      },
      {
        id: "2",
        content: "Created responsive dashboard UI with Tailwind CSS. Added dark mode support and mobile optimization.",
        timeMinutes: 90,
        createdAt: "2025-04-04T15:45:00Z",
      },
      {
        id: "3",
        content: "Fixed API rate limiting issue by implementing a queue system with Redis. Performance improved significantly for concurrent requests.",
        timeMinutes: 45,
        createdAt: "2025-04-03T11:20:00Z",
      },
      {
        id: "4",
        content: "Started learning about WebSockets for real-time updates. Created a simple chat application as a proof of concept.",
        timeMinutes: 180,
        createdAt: "2025-04-02T09:15:00Z",
      },
    ];
    setLogs(mockLogs);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("devlogs-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("devlogs-theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("devlogs-theme", "light");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newLog.trim() || timeMinutes === "") return;

    setIsSubmitting(true);

    try {
      // In production, this would be an API call
      // await fetch('/api/logs', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ content: newLog, timeMinutes: timeMinutes }) 
      // });
      
      const newLogEntry = {
        id: Date.now().toString(),
        content: newLog,
        timeMinutes: Number(timeMinutes),
        createdAt: new Date().toISOString(),
      };
      
      setLogs([newLogEntry, ...logs]);
      setNewLog("");
      setTimeMinutes("");
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save log:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (log: Log) => {
    setEditingLogId(log.id);
    setEditContent(log.content);
    setEditTimeMinutes(log.timeMinutes);
  };

  const cancelEditing = () => {
    setEditingLogId(null);
    setEditContent("");
    setEditTimeMinutes("");
  };

  const saveEdit = (id: string) => {
    if (editTimeMinutes === "") return;
    
    setLogs(logs.map(log => 
      log.id === id ? { 
        ...log, 
        content: editContent,
        timeMinutes: Number(editTimeMinutes)
      } : log
    ));
    setEditingLogId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const min = minutes % 60;
      return min > 0 ? `${hours} hr ${min} min` : `${hours} hr`;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-[#0a1a17] via-[#112c26] to-[#183c35] text-white font-sans ${darkMode ? 'dark' : ''}`}> 
      {/* NAVBAR */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-extrabold tracking-tight text-white">DevLogs</span>
        </div>
        <nav className="hidden md:flex gap-8 text-white/80 font-medium text-base">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#elements" className="hover:text-white transition">Elements</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#resources" className="hover:text-white transition">Resources</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 border border-white/10 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-white" />
            )}
          </button>
          <button className="px-5 py-1.5 bg-white text-[#0a1a17] font-semibold rounded-lg shadow hover:bg-gray-200 transition">Log in</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight">Design & Code together<br />powered by <span className="text-cyan-400">DevLogs</span>.</h1>
        <p className="text-center text-lg text-white/80 max-w-2xl mb-8">Collaborate in real-time on your development journey. Seamlessly track, reflect, and boost productivity with daily logs, instant updates, and an elegant dashboard for developers.</p>
        <div className="flex gap-4 mb-10">
          <a href="#get-started" className="px-6 py-2 bg-white text-[#0a1a17] font-bold rounded-lg shadow hover:bg-gray-200 transition">Get Started</a>
          <a href="#how-it-works" className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition">How it works</a>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mt-6">
          <div className="w-full">
            <div className="rounded-xl bg-[#13241f]/80 border border-white/10 shadow-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Built for designer–developer collaboration</h2>
              <p className="text-white/80 mb-6">DevLogs bridges the gap between your daily workflow and personal growth. Log your progress, set your intentions, and reflect on your journey—all in one beautiful, high-tech dashboard.</p>
              {/* TASKS TABLE */}
              <div className="rounded-lg overflow-hidden bg-[#0c1816]/80 border border-white/10 mt-6">
                <div className="flex items-center bg-[#162c28]/90 px-4 py-2 text-white/80 font-mono text-sm">
                  <span className="w-2/3">Task</span>
                  <span className="w-1/3">Time (min)</span>
                </div>
                {[0,1].map((i) => logs[i] && (
                  <div key={logs[i].id} className="flex items-center border-t border-white/5 px-4 py-3 hover:bg-[#183c35]/70 transition">
                    <span className="w-2/3 text-white/90 font-medium">{logs[i].content}</span>
                    <span className="w-1/3 text-cyan-300 font-mono">{logs[i].timeMinutes}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="flex items-center px-4 py-6 text-white/40">No tasks yet.</div>
                )}
              </div>
              {/* ADD TASK */}
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mt-6">
                <input
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                  placeholder="Add your dev task..."
                  className="flex-1 px-4 py-3 rounded-lg border border-white/10 bg-[#112c26]/80 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-white/40 shadow"
                />
                <input
                  type="number"
                  min="1"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Minutes"
                  className="w-32 px-4 py-3 rounded-lg border border-white/10 bg-[#112c26]/80 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-white/40 shadow"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newLog.trim() || timeMinutes === ""}
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0a1a17] font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Add Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}