import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IPaymentMethod } from "../types/IPaymentMethod";
import Addition from "@/assets/square-plus-solid.svg";
import { useAddPaymentMethod } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import close from "@/assets/xmark-solid.svg";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { AppCombobox } from "@/components/common/ComboBox";
import { useEffect, useRef, useState } from "react";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import MasterName from "@/modules/end-user/Report/TrialBalance/components/MasterName";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  form: UseFormReturn<IPaymentMethod>;
  onClose: () => void;
  unitIsAdded?: boolean;
  onUnitAdded: () => void;
};

const AddPaymentMethodForm = ({
  form,
  onClose,
  onUnitAdded,
  unitIsAdded,
}: Props) => {
  const { t } = useTranslation();
  const addPaymentMethod = useAddPaymentMethod();
  const { data: allLedger } = useGetAllLedgerGroups();
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const validLedgerGroupIds = [
    "d4b5c6f7-a890-1234-d567-e890f123g456",
    "aed6b705-11aa-4b87-8681-49615d576a6d",
    "a1d2f3b4-c5e6-7890-a123-b456c789d012",
    "z6t7u8v9-a012-3456-z789-a012b345c678",
  ];
  const ledger = allLedger?.Items.filter((group) =>
    validLedgerGroupIds.includes(group.id)
  );
  const data = [
    { name: "Cash", value: 1 },
    { name: "Bank Transfer", value: 2 },
    { name: "Credit Card", value: 3 },
    { name: "Online Wallet", value: 4 },
  ];
  const onSubmit: SubmitHandler<IPaymentMethod> = async (data) => {
    // if(selectedLedgerId === "d4b5c6f7-a890-1234-d567-e890f123g456")
    //   form.setValue("type",1)
    // else if (selectedLedgerId === )
    try {
      await addPaymentMethod.mutateAsync(data);
      if (unitIsAdded === true) {
        onUnitAdded();
      }
      Toast.success("Successfully added PaymentMethod");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add PaymentMethod");
      } else {
        Toast.error("Failed to add PaymentMethod: " + error);
      }
    } finally {
      onClose();
    }
  };
  const handleOpenAddLedgerForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddLedgerForm(true);
  };

  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false);
  };
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerGroupId", ledgerId);
  };
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  useHotkeys(
    "esc",
    () => {
      handleClose();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  return (
    <div className="fixed inset-0 ml-[10.7%]   z-50 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg border border-gray-200 p-6 w-[90%] md:w-[50%] lg:w-[40%] h-auto max-h-[85vh] relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">{t("Add Payment Method")}</h1>

          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl  hover:text-red-500 "
          >
            <img src={close} alt="close" className="w-8 h-7" />
          </button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="my-2">
            <InputElement
              required
              ref={refForInput}
              label="Payment Method Name"
              layout="column"
              form={form}
              name="name"
              placeholder="Enter PaymentMethod name"
            />
          </div>
          <div className="">
            <button
              type="button"
              onClick={handleOpenAddLedgerForm}
              className="text-red-500 hover:text-red-700 sm:p-0 flex"
            >
              <img
                src={Addition}
                alt="Add Item"
                className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
              />
            </button>
            <div className="mt-4">
              {ledger && (
                <AppCombobox
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Ledger Group"
                  required
                  options={ledger}
                  value={selectedLedgerId}
                  selected={
                    ledger.find((g) => g.id === selectedLedgerId) || null
                  }
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
                    <MasterName masterId={g?.masterId ?? ""} />
                  )}
                />
              )}
            </div>
            <div>
              <div className="my-4 flex w-[51.5%] justify-between mt-10">
                <label className="text-sm text-gray-600 block mb-1 ">
                  {t("Payment Method")}
                </label>
                <SelectElement
                  form={form}
                  name="type"
                  className=" border rounded-lg px-3 py-2 items-center w-[20rem]"
                  data={data.map(({ name, value }) => ({ label: name, value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                style={{
                  backgroundColor: customTheme.palette.themePrimary,
                  padding: "4px 0 5px 0",
                  borderRadius: "8px",
                }}
                type="submit"
                className="hover:bg-teal-700 transition-all !text-xm !font-bold"
                text="Submit"
              />
            </ThemeProvider>
          </div>
          {showAddLedgerForm && (
            <div className="fixed inset-0 ml-[13%] bg-white bg-opacity-100 flex items-center justify-center z-[100]">
              <AddL
                onLedgerAdded={() => console.log("added")}
                inset
                visible
                onClose={handleCloseAddLedgerForm}
                // ledgerIsAdded={itemIsAdded}
                // onLedgerAdded={handleNewItemAdded}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodForm;
