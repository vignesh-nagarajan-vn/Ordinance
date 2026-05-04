import Image from "next/image";
import { asset } from "@/lib/assetPath";

export function Eyebrow({
  children,
  withMark = false,
}: {
  children: React.ReactNode;
  withMark?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/70">
      {withMark && (
        <Image
          src={asset("/recreate/ordinance-mark.png")}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      )}
      <span>{children}</span>
    </div>
  );
}
