import {
  useFieldArray,
  SubmitHandler,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { useEditJournal } from "../hooks/index";
import { useGetAllLedgers } from "../../ledger/hooks/index";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, useRef } from "react";
import { IJournals } from "../types/IJournals";
import LedgerName from "@/modules/end-user/account/Journal/components/LedgerGroup";
import { useGetJournalRefByCompany } from "@/modules/admin/Settings/hooks";
import { useGetJournalById } from "../hooks/index";
import { useTranslation } from "react-i18next";
type Props = {
  form: UseFormReturn<IJournals>;
  onClose: () => void;
  journalId: string;
};

const EditJournalForm = ({ form, onClose, journalId }: Props) => {
  const { t } = useTranslation();
  const {
    data: journalData,
    isLoading,
    refetch,
  } = useGetJournalById(journalId);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "journalEntries",
  });
  const editJournal = useEditJournal();
  const { data: ledger } = useGetAllLedgers();
  const companyId = localStorage.getItem("companyId");
  const [searchTerms, setSearchTerms] = useState<{ [key: number]: string }>({});
  const { data: journalStatus } = useGetJournalRefByCompany(companyId);
  const [filteredLedgers, setFilteredLedgers] = useState<{
    [key: number]: { id: string; name: string }[];
  }>({});
  const [dropdownVisible, setDropdownVisible] = useState<{
    [key: number]: boolean;
  }>({});
  const [nextSelectedLedger, setNextSelectedLedger] = useState("");
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const journalEntries =
    useWatch({
      control: form.control,
      name: "journalEntries",
    }) || [];

  const handleTypeChange = (index: number, selectedType: string) => {
    const updatedEntries = [...journalEntries];
    updatedEntries[index].type = selectedType;
    form.setValue("journalEntries", updatedEntries);
  };
  useEffect(() => {
    if (journalEntries.length === 0) return;
    const updatedEntries = [...journalEntries];
    const index = journalEntries.length - 1;
    const newSelectedLedger =
      journalEntries[0].type === "Credit" ? "Debit" : "Credit";
    if (newSelectedLedger !== nextSelectedLedger) {
      setNextSelectedLedger(newSelectedLedger);
    }
    if (index >= 0) {
      updatedEntries[index] = {
        ...updatedEntries[index],
        type: index % 2 !== 0 ? newSelectedLedger : journalEntries[0].type,
      };
    }
    if (JSON.stringify(journalEntries) !== JSON.stringify(updatedEntries)) {
      form.setValue("journalEntries", updatedEntries, { shouldDirty: false });
    }
  }, [journalEntries]);
  useEffect(() => {
    if (journalData) {
      form.reset({
        referenceNumber: journalData.referenceNumber || "",
        transactionDate: journalData.transactionDate || "",
        description: journalData.description || "",
        journalEntries: journalData.journalEntries || [],
      });
    }
  }, [journalData, form]);
  const EditJournalEntries = () => {
    append({
      ledgerId: "",
      debitAmount: 0,
      creditAmount: 0,
      type: nextSelectedLedger,
    });
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key]!.contains(event.target as Node)
        ) {
          setDropdownVisible((prev) => ({ ...prev, [parseInt(key)]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (index: number, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [index]: value }));
    if (!value.trim()) {
      setFilteredLedgers((prev) => ({ ...prev, [index]: [] }));
      return;
    }
    const matches =
      ledger?.Items?.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      ) || [];
    setFilteredLedgers((prev) => ({ ...prev, [index]: matches }));
  };
  const removeJournalEntriesField = (index: number) => {
    if (index === 0) {
      Toast.error("Your need to have at least one field");
      return;
    }
    remove(index);
  };
  const handleSelectLedger = (
    index: number,
    selectedLedger: { id: string; name: string }
  ) => {
    form.setValue(`journalEntries.${index}.ledgerId`, selectedLedger.id);
    setSearchTerms((prev) => ({ ...prev, [index]: selectedLedger.name }));
    setFilteredLedgers((prev) => ({ ...prev, [index]: [] }));
    setDropdownVisible((prev) => ({ ...prev, [index]: false }));
  };
  const onSubmit: SubmitHandler<IJournals> = async (form) => {
    try {
      await editJournal.mutateAsync({
        id: journalId,
        data: form,
      });

      Toast.success("Successfully Updated Journal");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update journal" + error);
      }
    } finally {
      onClose();
    }
  };

  const totalDebit = journalEntries.reduce(
    (sum, entry) => sum + Number(entry.debitAmount || 0),
    0
  );
  const totalCredit = journalEntries.reduce(
    (sum, entry) => sum + Number(entry.creditAmount || 0),
    0
  );
  const { data: ledgerData } = useGetAllLedgers();
  useEffect(() => {
    if (journalData?.journalEntries && ledgerData?.Items) {
      const updatedTerms: Record<number, string> = {};
      journalData.journalEntries.forEach((entry, index) => {
        const matchedLedger = ledgerData.Items.find(
          (ledger) => ledger.id === entry.ledgerId
        );
        if (matchedLedger) {
          updatedTerms[index] = matchedLedger.name;
          if (entry.creditAmount && entry.creditAmount > 0) {
            form.setValue(`journalEntries.${index}.type`, "Credit");
          } else if (entry.debitAmount && entry.debitAmount > 0) {
            form.setValue(`journalEntries.${index}.type`, "Debit");
          }
        }
      });

      setSearchTerms(updatedTerms);
    }
  }, [journalData, ledgerData, form]);

  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="w-full sm:max-w-2xl md:max-w-5xl   mx-4 bg-white py-8 px-6 sm:px-12 rounded-lg shadow-xl max-h-[100%]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">{t("Update Journal")}</h1>
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl hover:text-red-500 "
          >
            <img src={close} alt="close" className="w-8 h-7" />
          </button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journalStatus?.journalReferences === 0 && (
              <InputElement
                label="Reference Number"
                form={form}
                name="referenceNumber"
                placeholder="Enter Reference Number"
                defaultValue={journalData?.referenceNumber}
              />
            )}

            <InputElement
              label="Transaction Date"
              form={form}
              name="transactionDate"
              inputType="date"
              placeholder="Enter Transaction Date"
              defaultValue={journalData?.transactionDate}
            />
            <InputElement
              label="Description"
              form={form}
              name="description"
              placeholder="Enter Description"
              defaultValue={journalData?.description}
            />
          </div>
          <h2 className="text-md font-semibold mt-6 mb-4">
            {t("Journal Entry Details")}
          </h2>

          <div className="overflow-auto h-[15rem] mb-3">
            {fields.map((item, index) => {
              return (
                <div key={item.id} className="p-4 bg-gray-100 rounded-lg mb-4">
                  <div>
                    <div
                      className="relative"
                      ref={(el) => (dropdownRefs.current[index] = el)}
                    >
                      <input
                        type="text"
                        value={searchTerms[index]}
                        onChange={(e) => handleSearch(index, e.target.value)}
                        onFocus={() => {
                          setDropdownVisible((prev) => ({
                            ...prev,
                            [index]: true,
                          }));
                          setFilteredLedgers((prev) => ({
                            ...prev,
                            [index]: ledger?.Items || [],
                          }));
                        }}
                        placeholder="Enter or Select Ledger Name"
                        className="w-full p-2 border rounded"
                      />
                      {dropdownVisible[index] &&
                        filteredLedgers[index]?.length > 0 && (
                          <div className="absolute w-full bg-white border rounded shadow mt-2 z-10 max-h-40 overflow-y-auto">
                            {filteredLedgers[index].map((ledgerItem) => (
                              <div
                                key={ledgerItem.id}
                                onClick={() =>
                                  handleSelectLedger(index, ledgerItem)
                                }
                                className="p-2 hover:bg-gray-200 cursor-pointer pl-4"
                              >
                                <div className="flex justify-between w-full">
                                  <div className="flex justify-start">
                                    {ledgerItem.name}
                                  </div>
                                  <div className="text-gray-400">
                                    <LedgerName ledgerId={ledgerItem.id} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <select
                        value={journalEntries[index]?.type || ""}
                        onChange={(e) =>
                          handleTypeChange(index, e.target.value)
                        }
                        className="w-20% p-2 border rounded"
                      >
                        <option value="">{t("Select Type")}</option>
                        <option value="Credit">{t("Credit")}</option>
                        <option value="Debit">{t("Debit")}</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Credit Amount"
                        value={
                          journalEntries[index]?.type === "Credit"
                            ? journalEntries[index]?.creditAmount || ""
                            : ""
                        }
                        onChange={(e) =>
                          form.setValue(
                            `journalEntries.${index}.creditAmount`,
                            Number(e.target.value)
                          )
                        }
                        disabled={journalEntries[index]?.type !== "Credit"}
                        className="border p-2"
                        defaultValue={`${item.creditAmount}`}
                      />
                      <input
                        type="number"
                        placeholder="Debit Amount"
                        value={
                          journalEntries[index]?.type === "Debit"
                            ? journalEntries[index]?.debitAmount || ""
                            : ""
                        }
                        onChange={(e) =>
                          form.setValue(
                            `journalEntries.${index}.debitAmount`,
                            Number(e.target.value)
                          )
                        }
                        disabled={journalEntries[index]?.type !== "Debit"}
                        className="border p-2"
                        defaultValue={`${item.debitAmount}`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeJournalEntriesField(index)}
                    className="text-red-500 mt-1 ml-3"
                  >
                    {t("Remove")}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={EditJournalEntries}
            className="text-teal-500"
          >
            {t("Add Entry")}
          </button>

          <div className="pt-3 flex justify-between w-full px-4">
            <span className="font-semibold text-md">
              {t("Total Debit")}: {totalDebit}
            </span>
            <span className="font-semibold text-md">
              {t("Total Credit")}: {totalCredit}
            </span>
          </div>

          <div className="flex justify-center mt-4">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                disabled={totalDebit !== totalCredit}
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
  );
};

export default EditJournalForm;
