import { certifications } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";

export default function Certifications() {
  return (
    <Section id="credentials" labelledBy="credentials-title">
      <SectionTitle
        id="credentials-title"
        eyebrow="Credentials"
        title="Training, certifications & workshops"
        description="Certifications and coursework that support the practical work above."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certificate, index) => (
          <Reveal key={certificate.title} delay={(index % 3) * 70}>
            <article className="surface surface-hover h-full p-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-white/5"
                >
                  {certificate.icon}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold leading-snug text-slate-950 dark:text-white">
                    {certificate.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
                    {certificate.issuer}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                {certificate.date && <p>{certificate.date}</p>}
                {certificate.credential && (
                  <p className="break-all">
                    Credential ID: {certificate.credential}
                  </p>
                )}
                {certificate.signedBy && (
                  <p className="border-t border-slate-200 pt-2 dark:border-white/10">
                    Signed by {certificate.signedBy.join(" and ")}
                  </p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
