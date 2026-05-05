import { Container } from "@/components/ui/Container";
import { GetDemoButton } from "@/components/ui/GetDemoButton";
import { GoldLeaves } from "@/components/ui/GoldLeaves";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 md:pt-24 md:pb-14">
      {/* Dot grid — fades at top and bottom via mask */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, #ddd6cd 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}
      />
      <GoldLeaves />
      <Container className="relative z-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-10 max-w-[900px] text-[56px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[80px]">
            <span className="hero-introducing">Introducing</span>
            <br />
            <span
              className="hero-stagger inline-block text-brand"
              style={{ animationDelay: "340ms" }}
            >
              Capitol Intelligence.
            </span>
          </h1>

          <p
            className="hero-stagger mt-6 max-w-[640px] text-[18px] leading-[1.55] text-body md:text-[20px]"
            style={{ animationDelay: "430ms" }}
          >
            Meet <span className="text-brand">Ordinance</span>, the most powerful
            AI operating layer for congressional offices — built for chiefs of
            staff, staffers, and members.
          </p>

          <div className="hero-stagger mt-8" style={{ animationDelay: "520ms" }}>
            <GetDemoButton />
          </div>
        </div>
      </Container>

      <div className="h-24 md:h-32" aria-hidden="true" />
    </section>
  );
}
