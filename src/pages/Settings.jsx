import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Section component with dark mode support
const Section = ({ id, title, children, isOpenByDefault }) => {
  const [open, setOpen] = useState(isOpenByDefault);

  useEffect(() => setOpen(isOpenByDefault), [isOpenByDefault]);

  return (
    <div id={id} className="border rounded-lg mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = true;
  const userId = "64fab89e65df739f7eab09ab"; // Replace with real user ID

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [account, setAccount] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profilePic: null,
    enable2FA: false,
  });

  const [workspace, setWorkspace] = useState({
    workspaceName: "",
    workspaceLogo: null,
    defaultPriority: "Medium",
    customField: "",
    publicTaskSharing: false,
  });

  const handleAccountChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkspaceChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setWorkspace((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const saveAccountSettings = async () => {
    try {
      const formData = new FormData();
      Object.entries(account).forEach(([key, value]) => {
        if (value !== null) formData.append(`account[${key}]`, value);
      });

      await axios.put(`/api/settings/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Account settings saved!");
    } catch (err) {
      console.error("❌ Error saving account settings:", err);
    }
  };

  const saveWorkspaceSettings = async () => {
    try {
      const formData = new FormData();
      Object.entries(workspace).forEach(([key, value]) => {
        if (value !== null) formData.append(`workspace[${key}]`, value);
      });

      await axios.put(`/api/settings/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Workspace settings saved!");
    } catch (err) {
      console.error("❌ Error saving workspace settings:", err);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`/api/settings/${userId}`);
        if (res.data.account) setAccount((prev) => ({ ...prev, ...res.data.account }));
        if (res.data.workspace) setWorkspace((prev) => ({ ...prev, ...res.data.workspace }));
      } catch (err) {
        console.error("❌ Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const sectionToOpen = location.hash?.replace("#", "");
  const inputClass = "input bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">⚙️ Settings</h1>
        <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Dashboard
        </button>
      </div>

      {/* Account Settings */}
      <Section id="account" title="🔐 Account Settings" isOpenByDefault={sectionToOpen === "account"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" value={account.fullName} onChange={handleAccountChange} type="text" placeholder="Full Name" className={inputClass} />
          <input name="username" value={account.username} onChange={handleAccountChange} type="text" placeholder="Username / Display Name" className={inputClass} />
          <input name="email" value={account.email} onChange={handleAccountChange} type="email" placeholder="Email Address" className={inputClass} />
          <input name="password" value={account.password} onChange={handleAccountChange} type="password" placeholder="Change Password" className={inputClass} />
          <input name="profilePic" onChange={handleAccountChange} type="file" accept="image/*" className={inputClass} />
          <input type="text" value="Admin" disabled className={`${inputClass} bg-gray-100 dark:bg-gray-600`} />
          <label className="flex items-center gap-2">
            <input name="enable2FA" type="checkbox" checked={account.enable2FA} onChange={handleAccountChange} />
            Enable 2FA
          </label>
        </div>
        <button onClick={saveAccountSettings} className="btn mt-4">Save Changes</button>
      </Section>

      {/* Workspace Settings */}
      {isAdmin && (
        <Section id="workspace" title="🏢 Workspace / Organization Settings" isOpenByDefault={sectionToOpen === "workspace"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="workspaceName" placeholder="Workspace Name" className={inputClass} value={workspace.workspaceName} onChange={handleWorkspaceChange} />
            <input type="file" name="workspaceLogo" accept="image/*" className={inputClass} onChange={handleWorkspaceChange} />
            <button className="btn" type="button">Invite Members</button>
            <select name="defaultPriority" className={inputClass} value={workspace.defaultPriority} onChange={handleWorkspaceChange}>
              <option value="Medium">Default Priority: Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
            <input type="text" name="customField" placeholder="Custom Fields (e.g., Department)" className={inputClass} value={workspace.customField} onChange={handleWorkspaceChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="publicTaskSharing" checked={workspace.publicTaskSharing} onChange={handleWorkspaceChange} />
              Enable Public Task Sharing
            </label>
          </div>
          <button className="btn mt-4" onClick={saveWorkspaceSettings}>Save Workspace Settings</button>
        </Section>
      )}

      {/* Notification Settings */}
      <Section id="notifications" title="🔔 Notification Settings" isOpenByDefault={sectionToOpen === "notifications"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100">
          <label className="flex items-center gap-2"><input type="checkbox" /> Task Assigned to Me</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Task Completed</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Mentioned in Comment</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Due Date Reminders</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Project Updates</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Push Notifications</label>
          <label>
            Email Notifications:
            <select className={`${inputClass} mt-1`}>
              <option>Immediate</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </label>
        </div>
      </Section>

      {/* Appearance / Theme */}
      <Section id="appearance" title="🎨 Appearance / Theme" isOpenByDefault={sectionToOpen === "appearance"}>
        <div className="space-y-3 text-gray-800 dark:text-gray-100">
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => setTheme("light")} />
            Light Mode
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} />
            Dark Mode
          </label>
          <input type="color" className="input w-24" disabled />
        </div>
      </Section>

      {/* Preferences */}
      <Section id="preferences" title="🔍 Preferences" isOpenByDefault={sectionToOpen === "preferences"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select className={inputClass}>
            <option>Default Landing: Dashboard</option>
            <option>My Tasks</option>
            <option>Calendar</option>
          </select>
          <select className={inputClass}>
            <option>Sort by: Due Date</option>
            <option>Priority</option>
            <option>Project</option>
          </select>
          <select className={inputClass}>
            <option>Date Format: DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
          </select>
          <select className={inputClass}>
            <option>Default View: List</option>
            <option>Kanban</option>
            <option>Calendar</option>
          </select>
          <select className={inputClass}>
            <option>Language: English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
      </Section>

      {/* Data & Privacy */}
      <Section id="privacy" title="💾 Data & Privacy" isOpenByDefault={sectionToOpen === "privacy"}>
        <div className="space-y-2">
          <button className="btn">Download My Data</button>
          <button className="btn">Manage API Tokens</button>
          <button className="btn">View Activity Log</button>
          <button className="btn-danger">Delete My Account</button>
        </div>
      </Section>

      {/* Beta Features */}
      <Section id="labs" title="🧪 Beta Features / Labs" isOpenByDefault={sectionToOpen === "labs"}>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Enable Experimental Features
        </label>
      </Section>

      {/* Admin Tools */}
      {isAdmin && (
        <Section id="admin" title="🛠️ Admin Tools" isOpenByDefault={sectionToOpen === "admin"}>
          <div className="space-y-2 flex flex-col">
            <button className="btn">User Management</button>
            <button className="btn">Billing & Subscription</button>
            <button className="btn">Archiving Rules</button>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Enforce 2FA
            </label>
          </div>
        </Section>
      )}
    </div>
  );
};

export default Settings;
