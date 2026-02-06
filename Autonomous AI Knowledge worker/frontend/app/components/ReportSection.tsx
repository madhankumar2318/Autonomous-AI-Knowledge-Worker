"use client";
import { useState } from "react";

export default function ReportSection() {
  const [message, setMessage] = useState("");

  const generateReport = async () => {
    const res = await fetch("http://127.0.0.1:8000/report/", {
      method: "POST",
    });
    const data = await res.json();
    setMessage(data.message || "Report generated!");
  };

  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <h2 className="text-lg font-bold mb-2">Report</h2>
      <button
        onClick={generateReport}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Generate Report
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
