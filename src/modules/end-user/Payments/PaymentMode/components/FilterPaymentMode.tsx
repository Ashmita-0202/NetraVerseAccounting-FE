import { InputElement } from "@/components/FormComponents/input";
import { IFilterReceiptByDate } from "../../Receipt/types/IReceipts";
import { UseFormReturn } from "react-hook-form";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";

type Props = {
  form: UseFormReturn<IFilterReceiptByDate>;
  setFormData: (data: IFilterReceiptByDate) => void;
};

const FilterPaymentModeForm = ({ form, setFormData }: Props) => {
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { handleSubmit, getValues, reset } = form;

  const onSubmit = () => {
    const formData = getValues();
    setFormData(formData);
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      description: "",
    });
    reset({
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full  gap-4 w-[87%] mb-4 mr-2">
          <InputElement
            label="Start Date"
            form={form}
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
          <InputElement
            label="Description"
            form={form}
            name="description"
            placeholder="Enter Description"
          />
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

export default FilterPaymentModeForm;
