import type { Task } from "./taskTypes";

type DashboardProps = {
  tasks: Task[];
  userEmail: string;
};

function formatTaskDate(date: string, time: string) {
  const dateValue = new Date(`${date}T${time}`);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateValue);
}

function Dashboard({ tasks, userEmail }: DashboardProps) {
  return (
    <section className="rounded border border-slate-300 bg-slate-50 p-6">
      <h1 className="mb-4 text-3xl font-semibold">Dashboard</h1>
      <p className="mb-4 text-sm text-slate-600">Signed in as {userEmail}</p>
      <div className="max-w-md rounded border border-slate-300 bg-white p-4">
        <p className="mb-3 font-medium">Tasks</p>
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="rounded border border-slate-200 px-3 py-2">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-600">{formatTaskDate(task.date, task.time)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">No tasks yet.</p>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
