"use client";
import { useEffect, useState } from "react";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  summary?: string;
}

export default function NewsSection({ infiniteScroll = false }: { infiniteScroll?: boolean }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (pageNum: number, searchTopic = topic, searchCategory = category, append = false) => {
    setLoading(true);
    let url = `http://127.0.0.1:8000/news?page=${pageNum}`;
    if (searchTopic) url += `&topic=${encodeURIComponent(searchTopic)}`;
    if (searchCategory) url += `&category=${searchCategory}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.news) {
        if (append) {
          setArticles((prev) => [...prev, ...data.news]);
        } else {
          setArticles(data.news);
        }
        setHasMore(data.news.length > 0);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1, topic, category, false);
    // eslint-disable-next-line
  }, [topic, category]);

  // Load more on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!infiniteScroll || loading || !hasMore) return;
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
      e.currentTarget.clientHeight + 50;
    if (bottom) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, topic, category, true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews(1, topic, category, false);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Search news topic..."
          className="border px-2 py-1 rounded w-full"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Search</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" onScroll={handleScroll}>
        {articles.map((article, i) => (
          <div key={i} className="border rounded p-3 shadow bg-white">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-3">{article.description}</p>
            {article.summary && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                📝 {article.summary}
              </p>
            )}
            <a
              href={article.url}
              target="_blank"
              className="text-blue-500 text-xs"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>

      {!infiniteScroll && hasMore && (
        <button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNews(nextPage, topic, category, true);
          }}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

