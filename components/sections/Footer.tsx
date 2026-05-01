import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-surface py-14 md:py-20">
      <Container>
        <div className="flex items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <Image
              src="/ordinance/ordinance-logo.png"
              alt="Ordinance"
              width={40}
              height={40}
              className="h-10 w-10 rounded-[10px]"
            />
            <span className="text-[22px] font-semibold tracking-tight text-ink">
              Ordinance
            </span>
          </div>

          <p className="text-right text-[16px] font-semibold text-ink">
            Power your office with
            <br />
            capitol intelligence
          </p>
        </div>
      </Container>
    </footer>
  );
}
