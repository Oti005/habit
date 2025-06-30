import React, {useState} from "react";

const HabitForm = ({onAddHabit}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState("daily")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newHabit = {
            title,
            description,
            frequency,
        };

        try {
            const response = await fetch("http://localhost:5000/api/habits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(newHabit),
            });

            const data = await response.json();
            if (response.ok) {
                onAddHabit(data);
                setTitle("");
                setDescription("");
                setFrequency("daily");
            }
            else {
                alert(data.message || "Failed to add habit");
            }
            
        }
        catch (error) {
                console.error("Error adding habit:", error);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded-x1 shadow-md">
            <h2 className="text-1 font-semibold">Add New Habit</h2>

            <input type="text" placeholder="Habit name" value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required/>

            <textarea placeholder="Habit Description(Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            />

            <select value={frequency}
            onChange={(e) => setfrequency(e.target.value)}
            className="w-full p-2 border rounded"
            />

            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custon">Custom</option>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Habit
            </button>
        </form>
    );
}

export default HabitForm;