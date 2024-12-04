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
        className="rounded-full bg-transparent border-border hover:bg-accent-foreground hover:text-secondary"
        onClick={() => onClick("giveback")}
      >
        Volunteer with your team
      </Button>
      <Button
        variant="outline"
        className="rounded-full bg-transparent border-border hover:bg-accent-foreground hover:text-secondary"
        onClick={() => onClick("wellness")}
      >
        Wellness activity with your team
      </Button>
      {/* <Button
        variant="outline"
        className="rounded-full bg-transparent border-border hover:bg-accent-foreground hover:text-secondary"
        onClick={() => onClick("coach")}
      >
        Team building table topics
      </Button> */}
    </div>
  );
}
