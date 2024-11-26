import { Checkbox } from "@/components/ui/checkbox";

interface OptionsGridProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  optionsTitle: string;
  options: string[];
}

export function OptionsGrid({
  selectedOptions,
  onOptionsChange,
  optionsTitle,
  options
}: OptionsGridProps) {
  return (
    <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      <p className="text-zinc-300 mb-2">{optionsTitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedOptions.includes(option)}
              onCheckedChange={checked => {
                if (checked) {
                  onOptionsChange([...selectedOptions, option]);
                } else {
                  onOptionsChange(
                    selectedOptions.filter(item => item !== option)
                  );
                }
              }}
            />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
