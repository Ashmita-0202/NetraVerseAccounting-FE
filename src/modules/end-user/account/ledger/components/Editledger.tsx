import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ILedgers } from "../types/ILedgers";
import {
  useEditLedger,
  useGetAllLedgers,
  useGetLedgerById,
  useGetLedgerGroupByLedgerGroupId,
} from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useGetAllLedgerGroups } from "../../ledgerGroup/hooks";
import { useTranslation } from "react-i18next";
import MasterName from "@/modules/end-user/Report/TrialBalance/components/MasterName";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllParties } from "../../parties/hooks";
import { useHotkeys } from "react-hotkeys-hook";
type Props = {
  form: UseFormReturn<ILedgers>;
  ledgerId: string;
  onClose: () => void;
  currentPageIndex: number;
};

const EditLedgerForm = ({ form, onClose, ledgerId }: Props) => {
  const { t } = useTranslation();
  const editLedger = useEditLedger();
  const { refetch } = useGetAllLedgers();
  const { refetch: refetchParties } = useGetAllParties();
  const { data: LedgerGroups } = useGetAllLedgerGroups();
  const { data: ledgerData } = useGetLedgerById(ledgerId);
  const { data: ledgerGroup } = useGetLedgerGroupByLedgerGroupId(
    ledgerData?.ledgerGroupId
  );
  const [openExtension, setOpenExtension] = useState(false);
  const [selectedLedgerGroupId, setSelectedLedgerGroupId] = useState("");
  const handleSelectLedger = (ledgerGroupId: string) => {
    form.setValue("ledgerGroupId", ledgerGroupId); // Update form value
  };
  const nameValue = form.watch("name");
  const ledgerGroupValue = form.watch("ledgerGroupId");
  const isSubmitDisabled = !nameValue || !ledgerGroupValue;
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
      await editLedger.mutateAsync({
        id: ledgerId,
        data: data,
      });
      await refetch();
      if (
        data.ledgerGroupId === "a1d2f3b4-c5e6-7890-a123-b456c789d012" ||
        data.ledgerGroupId === "d4b5c6f7-a890-1234-d567-e890f123g456" ||
        data.ledgerGroupId === "z6t7u8v9-a012-3456-z789-a012b345c678" ||
        data.ledgerGroupId === "aed6b705-11aa-4b87-8681-49615d576a6d"
      )
        refetchParties();
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
  useEffect(() => {
    if (ledgerData) {
      form.reset({
        id: ledgerData?.id ?? "",
        name: ledgerData?.name ?? "",
        address: ledgerData?.address ?? "",
        panNo: ledgerData?.panNo ?? "",
        phoneNumber: ledgerData?.phoneNumber ?? "",
        maxCreditPeriod: ledgerData?.maxCreditPeriod ?? "",
        maxDuePeriod: ledgerData?.maxDuePeriod ?? "",
        ledgerGroupId: ledgerData?.ledgerGroupId ?? "",
      });
      if (ledgerData?.ledgerGroupId) {
        setSelectedLedgerGroupId(ledgerData?.ledgerGroupId);
      }
    }
  }, [ledgerData, ledgerGroup, form]);
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="w-[46rem] h-[70%] bg-white py-3 px-8 rounded-2xl shadow-md transform transition-all duration-300">
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg  font-semibold">{t("Update Ledger")}</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="mb-4">
              <InputElement
                label="Name"
                layout="column"
                form={form}
                name="name"
                placeholder="Enter ledger name"
                defaultValue={ledgerData?.name}
              />
            </div>
            <div className=" mb-6">
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Ledger"
                required
                options={LedgerGroups?.Items}
                value={selectedLedgerGroupId}
                selected={
                  LedgerGroups?.Items.find(
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
            <div className="flex justify-center">
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

export default EditLedgerForm;
