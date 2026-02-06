"use client";
import { useEffect, useState } from "react";

export default function StockSection() {
  const [stock, setStock] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stock?symbol=AAPL")
      .then((res) => res.json())
      .then((data) => setStock(data))
      .catch((err) => {
        console.error("Stock fetch error:", err);
        setStock({ error: err.message });
      });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <h2 className="text-lg font-bold mb-2">Stock Market</h2>
      {stock ? (
        <div>
          <p>
            {stock.symbol}: ${stock.price}
          </p>
          <p>{stock.change_percent}</p>
        </div>
      ) : (
        <p>Loading stock...</p>
      )}
    </div>
  );
}
