import { type ReactNode } from "react";

export function FeatureCell({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-6 w-6 items-center justify-center text-ink/80">
        {icon}
      </div>
      <h4 className="text-[15px] font-semibold leading-tight text-ink">{title}</h4>
      <p className="text-[14px] leading-[1.55] text-body">{description}</p>
    </div>
  );
}
