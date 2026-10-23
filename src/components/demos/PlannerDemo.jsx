import { useState } from "react";
import { demoInput, demoLabel } from "./demoStyles";

const STORAGE_KEY = "andy-portfolio-tasks";

const loadTasks = () => {
  try {
    const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue.filter((task) => task && typeof task.text === "string" && task.text.trim())
      : [];
  } catch {
    return [];
  }
};

export default function PlannerDemo() {
  const [tasks, setTasks] = useState(loadTasks);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [view, setView] = useState("all");

  const saveTasks = (nextTasks) => {
    setTasks(nextTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch {
      // Storage may be unavailable; the demo still works for the current session.
    }
  };

  const addTask = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    saveTasks([
      ...tasks,
      { id: Date.now(), text: text.trim(), priority, done: false },
    ]);
    setText("");
  };

  const toggleTask = (id) =>
    saveTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

  const removeTask = (id) => saveTasks(tasks.filter((task) => task.id !== id));

  const clearCompleted = () => saveTasks(tasks.filter((task) => !task.done));

  const visibleTasks = tasks.filter((task) => {
    if (view === "active") return !task.done;
    if (view === "done") return task.done;
    return true;
  });

  const completedCount = tasks.filter((task) => task.done).length;

  const priorityTone = (value) =>
    value === "High"
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : value === "Medium"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-sky-500/10 text-sky-600 dark:text-sky-400";

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="space-y-2">
        <label htmlFor="planner-task" className={demoLabel}>
          New task
        </label>
        <div className="flex gap-2">
          <input
            id="planner-task"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={demoInput}
            placeholder="Finish coursework review"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary shrink-0 px-4">
            Add
          </button>
        </div>
      </form>

      <div>
        <label htmlFor="planner-priority" className={demoLabel}>
          Priority
        </label>
        <select
          id="planner-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className={demoInput}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          ["all", "All"],
          ["active", "Active"],
          ["done", "Completed"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            aria-pressed={view === key}
            className={`chip transition ${
              view === key
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "hover:border-slate-300 dark:hover:border-white/20"
            }`}
          >
            {label}
          </button>
        ))}
        {tasks.length > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="ml-auto text-xs font-medium text-slate-500 underline transition hover:text-slate-900 dark:hover:text-white"
          >
            Clear completed
          </button>
        )}
      </div>

      {visibleTasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          {tasks.length === 0 ? "No tasks yet. Add one above." : `No ${view} tasks.`}
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-white/10"
            >
              <label className="flex flex-1 items-center gap-3 text-sm text-slate-900 dark:text-slate-100">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 rounded accent-brand-500"
                />
                <span className={task.done ? "text-slate-400 line-through dark:text-slate-500" : ""}>
                  {task.text}
                </span>
              </label>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityTone(task.priority)}`}
              >
                {task.priority}
              </span>
              <button
                type="button"
                onClick={() => removeTask(task.id)}
                aria-label={`Remove ${task.text}`}
                className="icon-button h-8 w-8 border-0 text-slate-400 hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {completedCount} of {tasks.length} task{tasks.length === 1 ? "" : "s"} completed. Saved
          in this browser.
        </p>
      )}
    </div>
  );
}
