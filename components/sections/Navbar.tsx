import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { GetDemoButton } from "@/components/ui/GetDemoButton";
import { asset } from "@/lib/assetPath";

export function Navbar() {
  return (
    <header className="bg-[#F8F5EF] pt-4 pb-2">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <Image
              src={asset("/ordinance/ordinance-logo.png")}
              alt="Ordinance"
              width={32}
              height={32}
              className="h-8 w-8 rounded-[8px]"
            />
            <span className="text-[18px] font-semibold tracking-tight text-ink md:text-[20px]">
              Ordinance
            </span>
          </a>

          <div className="flex items-center gap-6">
            <a
              href="/why"
              className="text-[14px] font-medium text-body hover:text-ink transition-colors"
            >
              Our Why
            </a>
            <GetDemoButton className="px-4 py-1.5 text-[13px] md:px-5 md:py-2 md:text-[14px]" />
          </div>
        </div>
      </Container>
    </header>
  );
}
