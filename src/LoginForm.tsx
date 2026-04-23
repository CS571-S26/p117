import { useState } from "react";

type LoginFormProps = {
  onLogin: (email: string) => void;
};

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    onLogin(trimmedEmail);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm rounded border border-slate-300 bg-white p-4">
      <label className="mb-3 block text-sm">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 block w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="mb-4 block text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 block w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded border border-slate-900 bg-slate-900 px-4 py-2 text-white"
      >
        Log in
      </button>
    </form>
  );
}

export default LoginForm;
