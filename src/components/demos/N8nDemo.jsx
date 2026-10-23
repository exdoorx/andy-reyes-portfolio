import { useRef, useState } from "react";
import { demoGhost, demoLabel } from "./demoStyles";

// Sample automation: a webhook triage flow in the shape of an n8n workflow.
// The demo only simulates execution in the browser; a live version of this
// shape would run in an n8n instance.
const NODES = [
  { id: "trigger", name: "Webhook", sub: "New submission", x: 50, y: 8, icon: "⚡" },
  { id: "validate", name: "Validate", sub: "Required fields", x: 50, y: 27, icon: "✓" },
  { id: "agent", name: "AI triage", sub: "OpenCode agent", x: 50, y: 46, icon: "✦" },
  { id: "router", name: "IF", sub: "Priority branch", x: 50, y: 65, icon: "◆" },
  { id: "urgent", name: "Urgent ticket", sub: "POST /tickets", x: 24, y: 86, icon: "🚨" },
  { id: "save", name: "Save to DB", sub: "contact_messages", x: 76, y: 86, icon: "🗄️" },
];

const EDGES = [
  { id: "trigger-validate", from: "trigger", to: "validate" },
  { id: "validate-agent", from: "validate", to: "agent" },
  { id: "agent-router", from: "agent", to: "router" },
  { id: "router-urgent", from: "router", to: "urgent", label: "Priority" },
  { id: "router-save", from: "router", to: "save", label: "Normal" },
];

const NODE_LABELS = {
  trigger: "Webhook",
  validate: "Validate",
  agent: "AI triage",
  router: "IF",
  urgent: "Urgent ticket",
  save: "Save to DB",
};

