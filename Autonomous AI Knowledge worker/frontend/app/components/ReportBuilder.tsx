"use client";
import React, { useEffect, useState } from "react";

type NewsItem = { title: string; description?: string; url?: string };
type UploadItem = { id: number; filename: string; filepath: string };

export default function ReportBuilder() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [selectedUploads, setSelectedUploads] = useState<string[]>([]);
  const [stockSymbol, setStockSymbol] = useState("");
  const [building, setBuilding] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("Custom Report");

  // load first page of news for selection
  useEffect(() => {
    fetch("http://127.0.0.1:8000/news?page=1")
      .then((r) => r.json())
      .then((d) => {
        setNews(d.news || []);
      })
      .catch((e) => console.error(e));
    // load uploads
    fetch("http://127.0.0.1:8000/upload/list")
      .then((r) => r.json())
      .then((d) => setUploads(d.uploads || []))
      .catch((e) => console.error(e));
  }, []);

  const toggleNews = (idx: number) => {
    setSelectedNews((s) => (s.includes(idx) ? s.filter(x => x !== idx) : [...s, idx]));
  };
  const toggleUpload = (fname: string) => {
    setSelectedUploads((s) => (s.includes(fname) ? s.filter(x => x !== fname) : [...s, fname]));
  };

  const handleBuild = async () => {
    setBuilding(true);
    setResultUrl(null);

    // collect selected news objects
    const selectedNewsItems = selectedNews.map(i => news[i]).filter(Boolean);

    // try fetch stock details if symbol provided
    let stockData = undefined;
    if (stockSymbol.trim()) {
      try {
        const r = await fetch(`http://127.0.0.1:8000/stock?symbol=${encodeURIComponent(stockSymbol)}`);
        const sd = await r.json();
        if (sd && sd.symbol) stockData = sd;
      } catch (_) {}
    }

    // payload
    const payload = {
      title,
      news: selectedNewsItems,
      stock: stockData || null,
      uploads: selectedUploads,
      notes: "",
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/report/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.url) {
        setResultUrl(data.url);
      } else if (data.filename) {
        setResultUrl(`/reports/${data.filename}`);
      } else {
        alert("Report created but no URL returned.");
      }
    } catch (e) {
      alert("Error building report: " + String(e));
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium">Report Title</span>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 block w-full border px-2 py-1 rounded" />
      </label>

      <div>
        <h4 className="font-semibold mb-2">Select News (first page)</h4>
        <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2 bg-white">
          {news.length === 0 && <p className="text-sm text-gray-500">No news loaded</p>}
          {news.map((n, i) => (
            <label key={i} className="flex items-start gap-2">
              <input type="checkbox" checked={selectedNews.includes(i)} onChange={()=>toggleNews(i)} />
              <div>
                <div className="font-medium text-sm">{n.title}</div>
                <div className="text-xs text-gray-600 line-clamp-2">{n.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Select Uploads</h4>
        <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
          {uploads.length === 0 && <p className="text-sm text-gray-500">No uploads</p>}
          {uploads.map((u) => (
            <label key={u.id} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedUploads.includes(u.filename)} onChange={()=>toggleUpload(u.filename)} />
              <span className="text-sm">{u.filename}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Stock (optional)</h4>
        <input value={stockSymbol} onChange={(e)=>setStockSymbol(e.target.value)} placeholder="e.g. AAPL" className="border px-2 py-1 rounded w-full" />
      </div>

      <div className="flex gap-2">
        <button onClick={handleBuild} disabled={building} className="bg-green-600 text-white px-4 py-2 rounded">
          {building ? "Building..." : "Build Report"}
        </button>
        {resultUrl && (
          <a href={resultUrl} target="_blank" className="bg-blue-500 text-white px-3 py-2 rounded">
            Download Report
          </a>
        )}
      </div>
    </div>
  );
}
