"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithMrn } from "@/lib/patient-auth";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";

export function LoginForm() {
  const router = useRouter();
  const [mrn, setMrn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!mrn.trim() || !password) {
      setError("Enter your MRN and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithMrn(mrn.trim(), password);
      router.push("/portal/reports");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(message.replace("Invalid login credentials", "Invalid MRN or password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Image src="/logo.png" alt="WASFA" width={72} height={72} className="mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-pink-900">Patient Portal</h1>
          <p className="mt-2 text-sm text-pink-600">
            Use the MRN printed on your receipt as your Login ID
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-pink-100 bg-white/80 p-8 shadow-xl shadow-pink-200/30 backdrop-blur-sm"
        >
          <h2 className="text-lg font-bold text-pink-900">Sign in</h2>
          <p className="mt-1 text-sm text-pink-600">
            Access your diagnostic reports securely
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="mrn" className="mb-1.5 block text-sm font-medium text-pink-800">
                Login ID (MRN)
              </label>
              <input
                id="mrn"
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value.toUpperCase())}
                placeholder="Enter your MRN"
                className="w-full rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 placeholder:text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-pink-800">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3 pr-12 text-pink-900 placeholder:text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <MagneticButton
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </MagneticButton>

          <p className="mt-6 text-center text-xs text-pink-500">
            Contact WASFA Diagnostic Center if you need help with your login.
          </p>
        </form>
      </div>
    </FadeIn>
  );
}
