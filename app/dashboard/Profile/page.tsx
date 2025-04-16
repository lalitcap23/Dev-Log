"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { FaUser, FaCoins, FaChartLine } from "react-icons/fa";
import sidebar from "@/components/sidebar";

interface ProfileData {
  name: string;
  email: string;
  mumasies: number;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Please sign in to view your profile</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
      {profileData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUser className="text-blue-500 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaCoins className="text-yellow-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Mumasies Tokens</h3>
                <p className="text-2xl font-bold">{profileData.mumasies}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Task Completion Card */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaChartLine className="text-green-500 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">7-Day Performance</h2>
                <p className="text-gray-600">Task completion average</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Completion Rate</span>
                <span className="font-bold">{profileData.completionRate}%</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={profileData.completionRate} 
                className="h-2 rounded-full"
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <div>
                <p className="font-medium">Total Tasks</p>
                <p className="text-xl font-bold">{profileData.totalTasks}</p>
              </div>
              <div>
                <p className="font-medium">Completed</p>
                <p className="text-xl font-bold">{profileData.completedTasks}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}