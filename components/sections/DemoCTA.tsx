import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GetDemoButton } from "@/components/ui/GetDemoButton";

export function DemoCTA() {
  return (
    <section className="pb-12 pt-4">
      <Container>
        <div className="rounded-3xl bg-surface px-8 py-16 md:px-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <h2 className="mt-4 text-[42px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[56px]">
              Learn more
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] text-ink">
              <CheckLine>Pilot program available</CheckLine>
              <CheckLine>No training needed</CheckLine>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <GetDemoButton />
              <a
                href="mailto:hello@ordinance.ai"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-colors hover:border-ink/30 hover:bg-surface-2"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink"
        aria-hidden
      >
        <polyline points="4 12 10 18 20 6" />
      </svg>
      {children}
    </span>
  );
}
