import LoginForm from "./LoginForm";

type LoginProps = {
  onLogin: (email: string) => void;
};

function Login({ onLogin }: LoginProps) {
  return (
    <section className="rounded border border-slate-300 bg-slate-50 p-6">
      <h1 className="mb-4 text-3xl font-semibold">Login</h1>
      <p className="mb-4 text-sm text-slate-600">Enter an email and password to continue.</p>
      <LoginForm onLogin={onLogin} />
    </section>
  );
}

export default Login;
