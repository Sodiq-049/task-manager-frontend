import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskBoard from "../components/TaskBoard";
import {
  LayoutDashboard,
  LoaderCircle,
  CircleCheckBig,
  Users,
  AlarmClock,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const summaryCards = [
    { label: "Total Tasks", icon: LayoutDashboard },
    { label: "In Progress", icon: LoaderCircle },
    { label: "Completed", icon: CircleCheckBig },
    { label: "Team Members", icon: Users },
    { label: "Overdue", icon: AlarmClock },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Topbar />

        <div className="p-6">
          {/* Project Dashboard Title & Message */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold">Project Dashboard</h2>
                <p className="text-gray-600">Manage your team's tasks and track progress.</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {summaryCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <h3 className="text-xl font-bold">0</h3>
                  </div>
                  <span className="text-blue-500 text-2xl">
                    <IconComponent size={28} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Task Columns */}
          <TaskBoard />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4">Create New Task</h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe the task..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Priority</label>
                    <select className="w-full px-3 py-2 border rounded">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium">Status</label>
                    <select className="w-full px-3 py-2 border rounded">
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Assignee</label>
                  <input
                    type="text"
                    placeholder="Enter assignee name..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
