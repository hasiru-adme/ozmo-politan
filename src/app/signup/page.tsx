"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: cred.user.uid, email, name }),
      });

      if (!res.ok) throw new Error("Failed to create account");

      const idToken = await cred.user.getIdToken(true);
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionRes.ok) throw new Error("Failed to create session");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message?.includes("email-already-in-use") ? "This email is already registered" : "Something went wrong");
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
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-sage-dark mt-1">Start your project with us.</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-sage-dark hover:bg-sage-dark/90 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition mt-2"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-sage-dark text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-gold-dark font-medium hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}