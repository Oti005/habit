import React, { useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";

const HabitItem = ({ habit }) => {
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/habits/${habit.id}/logs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setLogs(data);
    setShowLogs(true);
  };

  if (!habit || typeof habit !== "object" || !habit.name) {
    return (
      <div className="p-4 border rounded-lg shadow-sm text-red-500">
        Invalid habit data.
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
          <p className="text-sm text-gray-500">{habit.description}</p>
          <p className="text-xs text-blue-600">
            Frequency: {habit.frequency}
          </p>
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

      <button
        onClick={fetchLogs}
        className="mt-2 text-blue-600 hover:text-blue-800"
      >
        View Logs
      </button>
      {showLogs && (
        <div className="mt-2">
          <h4 className="text-md font-semibold">Logs:</h4>
          <ul className="list-disc list-inside">
            {logs.map((log) => (
              <li key={log.id}>
                {log.log_date}:{" "}
                {log.is_completed ? "Completed" : "Not completed"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HabitItem;