import React from "react";
import HabitItem from "./HabitItem";

const HabitList = ({ habits}) => {
    return (
        <div className="grid gap-4">
            {habits.length === 0 ? (
                <p className="text-gray-500">No habits yet. Add one!</p>
            ): (
                habits.map((habit) => <HabitItem key={habit.id} habit={habit}/>)
            )}
        </div>
    );
};

export default HabitList;