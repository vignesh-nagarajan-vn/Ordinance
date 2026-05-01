import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";

export default function DemoPage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <section className="py-28 md:py-40">
        <Container>
          <div className="flex flex-col items-center text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
              Demo
            </p>
            <h1 className="mt-4 max-w-[600px] text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[56px]">
              See Ordinance in action.
            </h1>
            <p className="mt-5 max-w-[440px] text-[17px] leading-[1.6] text-body">
              Coming soon. In the meantime, reach out and we&apos;ll walk you
              through it personally.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
