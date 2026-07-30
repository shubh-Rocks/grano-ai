"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const styles = {
  page: "min-h-screen bg-[#f7f7f4] text-[#26251e] flex items-center justify-center px-4 py-12",
  card: "w-full max-w-2xl bg-white border border-[#e6e5e0] rounded-[12px] p-8 sm:p-10",
  label: "block text-sm font-semibold uppercase tracking-[0.12em] text-[#5a5852] mb-2",
  input: "w-full rounded-[8px] border border-[#e6e5e0] bg-[#fafaf7] px-4 py-3 text-[#26251e] placeholder:text-[#a09c92] outline-none transition focus:border-[#f54e00] focus:ring-2 focus:ring-[#f54e0050]",
  button: "w-full rounded-[8px] bg-[#f54e00] px-4 py-3 text-white font-semibold transition hover:bg-[#d04200] focus:outline-none focus:ring-2 focus:ring-[#f54e0050]",
  link: "text-[#f54e00] hover:text-[#d04200] font-semibold",
  error: "rounded-[8px] border border-[#cf2d56] bg-[#ffe7ea] px-4 py-3 text-[#8a2230] mb-4",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ loading: false, message: "Passwords do not match.", type: "error" });
      return;
    }

    setStatus({ loading: true, message: "", type: "" });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword, phone }),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus({ loading: false, message: result.error || result.details || "Registration failed.", type: "error" });
      return;
    }

    setStatus({ loading: false, message: "Account created successfully. Redirecting to login…", type: "success" });
    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#807d72]">Cursor</p>
            <h1 className="text-3xl font-[400] leading-tight text-[#26251e]">Create your account</h1>
          </div>
          <p className="text-sm text-[#5a5852] max-w-2xl">
            Build your account with a warm cream interface, a minimal card, and a single orange action. Enter your details to join.
          </p>
        </div>

        {status.message && (
          <div className={status.type === "error" ? styles.error : "rounded-[8px] border border-[#1f8a65] bg-[#eaf8f1] px-4 py-3 text-[#1f8a65] mb-4"}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={styles.input}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={styles.input}
                placeholder="Create a password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={styles.input}
                placeholder="Repeat your password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className={styles.label}>
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={styles.input}
              placeholder="Optional phone number"
            />
          </div>

          <button type="submit" disabled={status.loading} className={styles.button}>
            {status.loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5a5852]">
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
