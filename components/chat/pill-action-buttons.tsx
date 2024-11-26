import { Button } from "@/components/ui/button";

export type PillActionType = "volunteer" | "wellness" | "coach";

interface PillActionButtonsProps {
  onClick: (type: PillActionType) => void;
}

export default function PillActionButtons({ onClick }: PillActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <Button
        variant="outline"
        className="rounded-full bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        onClick={() => onClick("volunteer")}
      >
        Volunteer with your team
      </Button>
      <Button
        variant="outline"
        className="rounded-full bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        onClick={() => onClick("wellness")}
      >
        Wellness activity with your team
      </Button>
      <Button
        variant="outline"
        className="rounded-full bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        onClick={() => onClick("coach")}
      >
        Coach me before my 1:1
      </Button>
    </div>
  );
}
