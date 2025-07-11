import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/tasks");
        const taskEvents = res.data.map((task) => ({
          id: task._id,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: true,
          priority: task.priority || "Medium",
          status: task.status || "To Do",
          description: task.description || "",
        }));
        setEvents(taskEvents);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleEventClick = (event) => {
    setSelectedTask(event);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/tasks/${selectedTask.id}`);
      setEvents(events.filter(e => e.id !== selectedTask.id));
      handleCloseModal();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const getEventStyle = (event) => {
    let backgroundColor = "#3182ce"; // default blue
    if (event.priority === "High") backgroundColor = "#e53e3e"; // red
    else if (event.priority === "Low") backgroundColor = "#38a169"; // green
    else if (event.status === "Completed") backgroundColor = "#805ad5"; // purple

    return { style: { backgroundColor } };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          ← Back to Dashboard
        </button>
      </div>

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
        style={{ height: "80vh" }}
        views={["month", "week", "day"]}
        popup
        eventPropGetter={getEventStyle}
      />

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-gray-600 mb-2">Due: {selectedTask.start.toDateString()}</p>
            <p className="mb-2">Priority: <strong>{selectedTask.priority}</strong></p>
            <p className="mb-2">Status: <strong>{selectedTask.status}</strong></p>
            <p className="text-sm text-gray-800 mb-4">{selectedTask.description}</p>

            <div className="flex justify-between">
              <button
                onClick={() => navigate(`/tasks/${selectedTask.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Full
              </button>
              <button
                onClick={() => navigate(`/tasks/${selectedTask.id}/edit`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
