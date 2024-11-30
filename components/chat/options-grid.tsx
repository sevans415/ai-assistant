import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { OptionPackage } from "../constants";

interface OptionsGridProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  groupSize: number;
  optionPackage: OptionPackage;
  setGroupSize: (size: number) => void;
  selectedLocationOptions: string[];
  setSelectedLocationOptions: (options: string[]) => void;
}

export function OptionsGrid({
  selectedOptions,
  onOptionsChange,
  groupSize,
  setGroupSize,
  selectedLocationOptions,
  setSelectedLocationOptions,
  optionPackage
}: OptionsGridProps) {
  const { displayConfig, optionsTitle, options, locationOptions } =
    optionPackage;

  return (
    <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      {displayConfig.location && (
        <>
          <p className="text-zinc-300 mb-2">Where would you like to do this?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${option}`}
                  checked={selectedLocationOptions.includes(option)}
                  onCheckedChange={checked => {
                    if (checked) {
                      setSelectedLocationOptions([
                        ...selectedLocationOptions,
                        option
                      ]);
                    } else {
                      setSelectedLocationOptions(
                        selectedLocationOptions.filter(item => item !== option)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={`location-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
        </>
      )}
      {displayConfig.groupSize && (
        <>
          <p className="text-zinc-300 mb-2">How many people do you expect?</p>
          <Input
            className="mb-2 max-w-20"
            type="number"
            value={groupSize}
            onChange={e => setGroupSize(parseInt(e.target.value))}
          />
          <Separator className="my-4" />
        </>
      )}
      {displayConfig.options && (
        <>
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
        </>
      )}
    </div>
  );
}
