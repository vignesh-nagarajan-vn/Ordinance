import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { asset } from "@/lib/assetPath";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureCell } from "@/components/ui/FeatureCell";
import { Icon } from "@/components/ui/icons";

const left = [
  {
    icon: <Icon.Calendar />,
    title: "Private by design",
    description:
      "Built for oversight and FOIA security compliance.",
  },
  {
    icon: <Icon.Refresh />,
    title: "Sources cited, always",
    description: "Every insight traces back to a specific document.",
  },
];

const right = [
  {
    icon: <Icon.Repeat />,
    title: "Works across all your tools",
    description:
      "Connects to your workspace's calendar, email, and shared drives. Intelligence is always up to date.",
  },
  {
    icon: <Icon.Plug />,
    title: "Proactive alerts",
    description:
      "Flags issues and surfaces insights before you even think to ask.",
  },
];

export function ActionableInsights() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="text-center">
          <Eyebrow>Redefining AI</Eyebrow>
          <h2 className="mt-4 text-[42px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[56px]">
            AI Stands For
            <br />
            <span className="text-brand">Actionable Insights.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.65] text-body">
            We believe AI is much more than a chatbot. We're building
            a custom-trained privacy-first AI backlayer that is always thinking — surfacing 
            what matters and flagging what's drafting, before you think to ask.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_560px_1fr] lg:gap-6">
          <div className="space-y-10 lg:self-start lg:pt-16">
            {left.map((f) => (
              <FeatureCell key={f.title} {...f} />
            ))}
          </div>

          <div className="order-first lg:order-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
              <Image
                src={asset("/ordinance/actionable_insights.png")}
                alt="Ordinance actionable insights"
                fill
                sizes="(max-width: 1536px)"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-10 lg:self-end lg:pb-16">
            {right.map((f) => (
              <FeatureCell key={f.title} {...f} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
