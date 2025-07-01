import React from "react";
import {CheckCircle, Trash2} from "lucide-react";

const HabitItem = ({ habit}) => {
    if (!habit || typeof habit !== "object" || !habit.name){
        return (
            <div className="p-4 border rounded-lg shadow-sm text-red-500">
                Invalid habit data.
            </div>
        );
    } 

    return (
        <div className="p-4 border rounded-1g shadow-sm flex items-center justify-between">
            <div>
                <h3 className="text-1g font-semibold text-gray-800">{habit.name}</h3>
                <p className="text-sm text-gray-500">{habit.description}</p>
                <p className="text-xs text-blue-600">Frequency: {habit.frequency}</p>
            </div>

            <div className="flex gap-3 items-center">
                <button className="text-green-600 hover:text-green-800">
                    <CheckCircle />
                </button>
                <button className="text-red-600 hover:text-red-800">
                    <Trash2 />
                </button>
            </div>
        </div>
    );
};

export default HabitItem;