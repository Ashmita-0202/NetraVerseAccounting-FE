import {
  Dropdown,
  DropdownProps,
  makeStyles,
  Option,
  useId,
} from "@fluentui/react-components";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    display: "grid",
    justifyItems: "start",
    gap: "20px",
  },
  field: {
    display: "grid",
    justifyItems: "start",
    gap: "2px",
    width: "100%",
  },
});
interface Props extends DropdownProps {
  preview?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
  name?: string;
  data: {
    label: string;
    value: string | number | boolean;
    presence?: string;
    secondaryText?: string;
  }[];
  label?: string;
}

export const SelectElement = ({
  preview = false,
  form,
  name,
  data,
  label,
  className = "",
  ...props
}: Props) => {
  const dropdownId = useId(`${name}-dropdown`);
  const styles = useStyles();
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (data && data.length > 0) {
      const selectedOption = data.find(
        (item) => item.value === form.getValues(name)
      );
      if (selectedOption) {
        setSelectedOptions([selectedOption.value as string]);
        setValue(selectedOption.label);
      } else {
        setSelectedOptions([]);
        setValue("");
      }
    }
  }, [data, form, name]);

  React.useEffect(() => {
    form.watch(name);
  }, []);

  return (
    <div className={styles.root}>
      {preview ? (
        <span className="mx-2">{form.getValues(name)}</span>
      ) : (
        <div className={styles.field}>
          {label && (
            <label className="!text-base lg:!text-lg mb-1" htmlFor={dropdownId}>
              {label}
            </label>
          )}
          <Controller
            control={form.control}
            name={name ?? ""}
            render={({
              field: { onChange, onBlur },
              fieldState: { error },
            }) => (
              <>
                <Dropdown
                  className={`!w-full !border h-[40px] ${className}`}
                  style={{ minWidth: "auto" }}
                  id={dropdownId}
                  {...props}
                  value={value}
                  selectedOptions={selectedOptions}
                  onOptionSelect={(_ev, data) => {
                    const selectedOption = data.optionValue;
                    onChange(selectedOption); // Updates react-hook-form state
                    setSelectedOptions(data.selectedOptions);
                    setValue(data.optionText ?? "");
                  }}
                  onBlur={onBlur}
                >
                  <div className="max-h-52">
                    {data.map((item) => (
                      <Option key={item.value} value={item.value as string}>
                        {t(`${item.label}`)}
                      </Option>
                    ))}
                  </div>
                </Dropdown>
                {error && (
                  <span className="text-red-500 ms-1 mt-1">
                    {error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      )}
    </div>
  );
};
