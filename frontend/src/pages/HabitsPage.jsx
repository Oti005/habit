import React, { useEffect, useState } from "react";
import "../styles/habits.css";
import {Link} from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const HabitsPage = () => {
  const token = localStorage.getItem("token");
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  const fetchHabits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (res.ok) setHabits(data);
    } catch (err) {
      console.error("Error fetching habits:", err);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    const newHabit = { title, description, frequency };

    try {
      const res = await fetch("http://localhost:5000/api/habits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHabit),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setHabits((prev) => [...prev, data]);
        setTitle("");
        setDescription("");
        setFrequency([]);
        setShowForm(false);
      } else {
        alert(data.message || "Failed to add habit");
      }
    } catch (err) {
      console.error("Add habit error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== id));
      } else {
        alert("Failed to delete habit");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFrequencyChange = (e) => {
    const { value, checked } = e.target;
    setFrequency((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const filteredHabits = habits
    .filter(
      (habit) =>
        habit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!a[sortKey] || !b[sortKey]) return 0;
      return a[sortKey].toString().localeCompare(b[sortKey].toString());
    });

  const totalPages = Math.ceil(filteredHabits.length / ITEMS_PER_PAGE);
  const paginatedHabits = filteredHabits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="habit-page">
      <div className="habit-container">
        <h1 className="habit-header">My Habits</h1>

        {/* <button className="back-to-dashboard-btn" onClick={() => navigate("/Dashboard")}>Dashboard</button> */}
        <Link to="/Dashboard">Back to Dashboard</Link>

        {/* Top Controls */}
        <div className="habit-toolbar">
          <div className="habit-toolbar-left">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="sort-dropdown"
            >
              <option value="name">Name</option>
              <option value="description">Description</option>
              <option value="frequency">Frequency</option>
            </select>

            <input
              type="text"
              placeholder="Search habits..."
              className="habit-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => setShowForm(true)} className="habit-add-btn">
            Add a Habit
          </button>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-3">Add New Habit</h2>
              <form onSubmit={handleAddHabit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Habit name"
                  className="habit-input"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Habit Description (optional)"
                  className="habit-input"
                />
                <div className="mb-3 flex gap-4">
                  <label>
                    <input
                      type="checkbox"
                      value="daily"
                      onChange={handleFrequencyChange}
                      checked={frequency.includes("daily")}
                    />
                    Daily
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="weekly"
                      onChange={handleFrequencyChange}
                      checked={frequency.includes("weekly")}
                    />
                    Weekly
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="monthly"
                      onChange={handleFrequencyChange}
                      checked={frequency.includes("monthly")}
                    />
                    Monthly
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="habit-submit">
                    Save Habit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table Section */}
        {habits.length > 0 ? (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Frequency</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHabits.map((habit) => (
                    <tr
                      key={habit.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{habit.name}</td>
                      <td className="px-4 py-2">{habit.description || "—"}</td>
                      <td className="px-4 py-2">
                        {Array.isArray(habit.frequency)
                          ? habit.frequency.join(", ")
                          : habit.frequency}
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDelete(habit.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="no-habits">No habits added yet.</p>
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
