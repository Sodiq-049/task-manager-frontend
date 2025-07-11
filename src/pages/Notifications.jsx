import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050"); // ✅ move outside component to avoid multiple connections

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);

        // ✅ Clear notifications when user visits the page
        await fetch("/api/notifications/clear", { method: "DELETE" });
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("notification", (note) => {
      setNotifications((prev) => [...prev, note]);
    });

    return () => socket.off("notification");
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "comment":
        return "🗨️";
      case "warning":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center">
          No notifications yet.
        </div>
      ) : (
        <ul className="bg-white rounded-lg shadow divide-y">
          {notifications.map((note) => (
            <li key={note._id || note.id} className="p-4 flex items-center gap-3">
              <span className="text-xl">{renderIcon(note.type)}</span>
              <span className="text-gray-800">{note.message}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={async () => {
            await fetch("/api/notifications/clear", { method: "DELETE" });
            setNotifications([]);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Clear All Notifications
        </button>
      </div>
    </motion.div>
  );
};

export default Notifications;
