import { cn } from "@/lib/utils";

interface HeaderProps {
  isExpanded: boolean;
  onReset: () => void;
}

export function Header({ isExpanded, onReset }: HeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-zinc-800 p-4 transition-all duration-500",
        isExpanded ? "opacity-100" : "opacity-0 hidden"
      )}
    >
      <h1
        className="text-xl font-semibold text-white cursor-pointer hover:opacity-80"
        onClick={onReset}
      >
        Happyly Assistant
      </h1>
    </header>
  );
}
