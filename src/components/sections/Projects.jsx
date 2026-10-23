import { lazy, Suspense, useState } from "react";
import { projects } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import Modal from "../ui/Modal";
import { ArrowRight, Check } from "../ui/Icons";

const DemoDialog = lazy(() => import("../demos/DemoDialog"));

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [activeDemo, setActiveDemo] = useState(null);

  const types = ["All", ...new Set(projects.map((project) => project.type))];
  const shown = projects.filter((project) => filter === "All" || project.type === filter);

  const workingTool = (project) => project.status === "Working tool";

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionTitle
        id="projects-title"
        eyebrow="Projects"
        title="Things I've built to learn and solve"
        description="Each project below is a purpose-built demo that runs in this page. Use “Open demo” to interact with it, and “Details” for the problem, role, and technical notes."
      />

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            aria-pressed={filter === type}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === type
                ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, index) => (
          <Reveal key={project.id} delay={(index % 3) * 70}>
            <article className="surface surface-hover flex h-full flex-col overflow-hidden">
              <div
                className="p-5"
                style={{ backgroundColor: `${project.accent}14` }}
                aria-hidden="true"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{project.emoji}</span>
                  <span className="chip border-transparent text-[11px]" style={{ color: project.accent }}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-slate-950 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {project.summary}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 3).map((item) => (
                    <li key={item} className="chip text-[11px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setActiveDemo(project)}
                    className="btn btn-primary px-4 py-2 text-xs"
                  >
                    Open demo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetail(project)}
                    className="btn btn-ghost px-3 py-2 text-xs"
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="space-y-6">
            <div className="surface flex flex-wrap items-center gap-3 p-4 text-sm">
              <span className="chip border-transparent" style={{ color: detail.accent }}>
                {detail.status}
              </span>
              <span className="chip">{detail.type}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {workingTool(detail) ? "Feels like a real utility." : "Front-end prototype."}
              </span>
            </div>

            <dl className="space-y-5 text-sm">
              <div>
                <dt className="eyebrow">Problem</dt>
                <dd className="mt-2 text-slate-700 dark:text-slate-300">{detail.problem}</dd>
              </div>
              <div>
                <dt className="eyebrow">My contribution</dt>
                <dd className="mt-2 text-slate-700 dark:text-slate-300">{detail.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">Key functionality</dt>
                <dd className="mt-2">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {detail.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Technical notes</dt>
                <dd className="mt-2 text-slate-700 dark:text-slate-300">{detail.technical}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  setActiveDemo(detail);
                }}
                className="btn btn-primary px-5 py-2.5"
              >
                Open demo
                <ArrowRight />
              </button>
              <button type="button" onClick={() => setDetail(null)} className="btn btn-secondary px-5 py-2.5">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeDemo && (
        <Suspense fallback={<DemoLoadingFallback />}>
          <DemoDialog id={activeDemo.demo} title={activeDemo.title} onClose={() => setActiveDemo(null)} />
        </Suspense>
      )}
    </Section>
  );
}

function DemoLoadingFallback() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-xl dark:bg-[#10182b] dark:text-slate-200">
        Loading demo…
      </div>
    </div>
  );
}
