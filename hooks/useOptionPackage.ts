import { OptionPackage, optionsPackageMap } from "@/components/constants";
import { useState } from "react";

export type OptionPackageType = "giveback" | "wellness" | "coach";

const MY_LOCATION = "Washington DC";

export function useOptionPackage() {
  const [optionPackageType, setOptionPackageType] =
    useState<OptionPackageType>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [optionPackage, setOptionPackage] = useState<OptionPackage>();
  const [groupSize, setGroupSize] = useState(5);
  const [selectedLocationOptions, setSelectedLocationOptions] = useState<
    string[]
  >([]);

  const clearOptions = () => {
    setOptionPackageType(undefined);
    setSelectedOptions([]);
    setOptionPackage(undefined);
    setSelectedLocationOptions([]);
  };

  const handleOptionClick = (option: OptionPackageType) => {
    setOptionPackageType(option);
    setSelectedOptions(optionsPackageMap[option].selected);
    setOptionPackage(optionsPackageMap[option]);
    setSelectedLocationOptions(optionsPackageMap[option].selectedLocations);
  };

  const getQueryAddendum = () => {
    if (optionPackageType === "coach") {
      return `I'm meeting with ${selectedOptions[0]} and it's a ${selectedLocationOptions[0]} meeting`;
    }
    let addendum = `\nFor group size, I expect ${groupSize} people
    \n For my physical location, I'm in ${MY_LOCATION}`;
    // if (
    //   optionPackageType === "giveback" &&
    //   selectedLocationOptions.length > 0
    // ) {
    //   addendum += `\nFor locations for the activities, I'm interested in ${selectedLocationOptions.join(
    //     ", "
    //   )}`;
    // }
    if (selectedOptions.length > 0) {
      addendum += `\nFor activities, I'm interested in ${selectedOptions.join(
        ", "
      )}`;
    }

    return addendum;
  };

  return {
    optionPackageType,
    handleOptionClick,
    selectedOptions,
    setSelectedOptions,
    clearOptions,
    optionPackage,
    groupSize,
    setGroupSize,
    selectedLocationOptions,
    setSelectedLocationOptions,
    getQueryAddendum
  };
}
