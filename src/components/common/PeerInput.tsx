import { Input } from "@headlessui/react";
import { useTranslation } from "react-i18next";
interface PeerInputProps {
  label?: string;
  layout?: "column" | "row";
  inputType?:
    | "text"
    | "file"
    | "number"
    | "email"
    | "password"
    | "checkbox"
    | "comboBox";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: number | string | string[] | null;
  defaultValue?: number | string | string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customStyle?: string;
  name?: string;
  className?: string;
}

export const PeerInput = ({
  label,
  layout = "column",
  inputType = "text",
  placeholder,
  disabled = false,
  value,
  defaultValue,
  // required,
  onChange,
  name,
}: PeerInputProps) => {
  const { t } = useTranslation();
  const layoutClass =
    layout === "column"
      ? "flex flex-col space-y-1 "
      : "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0";

  return (
    <div className={`${layoutClass} font-poppins`}>
      <div className="flex justify-center items-center w-full ">
        {inputType === "comboBox" ? (
          <div></div>
        ) : (
          <div className="relative w-full">
            {/* <div className="flex items-center">
              {required && <span className="text-red-500 text-xl mr-1">*</span>}
              <label className="text-sm text-slate-500">{label}</label>
            </div> */}
            <Input
              className={`w-full py-3 p-2 border border-gray-400 rounded-md outline-none peer placeholder:opacity-0 bg-white focus:border-teal-500 `}
              id={name}
              name={name}
              type={inputType}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={onChange}
            />
            <label
              htmlFor={name}
              className={`absolute left-1 scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-teal-500 peer-focus:bg-white text-gray-500 transition-all pointer-events-none 
${value ? "bg-white" : ""}
              `}
            >
              {t(`${label}`)}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
