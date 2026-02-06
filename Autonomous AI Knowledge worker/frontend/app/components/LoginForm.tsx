"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side validation
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      setLoading(false);
      usernameRef.current?.focus();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Login success:", data);

      // Persist username if requested
      try {
        if (rememberMe) localStorage.setItem("ak_user", username);
        else localStorage.removeItem("ak_user");
      } catch (e) {
        /* ignore localStorage errors */
      }

      onLoginSuccess();
    } catch (err) {
      setError("Invalid username or password ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ak_user");
      if (saved) {
        setUsername(saved);
        setRememberMe(true);
      }
    } catch (e) {
      /* ignore */
    }
    usernameRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-white/70 mb-6">
          Login to your AI Knowledge Dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4" aria-describedby={error ? "login-error" : undefined}>
          <div>
            <label className="block text-white mb-1" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              aria-required="true"
              aria-invalid={error ? true : false}
            />
          </div>

          <div>
            <label className="block text-white mb-1" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                required
                aria-required="true"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 p-1 rounded"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path d="M3 3l18 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.58 10.58A3 3 0 0113.42 13.42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path d="M1.05 12a11 11 0 0121.9 0 11 11 0 01-21.9 0z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-red-300 text-center text-sm">
              {error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <div className="flex items-center justify-between mt-2">
            <label className="inline-flex items-center text-white/85 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 rounded bg-white/10 border-white/20"
              />
              Remember me
            </label>

            <a href="#" className="text-sm text-white/70 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="text-center mt-6 text-white/70 text-sm">
          <p>🚀 Autonomous AI Knowledge Worker</p>
        </div>
      </motion.div>
    </div>
  );
}
