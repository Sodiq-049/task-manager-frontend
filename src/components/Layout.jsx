import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, Bell, BarChart3, Settings as Gear } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { to: '/settings', label: 'Settings', icon: <Gear size={20} /> },
];

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">Smart Task Manager</h1>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
