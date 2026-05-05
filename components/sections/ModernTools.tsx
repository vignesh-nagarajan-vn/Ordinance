import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { GetDemoButton } from "@/components/ui/GetDemoButton";
import { HeadlineSparkle } from "@/components/ui/icons";
import { asset } from "@/lib/assetPath";

const cards = [
  {
    title: "Everything You Need in One Place",
    body: "PDFs, transcripts, constituent letters, policy briefs, hearing notes — set up in a few clicks. Ask away, and get answers without hallucinations.",
    image: "/ordinance/ordinance_card1.png",
  },
  {
    title: "Agentic Feedback Profiles",
    body: "Your Chief of Staff's judgement availiable, 24/7. Continous revising to ensure the best work is always produced, cutting back-and-forth.",
    image: "/ordinance/ordinance_card2.png",
  },
  {
    title: "Always One Step Ahead",
    body: "The system anticipates needs and acts proactively with smart insights. Never be caught off guard again.",
    image: "/ordinance/ordinance_card3.png",
  },
];

export function ModernTools() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        {/* Problem statement */}
        <div className="flex flex-col items-center text-center">
          <p className="max-w-[700px] text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink md:text-[38px]">
            The{" "}
            <span className="text-brand">119th Congress</span>{" "}
            has disapproval ratings of{" "}
            <span className="text-brand">86%<sup className="ml-0.5 align-super text-[0.32em] font-normal tracking-normal text-body" style={{ verticalAlign: "0.8em" }}>(apr '26)</sup></span>{" "}
            and is breaking records for the lack of action.
          </p>
        </div>

        {/* Sparkle bridge to the solution */}
        <div className="my-10 flex flex-col items-center gap-4 md:my-14">
          <span className="opacity-30"><HeadlineSparkle /></span>
          <span className="opacity-60"><HeadlineSparkle /></span>
          <span className="opacity-100"><HeadlineSparkle /></span>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-[820px] text-[42px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[56px]">
            Congressional Offices
            <br />
            deserve <span className="text-brand">the best tools.</span>
          </h2>
          <div className="mt-8">
            <GetDemoButton />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-surface">
                <Image
                  src={asset(c.image)}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-[20px] font-semibold text-ink">
                {c.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-body">
                {c.body}
              </p>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-ink hover:text-brand"
              >
                Learn more
                <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