const PAYLOADS = {
  high: {
    message: "Production dashboard is returning 500 errors for every refresh.",
    priority: "high",
  },
  normal: {
    message: "Hi, could I get help connecting a database to my account?",
    priority: "normal",
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nodeTone = (status) => {
  switch (status) {
    case "running":
      return "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-400/60 dark:bg-amber-400/10 dark:text-amber-200";
    case "success":
      return "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-400/50 dark:bg-emerald-400/10 dark:text-emerald-300";
    case "skipped":
      return "border-dashed border-slate-300 bg-transparent text-slate-400 dark:border-white/20 dark:text-slate-500";
    default:
      return "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200";
  }
};

const buildPlan = (priority) =>
  priority === "high"
    ? [
        { id: "trigger", edge: null, text: "Webhook received 1 item" },
        {
          id: "validate",
          edge: "trigger-validate",
          text: "Name, email, message present — payload valid",
        },
        {
          id: "agent",
          edge: "validate-agent",
          text: "OpenCode agent classified the request as an incident (priority: high)",
        },
        { id: "router", edge: "agent-router", text: "Route: HIGH → urgent path" },
        {
          id: "urgent",
          edge: "router-urgent",
          text: "Urgent ticket opened for the on-call developer",
        },
      ]
    : [
        { id: "trigger", edge: null, text: "Webhook received 1 item" },
        {
          id: "validate",
          edge: "trigger-validate",
          text: "Name, email, message present — payload valid",
        },
        {
          id: "agent",
          edge: "validate-agent",
          text: "OpenCode agent classified the request as a question (priority: normal)",
        },
        { id: "router", edge: "agent-router", text: "Route: NORMAL → database path" },
        {
          id: "save",
          edge: "router-save",
          text: "1 row inserted into contact_messages",
        },
      ];

export default function N8nDemo() {
  const [priority, setPriority] = useState("high");
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [flowEdge, setFlowEdge] = useState(null);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const plan = buildPlan(priority);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setStatuses({});
    setLogs([]);
    setSummary(null);

    const stepDelay = reducedMotion.current ? 40 : 620;
    const appended = [];
    const pushLog = (text) => {
      appended.push(text);
      setLogs([...appended]);
    };

    for (const step of plan) {
      if (step.edge) {
        setFlowEdge(step.edge);
        await sleep(stepDelay / 2);
      }
      setStatuses((prev) => ({ ...prev, [step.id]: "running" }));
      pushLog(step.text);
      await sleep(stepDelay);
      setStatuses((prev) => ({ ...prev, [step.id]: "success" }));
      setFlowEdge(null);
    }

    const skippedId = priority === "high" ? "save" : "urgent";
    setStatuses((prev) => ({ ...prev, [skippedId]: "skipped" }));
    pushLog(`${NODE_LABELS[skippedId]} skipped — no data on this branch`);

    setSummary(
      priority === "high"
        ? "Execution succeeded — urgent branch completed."
        : "Execution succeeded — normal branch completed.",
    );
    setRunning(false);
  };

  const reset = () => {
    setStatuses({});
    setFlowEdge(null);
    setLogs([]);
    setSummary(null);
  };

  const edgeColor = (edge) => {
    if (flowEdge === edge.id) return "#6366f1";
    const status = statuses[edge.to];
    if (status === "success" || status === "skipped") return "#94a3b8";
    return "currentColor";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        A sample webhook triage workflow in the shape of an n8n automation, with an
        OpenCode AI agent step. Pick a mock payload, run the execution, and watch the
        nodes light up along the branch.
      </p>

      <div>
        <span id="n8n-payload-label" className={demoLabel}>
          Mock payload
        </span>
        <div
          role="group"
          aria-labelledby="n8n-payload-label"
          className="flex flex-wrap gap-2"
        >
          {[
            ["high", "Urgent incident"],
            ["normal", "General question"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              disabled={running}
              aria-pressed={priority === key}
              onClick={() => {
                setPriority(key);
                reset();
              }}
              className={`chip transition disabled:cursor-not-allowed disabled:opacity-50 ${
                priority === key
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 leading-relaxed text-slate-300">
          <code className="font-mono text-[11px]">
            {JSON.stringify(PAYLOADS[priority], null, 2)}
          </code>
        </pre>
      </div>

      <div
        role="img"
        aria-label="Workflow diagram: a webhook trigger feeds a validate step, which feeds an OpenCode AI agent triage node, which routes to an urgent ticket branch or a database save branch."
        className="relative h-[330px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a1122] sm:h-[350px]"
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-slate-300 dark:text-slate-600"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {EDGES.map((edge) => {
            const from = NODES.find((node) => node.id === edge.from);
            const to = NODES.find((node) => node.id === edge.to);
            const d = `M${from.x},${from.y + 4.5} C${from.x},${(from.y + to.y) / 2} ${to.x},${(from.y + to.y) / 2} ${to.x},${to.y - 4.5}`;
            return (
              <path
                key={edge.id}
                d={d}
                fill="none"
                stroke={edgeColor(edge)}
                strokeWidth={flowEdge === edge.id ? 2 : 1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        <span
          aria-hidden="true"
          style={{ left: "34%", top: "75%" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
        >
          Priority
        </span>
        <span
          aria-hidden="true"
          style={{ left: "66%", top: "75%" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
        >
          Normal
        </span>

        {NODES.map((node) => {
          const status = statuses[node.id] ?? "idle";
          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
              className={`absolute flex items-center gap-2 whitespace-nowrap rounded-xl border px-2.5 py-1.5 shadow-sm transition-colors duration-200 ${nodeTone(status)}`}
            >
              <span
                aria-hidden="true"
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] dark:bg-white/10"
              >
                {node.icon}
              </span>
              <span>
                <span className="block text-[11px] font-semibold leading-none">
                  {node.name}
                </span>
                <span className="mt-0.5 block text-[9px] leading-none opacity-70">
                  {node.sub}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-300 dark:border-white/10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
          Execution log
        </p>
        {logs.length === 0 ? (
          <p className="font-mono text-[11px] text-slate-500">
            Idle — run the workflow to see the trace.
          </p>
        ) : (
          <ol className="space-y-1 font-mono text-[11px] leading-relaxed text-emerald-300/90">
            {logs.map((line, index) => (
              <li key={`${line}-${index}`}>
                <span className="text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                ▸ {line}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className={`${demoGhost} flex-1`}
          aria-busy={running}
        >
          {running ? "Executing…" : "Run workflow"}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={running || logs.length === 0}
          className={demoGhost}
        >
          Reset
        </button>
      </div>

      <div aria-live="polite">
        {summary && (
          <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-sm text-emerald-700 dark:text-emerald-300">
            {summary}
          </p>
        )}
      </div>

      <div className="sr-only">
        <ol>
          {plan.map((step) => (
            <li key={step.id}>{NODE_LABELS[step.id]}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
