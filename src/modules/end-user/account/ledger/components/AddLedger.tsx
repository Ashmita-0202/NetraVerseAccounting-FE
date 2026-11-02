import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ILedgers } from "../types/ILedgers";
import { useAddLedger, useGetAllLedgers } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useGetAllLedgerGroups } from "../../ledgerGroup/hooks";
import { useEffect, useRef, useState } from "react";
import { AppCombobox } from "@/components/common/ComboBox";
import MasterName from "@/modules/end-user/Report/TrialBalance/components/MasterName";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
import { useGetAllParties } from "../../parties/hooks";

type Props = {
  form: UseFormReturn<ILedgers>;
  onClose: () => void;
  ledgerIsAdded?: boolean;
  onLedgerAdded: (id: string) => void;
};

const AddLedgerForm = ({
  form,
  onClose,
  ledgerIsAdded,
  onLedgerAdded,
}: Props) => {
  const { t } = useTranslation();
  const addLedger = useAddLedger();
  const { data: LedgerGroups } = useGetAllLedgerGroups();
  const [selectedLedgerGroupId, setSelectedLedgerGroupId] = useState("");
  const [openExtension, setOpenExtension] = useState(false);
  const { refetch: refetchParties } = useGetAllParties();
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerGroupId", ledgerId);
  };
  const { refetch } = useGetAllLedgers();
  const handleClose = () => {
    onClose();
    setOpenExtension(false);
    setSelectedLedgerGroupId("");
  };
  useEffect(() => {
    if (
      selectedLedgerGroupId === "a1d2f3b4-c5e6-7890-a123-b456c789d012" ||
      selectedLedgerGroupId === "d4b5c6f7-a890-1234-d567-e890f123g456" ||
      selectedLedgerGroupId === "z6t7u8v9-a012-3456-z789-a012b345c678" ||
      selectedLedgerGroupId === "aed6b705-11aa-4b87-8681-49615d576a6d"
    ) {
      setOpenExtension(true);
    } else {
      setOpenExtension(false);
    }
  }, [selectedLedgerGroupId]);

  const onSubmit: SubmitHandler<ILedgers> = async (data) => {
    form.reset();
    try {
      await addLedger.mutateAsync(data);
      await refetch();
      if (
        data.ledgerGroupId === "a1d2f3b4-c5e6-7890-a123-b456c789d012" ||
        data.ledgerGroupId === "d4b5c6f7-a890-1234-d567-e890f123g456" ||
        data.ledgerGroupId === "z6t7u8v9-a012-3456-z789-a012b345c678" ||
        data.ledgerGroupId === "aed6b705-11aa-4b87-8681-49615d576a6d"
      )
        refetchParties();
      if (ledgerIsAdded === true) {
        onLedgerAdded(data.name);
      }
      Toast.success("Successfully added Ledger");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        console.log("Error Response:", error.response);
        Toast.error(error.response?.data?.message || "Failed to add ledger");
      } else {
        Toast.error("Failed to add ledger: " + error);
      }
    } finally {
      handleClose();
    }
  };
  const nameValue = form.watch("name");
  const ledgerGroupValue = form.watch("ledgerGroupId");
  const isSubmitDisabled = !nameValue || !ledgerGroupValue;
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });
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
    <div className=" inset-0 flex  w-full h-full">
      <div className="w-full  h-full p-4 overflow-auto relative">
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg  font-semibold">{t("Add Ledger")}</h1>
              <button
                type="button"
                onClick={handleClose}
                className="text-red-400 text-2xl hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>

            <div className="mb-6">
              <InputElement
                required
                ref={refForInput}
                label="Name"
                layout="column"
                form={form}
                name="name"
                placeholder="Enter ledger name"
              />
            </div>
            <div className=" mb-6">
              {LedgerGroups && (
                <AppCombobox
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Ledger"
                  required
                  options={LedgerGroups.Items}
                  value={selectedLedgerGroupId}
                  selected={
                    LedgerGroups.Items.find(
                      (g) => g.id === selectedLedgerGroupId
                    ) || null
                  }
                  onSelect={(group) => {
                    if (group) {
                      setSelectedLedgerGroupId(group.id || "");
                      handleSelectLedger(group.id || "");
                    } else {
                      setSelectedLedgerGroupId("");
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

            {openExtension === true && (
              <div>
                <div className="mb-6">
                  <InputElement
                    label="Address"
                    layout="column"
                    form={form}
                    name="address"
                    placeholder="Enter address"
                  />
                </div>
                <div className="mb-6">
                  <InputElement
                    label="PAN No"
                    layout="column"
                    form={form}
                    name="panNo"
                    placeholder="Enter PAN number"
                  />
                </div>
                <div className="mb-6">
                  <InputElement
                    label="Phone Number"
                    layout="column"
                    form={form}
                    name="phoneNumber"
                    placeholder="Enter Phone number"
                  />
                </div>
                <div className="mb-6">
                  <InputElement
                    label="Max Credit Period"
                    layout="column"
                    form={form}
                    name="maxCreditPeriod"
                    placeholder="Maximum Credit Period"
                  />
                </div>
                <div className="mb-6">
                  <InputElement
                    label="Max Due Period"
                    layout="column"
                    form={form}
                    name="maxDuePeriod"
                    placeholder="Maximum Due Period"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center pt-14">
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  disabled={isSubmitDisabled}
                  className={`transition-all ${
                    !isSubmitDisabled
                      ? "hover:bg-teal-700"
                      : "cursor-not-allowed opacity-80"
                  }`}
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "10px 0",
                    borderRadius: "8px",
                  }}
                  type="submit"
                  text="Submit"
                />
              </ThemeProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLedgerForm;
