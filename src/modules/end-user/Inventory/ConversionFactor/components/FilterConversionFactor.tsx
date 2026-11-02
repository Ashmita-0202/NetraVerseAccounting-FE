import { InputElement } from "@/components/FormComponents/input";
import { IFilterConversionFactorByDate } from "../types/IConversionFactor";
import { UseFormReturn } from "react-hook-form";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllUnits } from "../../Units/hooks";
import { useState } from "react";
import { AppCombobox } from "@/components/common/ComboBox";
type Props = {
  form: UseFormReturn<IFilterConversionFactorByDate>;
  setFormData: (data: IFilterConversionFactorByDate) => void;
};

const FilterConversionFactorForm = ({ form, setFormData }: Props) => {
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { handleSubmit, getValues, reset } = form;
  const [fromUnitId, setFromUnitId] = useState("");
  const { data: Units } = useGetAllUnits();

  const onSubmit = () => {
    const formData = getValues();
    setFormData(formData);
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      formUnit: "",
    });
    reset({
      startDate: "",
      endDate: "",
      formUnit: "",
    });
    setFromUnitId("");
  };

  const handleSelectToUnit = (unitId: string) => {
    form.setValue("formUnit", unitId);
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full  gap-4 w-[87%] mb-4 mr-2">
          <InputElement
            form={form}
            label="Start Date"
            inputType="date"
            name="startDate"
            placeholder="Enter Start Date"
          />
          <InputElement
            label="End Date"
            form={form}
            inputType="date"
            name="endDate"
            placeholder="Enter End Date"
          />

          <div className="mt-[-1%]">
            {Units && (
              <AppCombobox
                value={fromUnitId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="From Unit"
                options={Units.Items}
                selected={Units.Items.find((g) => g.id === fromUnitId) || null}
                onSelect={(group) => {
                  if (group) {
                    setFromUnitId(group.id || "");
                    handleSelectToUnit(group.id || "");
                  } else {
                    setFromUnitId("");
                  }
                }}
                getLabel={(g) => g?.name || ""}
                getValue={(g) => g?.id ?? ""}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center items-center  h-full mt-1">
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              className="flex "
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "5px 0",
                borderRadius: "8px",
              }}
              type="submit"
              text="Submit"
            />
          </ThemeProvider>
          <ThemeProvider theme={customTheme} className="ml-4">
            <ButtonElement
              className="flex "
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "5px 0",
                borderRadius: "8px",
              }}
              onClick={handleClear}
              type="button"
              text="Clear"
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};

export default FilterConversionFactorForm;
