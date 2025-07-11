import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Analytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/tasks/analytics/summary");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Task Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Tasks</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Completed</p>
          <h2 className="text-2xl font-bold">{stats.completed}</h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending</p>
          <h2 className="text-2xl font-bold">{stats.pending}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Overdue</p>
          <h2 className="text-2xl font-bold">{stats.overdue}</h2>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>
    </motion.div>
  );
};

export default Analytics;
