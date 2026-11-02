/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import React, { useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface AppComboboxProps<T> {
  dropdownPositionClass?: string;
  label?: string;
  required?: boolean;
  options: T[] | undefined;
  value?: string | number | null;
  defaultValue?: string | number | null;
  dropDownWidth?: string;
  selected?: T;
  onSelect: (option: T | null) => void;
  placeholder?: string;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
  renderOptionExtra?: (option: T) => JSX.Element;
}

function InnerCombobox<T>(
  {
    dropdownPositionClass,
    label = "Select Option",
    required = false,
    options,
    value,
    selected,
    dropDownWidth,
    onSelect,
    placeholder = "Search...",
    getLabel,
    defaultValue,
    getValue,
    renderOptionExtra,
  }: AppComboboxProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);

  const filteredOptions =
    query === ""
      ? options
      : options?.filter((option) =>
          getLabel(option).toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <Combobox
        value={selected}
        onChange={(option) => {
          onSelect(option);
          setIsActive(false);
          setQuery("");
        }}
      >
        {({ open }) => (
          <div className="relative mt-1">
            <div className="relative flex items-center ">
              <ComboboxInput
                className={`w-full p-2 py-3 border border-gray-400 rounded-md outline-none peer placeholder:opacity-0 bg-white focus:border-teal-500 `}
                displayValue={(option: T | null) =>
                  option ? String(getLabel(option) || "") : ""
                }
                ref={ref}
                onFocus={() => !open && setIsActive(true)}
                onBlur={() => setIsActive(false)}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder={placeholder}
              />
              <label
                htmlFor={label}
                className={`absolute flex items-center left-1 scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-teal-500 peer-focus:bg-white text-gray-500 transition-all pointer-events-none ${
                  value || defaultValue ? "bg-white" : ""
                }`}
              >
                {required && (
                  <span className="text-red-500 text-xl mr-1">*</span>
                )}
                {t(`${label}`)}
              </label>
            </div>
            <Transition show={open || isActive}>
              <div>
                {filteredOptions && filteredOptions.length > 0 && (
                  <ComboboxOptions
                    className={`bg-white border rounded shadow z-50 max-h-40 overflow-y-auto ${
                      dropdownPositionClass || "top-full left-0 right-0 mt-1"
                    } ${dropDownWidth}`}
                  >
                    {filteredOptions.map((option) => (
                      <ComboboxOption key={getValue(option)} value={option}>
                        {({ active }) => (
                          <div
                            className={`mx-2 px-2 py-1 cursor-pointer rounded-sm flex justify-between ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            <span>{getLabel(option)}</span>
                            {renderOptionExtra && (
                              <span>{renderOptionExtra(option)}</span>
                            )}
                          </div>
                        )}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
}

// Export wrapped with forwardRef
export const AppCombobox = forwardRef(InnerCombobox) as <T>(
  props: AppComboboxProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => JSX.Element;
