import React, { useState } from "react";
import "../styles/habits.css";

const HabitForm = ({ onAddHabit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState([]);

  const handleFrequencyChange = (e) => {
    const { value, checked } = e.target;
    setFrequency((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const newHabit = {
      title,
      description,
      frequency,
    };

    try {
      const response = await fetch("http://localhost:5000/api/habits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHabit),
      });

      const data = await response.json();
      if (response.ok) {
        onAddHabit(data);
        setTitle("");
        setDescription("");
        setFrequency([]);
      } else {
        alert(data.message || "Failed to add habit");
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="habit-form"
    >
      <h2 className="habit-form-title">Add New Habit</h2>

      <input
        type="text"
        placeholder="Habit name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="habit-input"
        required
      />

      <textarea
        placeholder="Habit Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="habit-input"
      />

      <div className="habit-checkbox-group mb-3 flex gap-4">
        <label>
          <input
            type="checkbox"
            value="daily"
            checked={frequency.includes("daily")}
            onChange={handleFrequencyChange}
          />{" "}
          Daily
        </label>
        <label>
          <input
            type="checkbox"
            value="weekly"
            checked={frequency.includes("weekly")}
            onChange={handleFrequencyChange}
          />{" "}
          Weekly
        </label>
        <label>
          <input
            type="checkbox"
            value="monthly"
            checked={frequency.includes("monthly")}
            onChange={handleFrequencyChange}
          />{" "}
          Monthly
        </label>
      </div>

      <div className="habit-form-actions">
        <button type="submit" className="habit-submit-btn">
          Add Habit
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
