import React, { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ tasks: [], projects: [], team: [] });
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center border rounded-lg shadow-sm bg-white px-3 py-2">
        <input
          type="text"
          placeholder="Search tasks, projects, members, status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow outline-none text-sm"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {showResults && (
        <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 max-h-60 overflow-auto w-full">
          <div className="p-3 text-sm text-gray-700">
            <h3 className="font-semibold mb-1">Tasks</h3>
            {results.tasks.length > 0 ? (
              results.tasks.map((task) => (
                <p key={task._id} className="py-1 border-b">{task.title} <span className="text-xs text-gray-500">({task.status})</span></p>
              ))
            ) : (
              <p className="text-gray-400 italic">No tasks found</p>
            )}

            <h3 className="font-semibold mt-4 mb-1">Projects</h3>
            {results.projects.length > 0 ? (
              results.projects.map((project) => (
                <p key={project._id} className="py-1 border-b">{project.name}</p>
              ))
            ) : (
              <p className="text-gray-400 italic">No projects found</p>
            )}

            <h3 className="font-semibold mt-4 mb-1">Team Members</h3>
            {results.team.length > 0 ? (
              results.team.map((member) => (
                <p key={member._id} className="py-1 border-b">{member.name}</p>
              ))
            ) : (
              <p className="text-gray-400 italic">No members found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
