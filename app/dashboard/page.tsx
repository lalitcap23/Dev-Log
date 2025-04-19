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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DevLogs</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
            <div className="flex items-center gap-3">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={36} 
                  height={36} 
                  className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User size={18} className="text-blue-600 dark:text-blue-300" />
                </div>
              )}
              <span className="font-medium text-gray-700 dark:text-gray-200">{session?.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Daily Log Entry */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <h2 className="text-xl text-white font-semibold flex items-center">
              <Calendar className="mr-2" size={20} />
              What did you code today?
            </h2>
            <p className="text-blue-100 mt-1">
              Record your development activities, challenges, and victories
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <textarea
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              placeholder="Describe what you worked on today as a developer..."
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-32 text-gray-700 dark:text-gray-200 dark:bg-gray-700"
            />
            
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="timeMinutes" className="flex items-center mr-2 text-gray-700 dark:text-gray-200">
                  <Timer size={18} className="mr-1 text-blue-500" />
                  Time required:
                </label>
                <input
                  id="timeMinutes"
                  type="number"
                  min="1"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Minutes"
                  className="border border-gray-200 dark:border-gray-700 rounded p-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
                <span className="ml-2 text-gray-500 dark:text-gray-400">minutes</span>
              </div>
              
              <div className="flex-grow"></div>
              
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Pro tip: Include technologies used and challenges overcome
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !newLog.trim() || timeMinutes === ""}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Log
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {showSuccessMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 m-6 mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Log saved successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Previous Logs */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your DevLog History</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review and reflect on your developer journey</p>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mb-4">
                <Edit3 size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No logs yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Start your developer journal by adding today's log above</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="mb-2 flex flex-wrap justify-between items-center">
                    <div className="flex items-center flex-wrap gap-2 mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">{formatDate(log.createdAt)}</span>
                      </div>
                      <span className="mx-2 text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
                      <div className="flex items-center">
                        <Clock size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                        <span className="text-gray-500 dark:text-gray-400">{formatTime(log.createdAt)}</span>
                      </div>
                      <span className="mx-2 text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
                      <div className="flex items-center">
                        <Timer size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                        <span className="text-gray-500 dark:text-gray-400">{formatDuration(log.timeMinutes)}</span>
                      </div>
                    </div>
                    
                    {editingLogId !== log.id && (
                      <button 
                        onClick={() => startEditing(log)}
                        className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                  
                  {editingLogId === log.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-24 text-gray-700 dark:text-gray-200 dark:bg-gray-700 mb-2"
                      />
                      <div className="flex items-center mb-3">
                        <label htmlFor={`edit-time-${log.id}`} className="flex items-center mr-2 text-gray-700 dark:text-gray-200">
                          <Timer size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
                          Time taken:
                        </label>
                        <input
                          id={`edit-time-${log.id}`}
                          type="number"
                          min="1"
                          value={editTimeMinutes}
                          onChange={(e) => setEditTimeMinutes(e.target.value ? Number(e.target.value) : "")}
                          placeholder="Minutes"
                          className="border border-gray-200 dark:border-gray-700 rounded p-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        />
                        <span className="ml-2 text-gray-500 dark:text-gray-400">minutes</span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={cancelEditing}
                          className="flex items-center px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          <X size={16} className="mr-1" />
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveEdit(log.id)}
                          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          disabled={editTimeMinutes === ""}
                        >
                          <Save size={16} className="mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{log.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>DevLogs - Your private developer journal</p>
        </div>
      </footer>
    </div>
  );
}