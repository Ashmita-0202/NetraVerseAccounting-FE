import { InputElement } from "@/components/FormComponents/input";
import { IFilterSalesByDate } from "../types/ISales";
import { UseFormReturn } from "react-hook-form";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useState } from "react";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
type Props = {
  form: UseFormReturn<IFilterSalesByDate>;
  setFormData: (data: IFilterSalesByDate) => void;
};

const FilterSalesForm = ({ form, setFormData }: Props) => {
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { handleSubmit, getValues, reset } = form;
  const { data: allLedger } = useGetAllLedgers();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();
  const validLedgerGroupIds = [
    "a1d2f3b4-c5e6-7890-a123-b456c789d012",
    "d4b5c6f7-a890-1234-d567-e890f123g456",
    "z6t7u8v9-a012-3456-z789-a012b345c678",
  ];

  const ledger = allLedger?.Items.filter((group) =>
    validLedgerGroupIds.includes(group.ledgerGroupId)
  );
  const onSubmit = () => {
    const formData = getValues();
    setFormData(formData);
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      ledgerId: "",
    });
    reset({
      startDate: "",
      endDate: "",
      ledgerId: "",
    });
    setSelectedLedgerId("");
  };
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerId", ledgerId);
  };
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full  gap-4 w-[87%] mb-4 mr-2">
          <InputElement
            label="Start Date"
            layout="column"
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
          <div className="">
            {ledger && (
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Ledger"
                required
                options={ledger}
                value={selectedLedgerId}
                selected={ledger.find((g) => g.id === selectedLedgerId) || null}
                onSelect={(group) => {
                  if (group) {
                    setSelectedLedgerId(group.id || "");
                    handleSelectLedger(group.id || "");
                  } else {
                    setSelectedLedgerId("");
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                renderOptionExtra={(g) => (
                  <div>
                    {
                      AllLedgerGroup?.Items.find(
                        (val) => val.id === g?.ledgerGroupId
                      )?.name
                    }
                  </div>
                )}
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

export default FilterSalesForm;
