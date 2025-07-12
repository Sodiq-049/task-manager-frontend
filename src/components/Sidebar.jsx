import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Bell,
  FolderPlus,
  X,
} from "lucide-react";
import API from "../api";

const Sidebar = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-6 transform transition-transform duration-300 overflow-y-auto lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Desktop brand */}
        <h1 className="hidden lg:block text-2xl font-bold mb-6">TaskFlow</h1>

        {/* Navigation Links */}
        <nav className="space-y-4 flex-1">
          <Link className="flex items-center space-x-2 hover:text-blue-400" to="/dashboard">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link className="flex items-center space-x-2 hover:text-blue-400" to="/calendar">
            <Calendar size={20} />
            <span>Calendar</span>
          </Link>
          <Link className="flex items-center space-x-2 hover:text-blue-400" to="/team">
            <Users size={20} />
            <span>Team</span>
          </Link>
          <Link className="flex items-center space-x-2 hover:text-blue-400" to="/analytics">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </Link>
          <Link className="flex items-center space-x-2 hover:text-blue-400" to="/notifications">
            <Bell size={20} />
            <span>Notifications</span>
          </Link>

          {/* Projects */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
            <span className="uppercase tracking-wide">Projects</span>
            <Link to="/projects/new">
              <FolderPlus size={18} className="cursor-pointer hover:text-blue-400" />
            </Link>
          </div>

          <div className="mt-2 ml-2 text-sm text-gray-200 space-y-1">
            {projects.length === 0 ? (
              <p className="text-gray-400">No project yet, create your first project.</p>
            ) : (
              projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block hover:text-blue-400"
                >
                  • {project.name}
                </Link>
              ))
            )}
          </div>
        </nav>

        {/* Settings Link */}
        <Link
          className="flex items-center space-x-2 hover:text-blue-400 mt-6"
          to="/settings"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;
