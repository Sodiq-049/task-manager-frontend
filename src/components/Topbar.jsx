import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import { io } from "socket.io-client";
import {
  User,
  LogOut,
  Settings as SettingsIcon,
  UserCircle,
  Bell,
} from "lucide-react";

// 🔌 Setup WebSocket
const socket = io("http://localhost:5050");

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState({
    name: "Guest User",
    role: "Admin",
    email: "guest@example.com",
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

    const fetchUser = async () => {
    try {
        const res = await axios.get("/api/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch profile", err);
        }
    };


  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data);
      } catch {
        setUser({
          name: "Guest User",
          role: "Admin",
          email: "guest@example.com",
        });
      }
    };
    fetchUser();
  }, []);

  // Notifications
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("/api/notifications");
        setNotificationCount(res.data.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    socket.on("notification", () =>
      setNotificationCount((prev) => prev + 1)
    );

    return () => {
      clearInterval(interval);
      socket.off("notification");
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow px-4 py-3 flex items-center justify-between transition-colors duration-300">
      {/* Logo */}
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">Task Manager</h2>

      {/* Center: Search */}
      <div className="hidden sm:flex items-center justify-center flex-1">
        <SearchBar />
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center space-x-4" ref={dropdownRef}>
        {/* Notification Bell */}
        <Link to="/notifications" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-500">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col items-start px-3 py-1.5 border border-blue-500 rounded-md text-gray-700 dark:text-white hover:text-blue-500"
          >
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span className="text-sm">{user.name}</span>
            </div>
            <span className="text-xs text-gray-400">{user.role}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-700 dark:text-white">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => navigate("/profile")}
                  >
                    <UserCircle size={16} className="mr-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => navigate("/settings")}
                  >
                    <SettingsIcon size={16} className="mr-2" />
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
