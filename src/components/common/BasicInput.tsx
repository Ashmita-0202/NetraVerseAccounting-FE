import { Input } from "@headlessui/react";
import { useTranslation } from "react-i18next";
interface BasicInputProps {
  label?: string;
  layout?: "column" | "row";
  inputType?: "text" | "file" | "number" | "email" | "password" | "checkbox";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: number | string | string[];
  defaultValue?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customStyle?: string;
  name?: string;
}

export const BasicInput = ({
  label,
  layout = "column",
  inputType = "text",
  placeholder,
  disabled = false,
  value,
  defaultValue,
  required,
  onChange,
  name,
}: BasicInputProps) => {
  const { t } = useTranslation();
  const layoutClass =
    layout === "column"
      ? "flex flex-col space-y-1"
      : "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0";

  return (
    <div className={`${layoutClass} font-poppins`}>
      <div className="flex justify-center items-center ">
        {inputType !== "file" ? (
          <div className="relative ">
            <div className="flex items-center">
              {required && <span className="text-red-500 text-xl mr-1">*</span>}
              <label className="text-sm text-slate-500">{t(`${label}`)}</label>
            </div>
            <Input
              className={`px-3  py-2 rounded border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:outline-none text-sm `}
              id={name}
              name={name}
              type={inputType}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={onChange}
            />
          </div>
        ) : (
          <input
            id={name}
            name={name}
            type="file"
            onChange={onChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-slate-500 file:text-white hover:file:bg-slate-700"
          />
        )}
      </div>
    </div>
  );
};
