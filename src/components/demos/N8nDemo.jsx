import { useRef, useState } from "react";
import { demoGhost, demoLabel } from "./demoStyles";

// Three sample automations in the shape of n8n workflows. The demo only
// simulates execution in the browser; a live version of these flows would
// run in an n8n instance.
const TEMPLATES = [
  {
    id: "triage",
    label: "Support triage",
    ariaLabel:
      "Support triage diagram: a webhook trigger feeds a validate step, which feeds an OpenCode AI agent triage node, which routes to an urgent ticket branch or a database save branch.",
    nodes: [
      { id: "trigger", name: "Webhook", sub: "New submission", x: 50, y: 8, icon: "⚡" },
      { id: "validate", name: "Validate", sub: "Required fields", x: 50, y: 27, icon: "✓" },
      { id: "agent", name: "AI triage", sub: "OpenCode agent", x: 50, y: 46, icon: "✦" },
      { id: "router", name: "IF", sub: "Priority branch", x: 50, y: 65, icon: "◆" },
      { id: "urgent", name: "Urgent ticket", sub: "POST /tickets", x: 24, y: 86, icon: "🚨" },
      { id: "save", name: "Save to DB", sub: "contact_messages", x: 76, y: 86, icon: "🗄️" },
    ],
    edges: [
      { id: "trigger-validate", from: "trigger", to: "validate" },
      { id: "validate-agent", from: "validate", to: "agent" },
      { id: "agent-router", from: "agent", to: "router" },
      { id: "router-urgent", from: "router", to: "urgent", label: "Priority" },
      { id: "router-save", from: "router", to: "save", label: "Normal" },
    ],
    options: [
      {
        key: "high",
        label: "Urgent incident",
        payload: {
          message: "Production dashboard is returning 500 errors for every refresh.",
          priority: "high",
        },
        steps: [
          { id: "trigger", text: "Webhook received 1 item" },
          { id: "validate", text: "Name, email, message present — payload valid" },
          {
            id: "agent",
            text: "OpenCode agent classified the request as an incident (priority: high)",
          },
          { id: "router", text: "Route: HIGH → urgent path" },
          { id: "urgent", text: "Urgent ticket opened for the on-call developer" },
        ],
        summary: "Execution succeeded — urgent branch completed.",
        skipped: { id: "save", text: "Save to DB skipped — no data on this branch" },
      },
      {
        key: "normal",
        label: "General question",
        payload: {
          message: "Hi, could I get help connecting a database to my account?",
          priority: "normal",
        },
        steps: [
          { id: "trigger", text: "Webhook received 1 item" },
          { id: "validate", text: "Name, email, message present — payload valid" },
          {
            id: "agent",
            text: "OpenCode agent classified the request as a question (priority: normal)",
          },
          { id: "router", text: "Route: NORMAL → database path" },
          { id: "save", text: "1 row inserted into contact_messages" },
        ],
        summary: "Execution succeeded — normal branch completed.",
        skipped: { id: "urgent", text: "Urgent ticket skipped — no data on this branch" },
      },
    ],
  },
  {
    id: "service",
    label: "Customer service",
    ariaLabel:
      "Customer service diagram: an email trigger feeds a CRM history lookup, which feeds an OpenCode AI reply-drafting node, which routes to a human escalation branch or an auto-reply branch.",
    nodes: [
      { id: "trigger", name: "Email", sub: "New customer email", x: 50, y: 8, icon: "✉️" },
      { id: "fetch", name: "CRM lookup", sub: "Conversation history", x: 50, y: 27, icon: "🔍" },
      { id: "agent", name: "AI reply draft", sub: "OpenCode agent", x: 50, y: 46, icon: "✦" },
      { id: "router", name: "IF", sub: "Sentiment check", x: 50, y: 65, icon: "◆" },
      { id: "escalate", name: "Escalate", sub: "Assign to human", x: 24, y: 86, icon: "🙋" },
      { id: "reply", name: "Auto-reply", sub: "SMTP template", x: 76, y: 86, icon: "📤" },
    ],
    edges: [
      { id: "trigger-fetch", from: "trigger", to: "fetch" },
      { id: "fetch-agent", from: "fetch", to: "agent" },
      { id: "agent-router", from: "agent", to: "router" },
      { id: "router-escalate", from: "router", to: "escalate", label: "Negative" },
      { id: "router-reply", from: "router", to: "reply", label: "Routine" },
    ],
    options: [
      {
        key: "negative",
        label: "Angry customer",
        payload: {
          channel: "email",
          topic: "refund request",
          sentiment: "negative",
        },
        steps: [
          { id: "trigger", text: "Email received — subject: refund request" },
          { id: "fetch", text: "CRM lookup found 3 open conversations for this customer" },
          {
            id: "agent",
            text: "OpenCode agent drafted a reply and flagged sentiment: negative",
          },
          { id: "router", text: "Route: NEGATIVE → escalate to a human" },
          { id: "escalate", text: "Ticket assigned to a customer service agent" },
        ],
        summary: "Execution succeeded — escalation branch completed.",
        skipped: { id: "reply", text: "Auto-reply skipped — a human takes this one" },
      },
      {
        key: "routine",
        label: "Routine inquiry",
        payload: {
          channel: "email",
          topic: "delivery status",
          sentiment: "neutral",
        },
        steps: [
          { id: "trigger", text: "Email received — subject: delivery status" },
          { id: "fetch", text: "CRM lookup found order history and a tracking ID" },
          {
            id: "agent",
            text: "OpenCode agent drafted a reply with order status and sentiment: neutral",
          },
          { id: "router", text: "Route: ROUTINE → auto-reply" },
          { id: "reply", text: "Reply sent with tracking link and support docs" },
        ],
        summary: "Execution succeeded — auto-reply branch completed.",
        skipped: { id: "escalate", text: "Escalation skipped — no negative sentiment" },
      },
    ],
  },
  {
    id: "social",
    label: "Social media marketing",
    ariaLabel:
      "Social media marketing diagram: a schedule trigger feeds a content sources node, which feeds an OpenCode AI copywriter node, which routes to a publish-now branch or a calendar queue branch.",
    nodes: [
      { id: "trigger", name: "Schedule", sub: "Weekdays 09:00", x: 50, y: 8, icon: "🗓️" },
      { id: "sources", name: "Get sources", sub: "RSS + drafts", x: 50, y: 27, icon: "📰" },
      { id: "agent", name: "AI copywriter", sub: "OpenCode agent", x: 50, y: 46, icon: "✦" },
      { id: "router", name: "IF", sub: "Engagement check", x: 50, y: 65, icon: "◆" },
      { id: "publish", name: "Publish now", sub: "Social APIs", x: 24, y: 86, icon: "📣" },
      { id: "queue", name: "Queue post", sub: "content_calendar", x: 76, y: 86, icon: "🗃️" },
    ],
    edges: [
      { id: "trigger-sources", from: "trigger", to: "sources" },
      { id: "sources-agent", from: "sources", to: "agent" },
      { id: "agent-router", from: "agent", to: "router" },
      { id: "router-publish", from: "router", to: "publish", label: "Trending" },
      { id: "router-queue", from: "router", to: "queue", label: "Planned" },
    ],
    options: [
      {
        key: "trending",
        label: "Trending topic",
        payload: {
          source: "industry RSS",
          trendScore: 87,
          draft: "5 AI automation tips for small teams",
        },
        steps: [
          { id: "trigger", text: "Schedule fired — 09:00 posting window" },
          { id: "sources", text: "Collected 4 draft ideas and 6 RSS items" },
          {
            id: "agent",
            text: "OpenCode agent drafted today's post from the trending source",
          },
          { id: "router", text: "Route: TRENDING → publish now" },
          { id: "publish", text: "Post published to the connected social channels" },
        ],
        summary: "Execution succeeded — publish branch completed.",
        skipped: { id: "queue", text: "Queue skipped — high engagement window" },
      },
      {
        key: "planned",
        label: "Planned campaign",
        payload: {
          source: "content calendar",
          campaign: "launch week",
          draft: "Behind the scenes of our workflow",
        },
        steps: [
          { id: "trigger", text: "Schedule fired — 09:00 posting window" },
          { id: "sources", text: "Pulled the campaign draft from the calendar" },
          {
            id: "agent",
            text: "OpenCode agent polished the draft and added hashtags",
          },
          { id: "router", text: "Route: PLANNED → queue for the scheduled slot" },
          { id: "queue", text: "Post queued in content_calendar for Friday 09:00" },
        ],
        summary: "Execution succeeded — queue branch completed.",
        skipped: { id: "publish", text: "Publish skipped — campaign slot not active" },
      },
    ],
  },
];

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

