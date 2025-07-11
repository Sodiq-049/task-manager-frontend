import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import NewProject from './pages/NewProject';
import NewTask from './pages/NewTask';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import "./styles/utilities.css";
import TaskBoard from './components/TaskBoard';



function App() {
  return (

    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">

      <Router>
      
        <Routes>
          {/* Public Routes */}
        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/projects/new" element={<PrivateRoute><NewProject /></PrivateRoute>} />
          <Route path="/projects/:projectId" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
          <Route path="/tasks/new" element={<PrivateRoute><NewTask /></PrivateRoute>} />
          <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
          <Route path="/board" element={<PrivateRoute><TaskBoard /></PrivateRoute>} />

          


          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
