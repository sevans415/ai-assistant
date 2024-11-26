import { optionsPackageMap } from "@/components/constants";
import { useState } from "react";

type OptionPackage = "volunteer" | "wellness" | "coach";

export function useOptionPackage() {
  const [optionPackageType, setOptionPackageType] = useState<OptionPackage>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [optionPackage, setOptionPackage] =
    useState<(typeof optionsPackageMap)[OptionPackage]>();

  const handleOptionClick = (option?: OptionPackage) => {
    if (option) {
      setOptionPackageType(option);
      setSelectedOptions(optionsPackageMap[option].selected);
      setOptionPackage(optionsPackageMap[option]);
    } else {
      setSelectedOptions([]);
      setOptionPackage(undefined);
    }
  };

  const clearOptions = () => {
    setOptionPackageType(undefined);
    setSelectedOptions([]);
    setOptionPackage(undefined);
  };

  return {
    optionPackageType,
    handleOptionClick,
    selectedOptions,
    setSelectedOptions,
    clearOptions,
    optionPackage
  };
}
