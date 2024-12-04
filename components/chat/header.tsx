import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  isExpanded: boolean;
  onReset: () => void;
}

export function Header({ isExpanded, onReset }: HeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border p-4 transition-all duration-500",
        isExpanded ? "opacity-100" : "opacity-0 hidden"
      )}
      onClick={onReset}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/happyly-logo.png"
          alt="Happyly Logo"
          width={40}
          height={40}
        />
        <h1 className="text-xl font-semibold cursor-pointer hover:opacity-80">
          Happyly Assistant
        </h1>
      </div>
    </header>
  );
}
