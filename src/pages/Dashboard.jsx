import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskBoard from "../components/TaskBoard";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  LoaderCircle,
  CircleCheckBig,
  Users,
  AlarmClock,
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const summaryCards = [
    { label: "Total Tasks", icon: LayoutDashboard },
    { label: "In Progress", icon: LoaderCircle },
    { label: "Completed", icon: CircleCheckBig },
    { label: "Team Members", icon: Users },
    { label: "Overdue", icon: AlarmClock },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Dashboard Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-2xl font-bold">Project Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your team's tasks and track progress.
                </p>
              </div>
              <Link to="/tasks/new">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Task
                </button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {summaryCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center justify-between transition-colors duration-300"
                >
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{card.label}</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">0</h3>
                  </div>
                  <span className="text-blue-500">
                    <Icon size={28} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Task Board Section */}
          <TaskBoard />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
