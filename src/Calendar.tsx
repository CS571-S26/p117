import { useMemo } from "react";
import useCalendar from "./useCalendar";
import type { Task } from "./taskTypes";

type CalendarProps = {
  locale?: string;
  tasks?: Task[];
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Calendar({ locale = navigator.language, tasks = [] }: CalendarProps) {
  const { year, month, weekdays, cells, isToday, startOfMonth, goNext, goPrev, goToday } =
    useCalendar(new Date(), locale);

  const monthFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  }, [locale]);

  const tasksByDate = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((accumulator, task) => {
      if (!accumulator[task.date]) {
        accumulator[task.date] = [];
      }

      accumulator[task.date].push(task);
      accumulator[task.date].sort((leftTask, rightTask) => leftTask.time.localeCompare(rightTask.time));
      return accumulator;
    }, {});
  }, [tasks]);

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={goToday}
            type="button"
          >
            Today
          </button>

          <div className="flex items-center gap-1">
            <button
              aria-label="Previous month"
              className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              onClick={goPrev}
              type="button"
            >
              {"<"}
            </button>
            <button
              aria-label="Next month"
              className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              onClick={goNext}
              type="button"
            >
              {">"}
            </button>
          </div>

          <div className="select-none text-2xl font-normal text-slate-800">
            {monthFormatter.format(new Date(year, month, 1))}
          </div>
        </div>

        <div className="text-sm text-slate-500">Month</div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 bg-white text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {weekdays.map((dayName) => (
          <div key={dayName} className="px-2 py-3 text-left sm:px-3">
            {dayName}
          </div>
        ))}
      </div>

      <div className="relative bg-white">
        <div key={`${startOfMonth.getFullYear()}-${startOfMonth.getMonth()}`} className="grid grid-cols-7">
          {cells.map(({ date, currentMonth }) => {
            const todayCell = isToday(date);
            const dayTasks = tasksByDate[getDateKey(date)] ?? [];
            const visibleTasks = dayTasks.slice(0, 2);
            const overflowCount = dayTasks.length - visibleTasks.length;
            const dayNumberClasses = todayCell
              ? "grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white"
              : currentMonth
                ? "text-slate-700"
                : "text-slate-400";

            return (
              <div
                key={date.toISOString()}
                className={`min-h-[108px] border-b border-r border-slate-200 p-2 align-top sm:min-h-[124px] sm:p-3 ${
                  currentMonth ? "bg-white" : "bg-slate-50"
                }`}
                title={
                  dayTasks.length > 0
                    ? `${date.toDateString()} - ${dayTasks.map((task) => task.title).join(", ")}`
                    : date.toDateString()
                }
              >
                <div className="flex h-full flex-col">
                  <div className="mb-2">
                    <span className={dayNumberClasses}>{date.getDate()}</span>
                  </div>

                  <div className="space-y-1">
                    {visibleTasks.map((task) => (
                      <div
                        key={task.id}
                        className="w-full truncate rounded-md bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-800 sm:text-[11px]"
                      >
                        {task.time} {task.title}
                      </div>
                    ))}

                    {overflowCount > 0 && (
                      <div className="px-1 text-[10px] font-medium text-slate-500 sm:text-[11px]">
                        +{overflowCount} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Calendar;
