import { useEffect, useState } from "react"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [habits, setHabits] = useState([]); 
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "You miss 100% of the shots you don't take.",
    "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    "Discipline is choosing between what you want now and what you want most.",
    "Little by little, a little becomes a lot.",
    "Habits are the compound interest of self-improvement.",
    "Stay consistent. The results will come.",
    "Don't confuse movement with progress",
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const habitsRes = await fetch("http://localhost:5000/api/habits");
        const habitsData = await habitsRes.json();

        const logsRes = await fetch("http://localhost:5000/api/habits/logs");
        const logsData = await logsRes.json();

        const categoriesRes = await fetch("http://localhost:5000/api/categories");
        const categoriesData = await categoriesRes.json();

        setHabits(habitsData);
        setCategories(categoriesData);

        const completed = logsData.filter(log => log.is_completed).length;
        setCompletedCount(completed);

        const active = habitsData.filter(habit => habit.is_active).length;
        setActiveCount(active);

        const countsByDay = {
          Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
        };

        logsData.forEach((log) => {
          if (log.is_completed && log.date_completed) {
            const day = new Date(log.date_completed).getDay();
            const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dayStr = dayMap[day];
            countsByDay[dayStr] += 1;
          }
        });

        const weeklyDataReal = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
          day,
          count: countsByDay[day],
        }));

        setWeeklyData(weeklyDataReal);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="dashboard-bg-shape one"></div>

      <div className="dashboard-wrapper">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="dashboard-card">
          <h3>Active Habits</h3>
          <p>{activeCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="dashboard-card">
          <h3>Completed Logs</h3>
          <p>{completedCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="dashboard-card">
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </motion.div>
      </div>

      <div className="dashboard-wrapper">
        {habits.map((habit) => (
          <motion.div key={habit.id} className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h3>{habit.title}</h3>
            <p>{habit.description}</p>
            <p style={{ fontSize: "0.875rem" }}>Frequency: {habit.frequency}</p>
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
              <Line type="monotone" dataKey="count" stroke="#4cc9f0" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10 text-center text-indigo-200 text-lg italic">
        "{quotes[quoteIndex]}"
      </div>

      <div className="mt-6 text-sm text-indigo-100 text-center">
        <p>Tip: Stay consistent . Even one small habit a day builds momentum.</p>
      </div>
    </div>
  );
};

export default Dashboard;
