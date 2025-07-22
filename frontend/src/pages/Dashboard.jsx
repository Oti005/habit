import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const quotes = [
    "You miss 100% of the shots you don't take.",
    "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    "Discipline is choosing between what you want now and what you want most.",
    "Little by little, a little becomes a lot.",
    "Habits are the compound interest of self-improvement.",
    "Stay consistent. The results will come.",
    "Don't confuse movement with progress"
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const headers = { Authorization: `Bearer ${token}` };

        const [habitsRes, logsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:5000/api/habits/", { headers }),
          fetch("http://localhost:5000/api/habits/logs", { headers }),
          fetch("http://localhost:5000/api/habits/categories", { headers })
        ]);

        if ([habitsRes, logsRes, categoriesRes].some(res => res.status === 401)) {
          localStorage.removeItem("token");
          // alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        const habitsData = await habitsRes.json();
        const logsData = await logsRes.json();
        const categoriesData = await categoriesRes.json();

        setHabits(habitsData);
        setLogs(logsData);
        setCategories(categoriesData);

        const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const countsByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

        logsData.forEach(log => {
          if (log.is_completed && log.date_completed) {
            const dayStr = dayMap[new Date(log.date_completed).getDay()];
            countsByDay[dayStr] += 1;
          }
        });

        const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
          day,
          count: countsByDay[day]
        }));

        setWeeklyData(weekly);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const completedCount = logs.filter(log => log.is_completed).length;
  const activeCount = habits.filter(h => h.is_active).length;

  return (
    <div>
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <h2 className="dashboard-title">Dashboard</h2>
          <div>
            <button className="dashboard-nav-btn" onClick={() => navigate("/habits")}>My habits</button>
            <button className="dashboard-logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-wrapper">
          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Active Habits</h3>
            <p>{activeCount}</p>
          </motion.div>

          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Completed Logs</h3>
            <p>{completedCount}</p>
          </motion.div>

          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Categories</h3>
            <p>{categories.length}</p>
          </motion.div>
        </div>

        <div className="dashboard-wrapper">
          {habits.map(habit => (
            <motion.div key={habit.id} className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3>{habit.title}</h3>
              <p>{habit.description}</p>
              <p style={{ fontSize: "0.875rem" }}>Frequency: {habit.frequency?.join?.(", ") || habit.frequency}</p>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-wrapper" style={{ marginTop: "2rem" }}>
          <div className="dashboard-card" style={{ width: "100%" }}>
            <h3>Weekly Habit Streak</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#414345" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-10">"{quotes[quoteIndex]}"</div>
        <div className="mt-6">Tip: Stay consistent. Even one small habit a day builds momentum.</div>
      </main>
    </div>
  );
};

export default Dashboard;
