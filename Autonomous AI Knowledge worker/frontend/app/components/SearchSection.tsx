"use client";
import { useState } from "react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}
export default function SearchSection({ infiniteScroll = false }: { infiniteScroll?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearch = async (q: string, pageNum: number) => {
    if (!q) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(q)}&page=${pageNum}`);
      const data = await res.json();

      // Check for API errors
      if (data.error) {
        setError(data.message || "Search failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.results) {
        setResults((prev) => [...prev, ...data.results]);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to connect to search service. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }
    setResults([]);
    setPage(1);
    setError("");
    setHasSearched(true);
    fetchSearch(query, 1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!infiniteScroll) return;
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
      e.currentTarget.clientHeight + 50;
    if (bottom) {
      setPage((p) => {
        const next = p + 1;
        fetchSearch(query, next);
        return next;
      });
    }
  };

  return (
    <div className="space-y-2 h-full flex flex-col" onScroll={handleScroll}>
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search Google..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />
        <button
          type="submit"
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Searching...
        </div>
      )}

      {/* Empty State - Only show after search has been performed */}
      {!loading && results.length === 0 && !error && hasSearched && (
        <div className="text-center py-8 text-gray-500">
          <p>No results found for "{query}"</p>
          <p className="text-xs mt-1">Try different keywords</p>
        </div>
      )}

      {/* Results */}
      <div className="overflow-y-auto space-y-3 flex-1">
        {results.map((r, i) => (
          <div key={i} className="border rounded p-2 bg-white shadow hover:shadow-md transition">
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
              {r.title}
            </a>
            <p className="text-sm text-gray-700 mt-1">{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
