import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { GetDemoButton } from "@/components/ui/GetDemoButton";
import { Footer } from "@/components/sections/Footer";

const stats = [
  {
    label: "Bills introduced that become law",
    value: "< 3%",
    note: "119th Congress",
    dar: false,
  },
  {
    label: "Annual staff turnover in congressional offices",
    value: "40%",
    note: "per GAO estimates",
    dark: false,
  },
  {
    label: "Average age of core government IT systems",
    value: "20+ yrs",
    note: "per GAO audit",
    dark: false,
  },
  {
    label: "Constituent messages handled per office each year — manually",
    value: "50K+",
    note: "avg. congressional office",
    dark: true,
  },
];

const vision = [
  {
    title: "Agentic, Intelligent Back Layer",
    body: "Storage for a wealth of information — and an unbearable amount of feedback. Every meeting transcript, proposed bill, and correspondence, queryable in seconds. And humans need not query it — the system anticipates needs and acts proactively.",
  },
  {
    title: "Cohesiveness",
    body: (
      <>
        Automatic communication between agencies, linking together projects
        while constantly providing{" "}
        <span className="font-semibold text-brand">Actionable Insights.</span>
      </>
    ),
  },
  {
    title: "Continuous Improvement",
    body: "Systematically designed to improve and refine to match the pace of human innovation. The system learns as the office does.",
  },
];

export default function WhyPage() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Page hero */}
      <section className="bg-surface-dark py-28 md:py-40">
        <Container>
          <div className="max-w-[860px]">
            <h1 className="text-[48px] font-semibold leading-[1.06] tracking-[-0.02em] text-white md:text-[72px]">
              We&apos;re building how Congress will run in the next decade.
            </h1>
            <p className="mt-8 max-w-[560px] text-[19px] leading-[1.6] text-white/60">
              Congressional offices have spent years stuck with tools that lag
              behind the intensive demand of public policy. We've seen firsthand the inefficiencies
              and frustration that this causes for both government officers and the public they serve.
            </p>
          </div>
        </Container>
      </section>

      {/* Why section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-center text-center">
            <h2 className="max-w-[640px] text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[46px]">
              Why Congress needs a new approach
            </h2>
            <p className="mt-4 max-w-[520px] text-[17px] leading-[1.6] text-body">
              Behind every representative lies a system weighed down by work
              that craves optimization. These numbers show why.
            </p>
          </div>

          {/* Stat cards */}
          <div className="mt-14 grid grid-cols-1 gap-0 md:grid-cols-2">
            {/* Left column — three plain stat rows */}
            <div className="flex flex-col divide-y divide-line border-y border-l border-r border-line md:border-r-0">
              {stats.slice(0, 3).map((s) => (
                <div key={s.value} className="flex flex-col gap-1 px-8 py-8">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                    {s.label}
                  </span>
                  <span className="mt-1 text-[48px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[56px]">
                    {s.value}
                  </span>
                  <span className="mt-1 text-[13px] text-muted">{s.note}</span>
                </div>
              ))}
            </div>

            {/* Right column — one large dark card */}
            <div className="flex flex-col justify-center rounded-none border border-line bg-surface-dark px-8 py-10 md:rounded-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
                {stats[3].label}
              </span>
              <span className="mt-4 text-[72px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[88px]">
                {stats[3].value}
              </span>
              <span className="mt-3 text-[14px] text-white/40">
                {stats[3].note}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision section */}
      <section className="py-20 md:py-28">
        <Container>
          {/* Top row: large descriptor + first vision card */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl bg-surface-dark p-8 md:col-span-2 md:p-10">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Our Vision
              </span>
              <div>
                <p className="mt-16 text-[17px] leading-[1.65] text-white/70 md:mt-24">
                  An office where pace is not decided by manual labor — where
                  the limitation is human imagination. Software that is designed to 
                  be uniquely human, focusing on empowering what representatives and 
                  their teams can truly achieve. Humans brainpower is too valuable to 
                  be caught up in gridlock.
                </p>
              </div>
            </div>

            <VisionCard {...vision[0]} />
          </div>

          {/* Bottom row: remaining two vision cards */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {vision.slice(1).map((v) => (
              <VisionCard key={v.title} {...v} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-center text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
              Pilot Program
            </p>
            <h2 className="mt-4 max-w-[600px] text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[44px]">
              We&apos;re starting with local &amp; municipal governments.
            </h2>
            <p className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-body">
              Pilot phase. White glove support. If you&apos;re interested,
              we&apos;d love to chat.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <GetDemoButton label="Try our demo" />
              <a
                href="mailto:hello@ordinance.ai"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-colors hover:border-ink/30 hover:bg-surface-2"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}

function VisionCard({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-8">
      <div className="h-7 w-7 rounded-full border-2 border-brand/40 bg-brand/10" />
      <h3 className="text-[19px] font-semibold leading-[1.2] text-ink">
        {title}
      </h3>
      <p className="text-[15px] leading-[1.65] text-body">{body}</p>
    </div>
  );
}
