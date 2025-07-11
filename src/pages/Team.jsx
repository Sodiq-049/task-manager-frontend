import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Team = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'Member' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/team");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };
    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    const { name, email, role } = form;
    if (!name.trim() || !email.trim() || !role.trim()) return;

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      setForm({ name: '', email: '', role: 'Member' });
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        👥 Team Management
        </h1>


      {/* Add Member Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
          <option value="Manager">Manager</option>
          <option value="Designer">Designer</option>
        </select>
      </div>

      <button
        onClick={handleAddMember}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
      >
        Add Member
      </button>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search team member by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
      />

      {/* Member List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Team Members</h2>
        {filteredMembers.length === 0 ? (
          <p className="text-gray-500">No matching team members.</p>
        ) : (
          <ul className="divide-y">
            {filteredMembers.map((member) => (
              <li key={member._id} className="py-2 flex justify-between items-center">
                <span className="text-gray-800">{member.name}</span>
                <button
                  onClick={() => handleRemove(member._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>
    </motion.div>
  );
};

export default Team;
