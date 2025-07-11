import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Settings, LogOut, ArrowLeft } from "lucide-react";
import API from "../api"; // Axios instance
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", profilePic: "", profilePicFile: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic || "",
          profilePicFile: null,
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePic: reader.result, profilePicFile: files[0] });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.profilePicFile) {
        formDataToSend.append("profilePic", formData.profilePicFile);
      }

      const res = await axios.put("http://localhost:5050/api/auth/profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Update failed");
      console.error("Update error", err);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg p-8">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-6 mb-6">
          <img
            src={formData.profilePic || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
          />
          <div>
            {!editMode ? (
              <>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </>
            ) : null}
            <span className="text-xs inline-block mt-2 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded">
              {user.role}
            </span>
          </div>
        </div>

        {editMode && (
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Upload Profile Pic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 text-sm"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <Settings size={18} />
                Settings
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded transition"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
