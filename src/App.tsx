import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import About from "./About";
import CalendarPage from "./CalendarPage";
import CustomNavbar from "./CustomNavbar";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import LandingPage from "./landingPage";
import Login from "./Login";
import type { Task } from "./taskTypes";

type ProtectedRouteProps = {
  loggedIn: boolean;
  children: ReactNode;
};

type SessionUser = {
  email: string;
};

const sessionStorageKey = "calendar-app-user";
const tasksStorageKey = "calendar-app-tasks";

const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Finish project outline",
    date: "2026-04-23",
    time: "09:00",
  },
  {
    id: "task-2",
    title: "Email group members",
    date: "2026-04-24",
    time: "11:30",
  },
  {
    id: "task-3",
    title: "Review calendar layout",
    date: "2026-04-25",
    time: "15:00",
  },
];

function ProtectedRoute({ loggedIn, children }: ProtectedRouteProps) {
  if (!loggedIn) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}

function App() {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const savedUser = window.localStorage.getItem(sessionStorageKey);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as SessionUser;
    } catch {
      return null;
    }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = window.localStorage.getItem(tasksStorageKey);

    if (!savedTasks) {
      return defaultTasks;
    }

    try {
      return JSON.parse(savedTasks) as Task[];
    } catch {
      return defaultTasks;
    }
  });
  const navigate = useNavigate();
  const loggedIn = user !== null;

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(sessionStorageKey, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(sessionStorageKey);
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
  }, [tasks]);

  function handleLogin(email: string) {
    setUser({ email });
    navigate("/dashboard", { replace: true });
  }

  function handleLogout() {
    setUser(null);
    navigate("/", { replace: true });
  }

  function handleCreateTask(title: string, date: string, time: string) {
    const nextTask: Task = {
      id: crypto.randomUUID(),
      title,
      date,
      time,
    };

    setTasks((currentTasks) => [...currentTasks, nextTask]);
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] text-slate-900">
      <CustomNavbar loggedIn={loggedIn} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={loggedIn ? <Navigate replace to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Dashboard tasks={tasks} userEmail={user?.email ?? ""} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <CalendarPage onCreateTask={handleCreateTask} tasks={tasks} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
