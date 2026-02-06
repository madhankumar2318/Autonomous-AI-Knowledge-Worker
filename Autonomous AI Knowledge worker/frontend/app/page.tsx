"use client";
import { useState } from "react";
import NewsSection from "./components/NewsSection";
import SearchSection from "./components/SearchSection";
import StockSection from "./components/StockSection";
import ReportSection from "./components/ReportSection";
import FileUpload from "./components/FileUpload";
import LoginForm from "./components/LoginForm";
import HistorySection from "./components/HistorySection";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 Login Protection
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="void-panel p-8 w-96 animate-fade-in">
          <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
        </div>
      </div>
    );
  }

  // Scroll to Top for News Section
  const scrollToTop = () => {
    const newsDiv = document.getElementById("news-scroll");
    if (newsDiv) newsDiv.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🌌 Fixed Top Bar - Floating in Space */}
      <header className="sticky top-0 z-50 void-panel mx-4 mt-4 mb-0 animate-fade-in">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl flex items-center gap-3">
            <span className="text-accent text-3xl">🧠</span>
            <span className="glow-text">AUTONOMOUS AI</span>
          </h1>
          <div className="flex items-center space-x-4">
            <HistorySection compact={true} limit={5} />
            <button
              onClick={() => setIsLoggedIn(false)}
              className="btn-void"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* 🔸 Main Layout - Floating Modules */}
      <main className="flex flex-1 p-6 gap-6 overflow-hidden max-w-[1320px] mx-auto w-full">
        {/* 📰 Left Side - News Terminal */}
        <section className="w-2/3 flex flex-col void-panel p-6 animate-fade-in">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="text-accent">📡</span>
            LATEST TRANSMISSIONS
          </h2>

          <div
            id="news-scroll"
            className="flex-1 overflow-y-auto pr-2"
          >
            <NewsSection infiniteScroll={true} />
          </div>

          {/* Scroll to Top - Floating Button */}
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 void-card p-3 rounded-full glow-accent icon-glow"
            title="Back to Top"
          >
            <ArrowUp size={20} className="text-accent" />
          </button>
        </section>

        {/* 🔍 Right Side - Control Panels */}
        <aside className="w-1/3 flex flex-col space-y-6">
          {/* Google Search Module */}
          <div className="flex-1 void-panel p-6 overflow-y-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <span className="text-accent">🔍</span>
              SEARCH PROTOCOL
            </h2>
            <SearchSection infiniteScroll={true} />
          </div>

          {/* Grid of Control Modules */}
          <div className="grid grid-rows-3 gap-6 flex-1">
            <div className="void-card hover:glow-accent animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <span className="text-accent">📈</span>
                MARKET DATA
              </h3>
              <StockSection />
            </div>

            <div className="void-card hover:glow-accent animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <span className="text-accent">📑</span>
                REPORTS
              </h3>
              <ReportSection />
            </div>

            <div className="void-card hover:glow-accent overflow-y-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <span className="text-accent">📂</span>
                FILE SYSTEM
              </h3>
              <FileUpload />
            </div>
          </div>
        </aside>
      </main>

      {/* Footer - Minimal Signature */}
      <footer className="text-center py-4 text-sm text-muted">
        <p className="telemetry">
          © {new Date().getFullYear()} — AUTONOMOUS AI WORKER v1.0
        </p>
      </footer>
    </div>
  );
}
