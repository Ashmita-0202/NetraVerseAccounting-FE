import { InputElement } from "@/components/FormComponents/input";
import { IFilterLedgerBalance } from "../types/IVatDetails";
import { UseFormReturn } from "react-hook-form";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useState } from "react";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import { AppCombobox } from "@/components/common/ComboBox";

type Props = {
  form: UseFormReturn<IFilterLedgerBalance>;
  setFormData: (data: IFilterLedgerBalance) => void;
};

const FilterLedgerBalanceForm = ({ form, setFormData }: Props) => {
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { data: allLedgers } = useGetAllLedgers();
  const { handleSubmit, getValues, reset } = form;
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const onSubmit = () => {
    const formData = getValues();
    setFormData(formData);
    console.log(formData);
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

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
          <div className="mt-1">
            <InputElement
              label="Start Date"
              layout="column"
              form={form}
              inputType="date"
              name="startDate"
              placeholder="Enter Start Date"
            />
          </div>
          <div className="mt-1">
            <InputElement
              label="End Date"
              form={form}
              inputType="date"
              name="endDate"
              placeholder="Enter End Date"
            />
          </div>
          <div className="">
            {allLedgers && (
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Ledger"
                required
                options={allLedgers.Items}
                value={selectedLedgerId}
                selected={
                  allLedgers.Items.find((g) => g.id === selectedLedgerId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedLedgerId(group.id);
                    handleSelectLedger(group.id || "");
                  } else {
                    setSelectedLedgerId("");
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
                renderOptionExtra={(g) => (
                  <LedgerGroupName ledgerGroupId={g?.ledgerGroupId ?? ""} />
                )}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4 md:mt-0">
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              className="flex w-full sm:w-auto"
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "5px 0",
                borderRadius: "8px",
              }}
              type="submit"
              text="Search"
            />
          </ThemeProvider>
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              className="flex w-full sm:w-auto"
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

export default FilterLedgerBalanceForm;
