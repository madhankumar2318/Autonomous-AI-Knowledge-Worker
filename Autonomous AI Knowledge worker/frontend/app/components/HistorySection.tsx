"use client";
import { useEffect, useState } from "react";

interface HistoryItem {
  id: number;
  action: string;
  created_at: string;
}

interface Props {
  limit?: number; // show only N items
  compact?: boolean; // compact view for top bar
}

export default function HistorySection({ limit, compact }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch history from backend
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/history/list");
      const data = await res.json();
      if (data.history) {
        let items = data.history as HistoryItem[];
        if (limit) {
          items = items.slice(0, limit);
        }
        setHistory(items);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (compact) {
    // 🔹 Compact top-bar preview
    return (
      <div className="text-sm">
        {history.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className="space-y-1">
            {history.map((item) => (
              <li key={item.id} className="truncate">
                • {item.action}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // 🔹 Full dashboard view
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">📜 Activity History</h2>
      {history.length === 0 ? (
        <p className="text-gray-600">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="p-2 bg-gray-100 rounded shadow text-sm"
            >
              <strong>{item.action}</strong>
              <br />
              <span className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
