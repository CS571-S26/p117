import { useState } from "react";
import type { Task } from "./taskTypes";

type CreateSectionProps = {
  onCreateTask: (title: string, date: string, time: string) => void;
  tasks: Task[];
};

function formatTaskTime(date: string, time: string) {
  const dateValue = new Date(`${date}T${time}`);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateValue);
}

function CreateSection({ onCreateTask, tasks }: CreateSectionProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const upcomingTasks = [...tasks]
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 4);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Enter a task title.");
      setMessage("");
      return;
    }

    if (!date) {
      setError("Choose a date.");
      setMessage("");
      return;
    }

    if (!time) {
      setError("Choose a time.");
      setMessage("");
      return;
    }

    onCreateTask(trimmedTitle, date, time);
    setTitle("");
    setDate("");
    setTime("");
    setError("");
    setMessage("Task created.");
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-2xl text-white">
            +
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create</h2>
            <p className="text-sm text-slate-500">Add a task to your calendar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Time
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Upcoming
        </h3>

        {upcomingTasks.length > 0 ? (
          <ul className="space-y-2">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">{formatTaskTime(task.date, task.time)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No tasks yet.</p>
        )}
      </section>
    </aside>
  );
}

export default CreateSection;
