// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import HabitList from '../components/HabitItem';
import HabitForm from '../components/HabitForm';

const HabitPage = () => {
  const [habits, setHabits] = useState([]);

  //fetching habits on load
  useEffect(() => {
    fetch("http: //localhost:5000/api/habits")
    .then((Response) => Response.json())
    .then((data) => setHabits(data))
    .catch((error) => console.error("Error fetching Habits:", error));
  }, []);
  
  const addhabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabits]);
  };

  return(
    <div className="p-6">
      <h1 className="test-2x1 font-bold mb-4">My habits</h1>
      <HabitForm onAddHabit={addhabit} />
      <HabitList habits={habits} />
    </div>
  )
}

export default HabitPage; 
