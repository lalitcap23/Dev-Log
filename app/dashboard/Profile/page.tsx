"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProfileData {
  username: string;
  tokens: number;
  completionRate: number;
  streak: number;
  last7Days: { date: string; completed: boolean }[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 mt-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-8"
      >
        👤 {profile.username}'s Profile
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="🎯 Completion Rate" value={`${profile.completionRate}%`} />
        <StatCard title="🔥 Streak" value={`${profile.streak} days`} />
        <StatCard title="🪙 Mumasy Tokens" value={profile.tokens} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Last 7 Days</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {profile.last7Days.map((day, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2 text-sm font-medium ${
                day.completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="rounded-2xl shadow-md p-4 text-center bg-black dark:bg-[#1e1e1e] border border-black-200 dark:border-gray-700">
        <CardContent>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
