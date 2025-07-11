import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/tasks/${taskId}`);
        setTask(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load task:", err);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5050/api/tasks/${taskId}`, form);
      setIsEditing(false);
      setTask(form);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:5050/api/tasks/${taskId}`);
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  if (!task) return <p className="p-6">Loading task...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Task Details</h2>

      <div className="space-y-4">
        <div>
          <label className="font-medium">Title</label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{task.title}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Priority</label>
            {isEditing ? (
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            ) : (
              <p>{task.priority}</p>
            )}
          </div>
          <div>
            <label className="font-medium">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            ) : (
              <p>{task.status}</p>
            )}
          </div>
        </div>

        <div>
          <label className="font-medium">Assignee</label>
          {isEditing ? (
            <input
              type="text"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{task.assignee}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Due Date</label>
          {isEditing ? (
            <input
              type="date"
              name="dueDate"
              value={form.dueDate?.substring(0, 10)}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{new Date(task.dueDate).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Tags</label>
          {isEditing ? (
            <input
              type="text"
              name="tags"
              value={form.tags?.join(", ")}
              onChange={(e) =>
                setForm({ ...form, tags: e.target.value.split(",").map((tag) => tag.trim()) })
              }
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{task.tags?.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

        <div className="space-x-2">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit Task
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
