/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "../../../node_modules/@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { RegisterOptions } from "react-hook-form";
interface IInput {
  label?: string;
  layout?: "column" | "row";
  preview?: boolean;
  form?: any;
  name: string;
  inputType?: "text" | "date" | "file" | "Password" | "number";
  placeholder?: string;
  required?: boolean;
  value?: number | string | null | undefined | string[];
  defaultValue?: number | string | null | undefined | string[];
  disabled?: boolean;
  inputTypeCheckBox?: "checkbox";
  customStyle?: string;
  [key: string]: any;
  type?: string;
  rules?: RegisterOptions;
}

export const InputElement = forwardRef<HTMLInputElement, IInput>(
  (
    {
      label,
      preview = false,
      form,
      name,
      inputType = "text",
      type,
      disabled,
      value,
      defaultValue,
      placeholder,
      required = false,
      customStyle = "",
      inputTypeCheckBox,
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { t } = useTranslation();
    const [date, setDate] = useState("");

    const handleDate = ({ bsDate }: { bsDate: string }) => {
      setDate(bsDate);
      form.setValue(name, bsDate);
      return date;
    };
    // console.log(form.error); // This was likely a typo, should be checking individual field errors
    const { ref: registerRef, ...rest } = form.register(name); // Removed rules here as it's not directly used in register
    return (
      <div className={`font-poppins`}>
        {preview ? (
          <span className="text-gray-800">{form.getValues(name)}</span>
        ) : (
          <div className="flex flex-col">
            {inputType === "date" ? (
              <Calendar
                hideDefaultValue={true}
                onChange={handleDate}
                placeholder="Enter a date"
                language="en"
                option
                label={t(`${label}`)}
                name={name}
                theme="green"
                inputClassName={`w-full p-2 py-3 border ${
                  form.formState.errors[name]
                    ? "border-red-500"
                    : "border-gray-400"
                } rounded-md outline-none peer placeholder:opacity-0 bg-white focus:border-blue-500`}
                containerClassName={"relative w-full"}
                labelClassName={`absolute left-1 flex pt-1 bg-white items-center scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-blue-500 peer-focus:bg-white text-gray-500 transition-all pointer-events-none`}
              />
            ) : inputTypeCheckBox === "checkbox" ? (
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id={name}
                  disabled={disabled}
                  {...form.register(name)}
                  className={`h-4 w-4 border-gray-300 rounded ${customStyle}`}
                  ref={ref}
                />
                <label htmlFor={name} className="text-gray-700 text-sm">
                  {label ? `${t(`${label}`)}` : ""}
                </label>
              </div>
            ) : inputType !== "file" ? (
              <div className="relative w-full">
                <input
                  id={name}
                  disabled={disabled}
                  {...form.register(name, { required: required })}
                  placeholder={placeholder}
                  className={`w-full p-2 py-3 border ${
                    form.formState.errors[name]
                      ? "border-red-500"
                      : "border-gray-400"
                  } rounded-md outline-none peer placeholder:opacity-0 bg-white focus:border-teal-500 ${customStyle}`}
                  type={type || inputType}
                  defaultValue={defaultValue}
                  value={value}
                  ref={(e) => {
                    registerRef(e);
                    if (typeof ref === "function") {
                      ref(e);
                    } else if (ref) {
                      (
                        ref as React.MutableRefObject<HTMLInputElement | null>
                      ).current = e;
                    }
                  }}
                  {...rest}
                />
                <label
                  htmlFor={name}
                  className={`absolute left-1 ${
                    form.watch(name) ? "bg-white" : ""
                  } scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-teal-500 peer-focus:bg-white text-gray-500 transition-all pointer-events-none`}
                >
                  <div className="flex items-center">
                    {required && (
                      <span className="text-red-500 text-xl mr-1">*</span>
                    )}
                    {label ? `${t(`${label}`)}` : ""}
                  </div>
                </label>
              </div>
            ) : (
              <input
                id={name}
                type="file"
                {...form.register(name, { required: required })}
                className={`px-3 mt-1 py-2 rounded border ${
                  form.formState.errors[name]
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-1 focus:ring-gray-500 focus:outline-none text-sm`}
                ref={ref}
              />
            )}

            {form.formState.errors[name]?.message && (
              <span className="text-red-500 text-sm mt-1">
                {form.formState.errors[name]?.message}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
