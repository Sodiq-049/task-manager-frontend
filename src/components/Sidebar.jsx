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
} from "lucide-react";
import API from "../api"; // ✅ Using your configured Axios instance
import SearchBar from "./SearchBar";

const Sidebar = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col space-y-4">
      <h1 className="text-2xl font-bold mb-6">TaskFlow</h1>

      {/* Compact search bar placeholder (optional)
      <SearchBar compact /> */}

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

        {/* Projects Section */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
          <span className="uppercase tracking-wide">Projects</span>
          <Link to="/projects/new">
            <FolderPlus size={18} className="cursor-pointer hover:text-blue-400" />
          </Link>
        </div>

        {/* Projects List */}
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
      <Link className="flex items-center space-x-2 hover:text-blue-400" to="/settings">
        <Settings size={20} />
        <span>Settings</span>
      </Link>
    </div>
  );
};

export default Sidebar;
