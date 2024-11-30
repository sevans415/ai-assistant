import { Button } from "@/components/ui/button";
import { OptionPackageType } from "../constants";

interface PillActionButtonsProps {
  onClick: (type: OptionPackageType) => void;
}

export default function PillActionButtons({ onClick }: PillActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <Button
        variant="outline"
        className="rounded-full bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        onClick={() => onClick("giveback")}
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
