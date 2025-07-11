import React, { useEffect, useState } from "react";
import API from "../api"; // axios instance
import "../styles/TaskBoard.css"; // You can style as you like

const columns = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in-progress" },
  { title: "Done", status: "done" },
];

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleAddTask = async (status) => {
    if (!newTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/tasks",
        { title: newTaskTitle, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, res.data]);
      setNewTaskStatus(null);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-board bg-gray-100 dark:bg-gray-950 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Task Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col.status}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{col.title}</h2>

            {/* Task List */}
            <div className="space-y-3 mb-4">
              {tasks
                .filter((task) => task.status === col.status)
                .map((task) => (
                  <div
                    key={task._id}
                    className="p-3 bg-gray-200 dark:bg-gray-800 rounded text-sm text-gray-900 dark:text-white"
                  >
                    {task.title}
                  </div>
                ))}
            </div>

            {/* Add Task */}
            {newTaskStatus === col.status ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTask(col.status)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setNewTaskStatus(null);
                      setNewTaskTitle("");
                    }}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setNewTaskStatus(col.status)}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                + Add Task
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
