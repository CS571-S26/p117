import Calendar from "./Calendar";
import CreateSection from "./CreateSection";
import type { Task } from "./taskTypes";

type CalendarPageProps = {
  onCreateTask: (title: string, date: string, time: string) => void;
  tasks: Task[];
};

function CalendarPage({ onCreateTask, tasks }: CalendarPageProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <CreateSection onCreateTask={onCreateTask} tasks={tasks} />
      <div className="min-w-0">
        <Calendar tasks={tasks} />
      </div>
    </div>
  );
}

export default CalendarPage;