export default function N8nDemo() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [optionKey, setOptionKey] = useState(TEMPLATES[0].options[0].key);
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [flowEdge, setFlowEdge] = useState(null);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0];
  const option =
    template.options.find((item) => item.key === optionKey) ?? template.options[0];

  const clearRun = () => {
    setStatuses({});
    setFlowEdge(null);
    setLogs([]);
    setSummary(null);
  };

  const pickTemplate = (nextId) => {
    const next = TEMPLATES.find((item) => item.id === nextId);
    if (!next || next.id === templateId || running) return;
    setTemplateId(next.id);
    setOptionKey(next.options[0].key);
    clearRun();
  };

  const pickOption = (nextKey) => {
    if (nextKey === optionKey) return;
    setOptionKey(nextKey);
    clearRun();
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    clearRun();

    const stepDelay = reducedMotion.current ? 40 : 620;
    const appended = [];
    const pushLog = (text) => {
      appended.push(text);
      setLogs([...appended]);
    };

    for (const step of option.steps) {
      const edge = template.edges.find((item) => item.to === step.id);
      if (edge) {
        setFlowEdge(edge.id);
        await sleep(stepDelay / 2);
      }
      setStatuses((prev) => ({ ...prev, [step.id]: "running" }));
      pushLog(step.text);
      await sleep(stepDelay);
      setStatuses((prev) => ({ ...prev, [step.id]: "success" }));
      setFlowEdge(null);
    }

    setStatuses((prev) => ({ ...prev, [option.skipped.id]: "skipped" }));
    pushLog(option.skipped.text);

    setSummary(option.summary);
    setRunning(false);
  };

  const reset = () => clearRun();

  const edgeColor = (edge) => {
    if (flowEdge === edge.id) return "#6366f1";
    const status = statuses[edge.to];
    if (status === "success" || status === "skipped") return "#94a3b8";
    return "currentColor";
  };

  const triggerEdges = template.edges.filter((edge) => edge.label);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Three sample n8n-style automations — support triage, customer service, and
        social media marketing — each with an OpenCode AI agent step. Pick a workflow,
        choose a mock payload, and run the execution to watch the nodes light up along
        the branch.
      </p>

      <div>
        <span id="n8n-template-label" className={demoLabel}>
          Sample workflow
        </span>
        <div
          role="group"
          aria-labelledby="n8n-template-label"
          className="flex flex-wrap gap-2"
        >
          {TEMPLATES.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={running}
              aria-pressed={templateId === item.id}
              onClick={() => pickTemplate(item.id)}
              className={`chip transition disabled:cursor-not-allowed disabled:opacity-50 ${
                templateId === item.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span id="n8n-payload-label" className={demoLabel}>
          Mock payload
        </span>
        <div
          role="group"
          aria-labelledby="n8n-payload-label"
          className="flex flex-wrap gap-2"
        >
          {template.options.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={running}
              aria-pressed={optionKey === item.key}
              onClick={() => pickOption(item.key)}
              className={`chip transition disabled:cursor-not-allowed disabled:opacity-50 ${
                optionKey === item.key
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 leading-relaxed text-slate-300">
          <code className="font-mono text-[11px]">
            {JSON.stringify(option.payload, null, 2)}
          </code>
        </pre>
      </div>

      <div
        role="img"
        aria-label={template.ariaLabel}
        className="relative h-[330px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a1122] sm:h-[350px]"
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-slate-300 dark:text-slate-600"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {template.edges.map((edge) => {
            const from = template.nodes.find((node) => node.id === edge.from);
            const to = template.nodes.find((node) => node.id === edge.to);
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

        {triggerEdges.map((edge) => {
          const from = template.nodes.find((node) => node.id === edge.from);
          const to = template.nodes.find((node) => node.id === edge.to);
          return (
            <span
              key={edge.label}
              aria-hidden="true"
              style={{
                left: `${(from.x + to.x) / 2}%`,
                top: `${(from.y + to.y) / 2}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            >
              {edge.label}
            </span>
          );
        })}

        {template.nodes.map((node) => {
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
          {option.steps.map((step) => {
            const node = template.nodes.find((item) => item.id === step.id);
            return <li key={step.id}>{node?.name ?? step.id}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}
