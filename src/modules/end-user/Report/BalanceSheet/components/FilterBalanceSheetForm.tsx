import { InputElement } from "@/components/FormComponents/input";
import { IFilterBalanceSheet } from "../types/IBalanceSheet";
import { UseFormReturn } from "react-hook-form";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllLedgers } from "@/modules/end-user/account/ledger/hooks";
import { useState, useEffect, useRef } from "react";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";

type Props = {
  form: UseFormReturn<IFilterBalanceSheet>;
  setFormData: (data: IFilterBalanceSheet) => void;
};

const FilterLedgerBalanceForm = ({ form, setFormData }: Props) => {
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { data: ledger, refetch } = useGetAllLedgers();
  const { handleSubmit, getValues, reset } = form;
  const [searchTerm, setSearchTerm] = useState("");
  const filteredLedgerGroups = ledger?.Items.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
    setSearchTerm("");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <InputElement
            layout="column"
            form={form}
            inputType="date"
            name="startDate"
            placeholder="Enter Start Date"
          />
          <InputElement
            form={form}
            inputType="date"
            name="endDate"
            placeholder="Enter End Date"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Search Ledger ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => {
                refetch();
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full border rounded px-2 py-2 mb-1"
            />

            {isDropdownOpen &&
              filteredLedgerGroups &&
              filteredLedgerGroups.length > 0 && (
                <ul
                  ref={dropdownRef}
                  className="absolute w-full md:w-[25.3rem] bg-white border rounded shadow z-10 max-h-40 overflow-y-auto py-1"
                >
                  {filteredLedgerGroups.map((group) => (
                    <li
                      key={group.id}
                      className="mx-2 px-2 py-1 cursor-pointer rounded-sm hover:bg-gray-100 flex justify-start"
                      onClick={() => {
                        setSearchTerm(group.name);
                        setIsDropdownOpen(false);
                        handleSelectLedger(group.id);
                      }}
                    >
                      <div className="flex justify-between w-full">
                        <div className="flex justify-start ">{group.name}</div>
                        <div>
                          <LedgerGroupName
                            ledgerGroupId={group.ledgerGroupId}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            {isDropdownOpen &&
              filteredLedgerGroups &&
              filteredLedgerGroups.length === 0 && (
                <p className="text-gray-500 mb-2">No matching Ledger found</p>
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
              text="Submit"
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
