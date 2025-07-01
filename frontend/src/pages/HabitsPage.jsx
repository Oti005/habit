// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import HabitItem from '../components/HabitItem';
import HabitForm from '../components/HabitForm';


const HabitPage = () => {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  //fetching habits on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){
      console.error("No token found. Please log in");
      return;
    }

    fetch("http://localhost:5000/api/habits", {
      headers: {
        Authorization: 'Bearer ${token}',
      },
    })
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("HTTP error! status: ${Response.status")
      }
      return Response.json()
    })
    .then((data) => setHabits(data))
    .catch((error) => console.error("Error fetching Habits:", error));
  }, []);
  
  const addhabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  return(
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="test-2x1 font-bold mb-4 text-blue-700 text-center">My habits</h1>
        <HabitForm onAddHabit={addhabit} />
        <div className="mt-6 space-y-4">
          {habits.map((habit) =>(
            <HabitItem key={habit.id} habit={habit}/>))}
        </div>
        <div className="mt-8 text-center">
        <button onClick={()=>navigate("/dashboard")}> Dashboard</button>
        </div>
      </div>
    </div>
  )
}

export default HabitPage; 
