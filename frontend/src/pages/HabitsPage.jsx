// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HabitItem from '../components/HabitItem';
import HabitForm from '../components/HabitForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../styles/habits.css";

const HabitPage = () => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch habits and logs on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log ("Token being sent: ", token);
    if (!token) {
      setError("No token found. Please log in");
      setLoading(false);
      return;
    }


    // Fetch habits
    fetch("http://localhost:5000/api/habits/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errorMessage = `HTTP error! status: ${response.status}`;
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage += errorData.error ? ` - ${errorData.error}` : "";
          } else {
            const errorText = await response.text();
            errorMessage += ` - ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    // Fetch logs for calendar
    fetch("http://localhost:5000/api/habits/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setLogs(data))
      .catch(() => setLogs([]));
  }, []);

  const addhabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  // Get dates with completed logs
  const completedDates = logs
    .filter(log => log.is_completed)
    .map(log => new Date(log.date_completed || log.log_date).toDateString());

  // Highlight completed days on the calendar
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && completedDates.includes(date.toDateString())) {
      return 'calendar-completed';
    }
    return null;
  };

  if (loading) {
    return <p>Loading habits...</p>;
  }

  if (error) {
    if (error === "No token found. Please log in") {
      return (
        <div className="login-prompt">
          <p>You must be logged in to view your habits.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      );
    }
    return <p>Error: {error}</p>;
  }

  return (
    <div className="habit-page">
      <div className="habit-container">
        <h1 className="habit-header">My habits</h1>
        <HabitForm onAddHabit={addhabit} />
        <div className="habit-list">
          {habits.length > 0 ? (
            habits.map((habit) => <HabitItem key={habit.id} habit={habit} />)
          ) : (
            <p className="no-habits">No habits yet. Add one!</p>
          )}
        </div>
        <div className="calendar-section" style={{ margin: "2rem 0" }}>
          <h2>Habit Completion Calendar</h2>
          <Calendar
            value={calendarValue}
            onChange={setCalendarValue}
            tileClassName={tileClassName}
          />
          <style>
            {`
              .calendar-completed {
                background: #a7f3d0 !important;
                border-radius: 50%;
                color: #065f46 !important;
              }
            `}
          </style>
        </div>
        <div className="back-to-dashboard">
          <button onClick={() => navigate("/dashboard")}> Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default HabitPage;
