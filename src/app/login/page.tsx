"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-sage-light rounded-lg px-3.5 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-light/20 px-4">
      <div className="w-full max-w-sm bg-white border border-sage-light rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <div className="w-9 h-9 rounded-full bg-gold mb-4" />
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-sm text-sage-dark mt-1">Log in to your account.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-sage-dark hover:bg-sage-dark/90 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition mt-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-sage-dark text-center mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-gold-dark font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}