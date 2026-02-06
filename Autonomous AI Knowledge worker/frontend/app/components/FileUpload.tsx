"use client";
import { useState, useEffect } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploads, setUploads] = useState<any[]>([]);

  // 🔹 Fetch uploaded files
  const fetchUploads = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/upload/list");
      const data = await res.json();
      setUploads(data.uploads || []);
    } catch (err) {
      console.error("Error fetching uploads:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // 🔹 Upload file
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/upload/", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded successfully!");
      setFile(null);
      fetchUploads();
    } else {
      alert("Upload failed!");
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-lg font-bold mb-2">📂 File Upload (CSV / JSON)</h2>

      {/* File Picker */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {/* Uploaded Files List */}
      <h3 className="text-md font-semibold mt-4 mb-2">📑 Uploaded Files</h3>
      <ul className="space-y-2">
        {uploads.map((u) => (
          <li
            key={u.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <p className="font-medium">{u.filename}</p>
              <p className="text-xs text-gray-500">
                {Math.round(u.size / 1024)} KB • {u.uploaded_at}
              </p>
            </div>
            <a
              href={`http://127.0.0.1:8000/uploads/${u.filename}`}
              download
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
