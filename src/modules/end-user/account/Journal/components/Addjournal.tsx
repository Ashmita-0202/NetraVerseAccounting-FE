import {
  useFieldArray,
  SubmitHandler,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { useAddJournal } from "../hooks/index";
import { useGetAllLedgers } from "../../ledger/hooks/index";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, ChangeEvent } from "react";
import { IJournals } from "../types/IJournals";
import { useGetJournalRefByCompany } from "@/modules/admin/Settings/hooks";
import { useTranslation } from "react-i18next";
import { AppCombobox } from "@/components/common/ComboBox";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";

type Props = {
  form: UseFormReturn<IJournals>;
  onClose: () => void;
};

const AddJournalForm = ({ form, onClose }: Props) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "journalEntries",
    rules: { minLength: 2 },
  });
  const { data: allLedgers } = useGetAllLedgers();
  const addJournal = useAddJournal();
  const companyId = localStorage.getItem("companyId");
  const { data: journalStatus } = useGetJournalRefByCompany(companyId);
  const [nextSelectedLedger, setNextSelectedLedger] = useState("Debit");
  const [selectedLedgerId, setSelectedLedgerId] = useState<{
    [key: number]: string;
  }>({});
  const journalEntries =
    useWatch({
      control: form.control,
      name: "journalEntries",
    }) || [];
  const [, setSelectedLedger] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    if (fields.length === 2) {
      form.setValue("journalEntries.0.type", "Debit");
      form.setValue("journalEntries.1.type", "Credit");
    }
  }, [fields.length, form]);

  const handleTypeChange = (index: number, selectedType: string) => {
    setSelectedLedger((prev) => ({
      ...prev,
      [index]: selectedType,
    }));
    form.setValue(`journalEntries.${index}.type`, selectedType);
    setNextSelectedLedger(selectedType === "Credit" ? "Debit" : "Credit");
  };

  const addJournalEntries = () => {
    append({
      ledgerId: "",
      debitAmount: 0,
      creditAmount: 0,
      type: nextSelectedLedger,
    });
    setNextSelectedLedger((prev) => (prev === "Debit" ? "Credit" : "Debit"));
  };

  const removeJournalEntriesField = (index: number) => {
    if (fields.length <= 2) {
      Toast.error("You must maintain at least two journal entries");
      return;
    }
    remove(index);
  };

  const handleSelectLedger = (index: number, ledgerId: string) => {
    form.setValue(`journalEntries.${index}.ledgerId`, ledgerId);
  };

  const onSubmit: SubmitHandler<IJournals> = async (data) => {
    const sanitizedData = {
      ...data,
      journalEntries: data.journalEntries.map((entry) => ({
        ...entry,
        debitAmount: entry.debitAmount || 0,
        creditAmount: entry.creditAmount || 0,
      })),
      createdAt: new Date().toISOString(),
    };
    form.reset();
    try {
      await addJournal.mutateAsync(sanitizedData);
      Toast.success("Journal created successfully");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Journal creation failed");
      } else {
        Toast.error("Failed to create journal: " + error);
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

  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });

  return (
    <div className=" inset-0 flex items-center justify-center bg-white  w-full h-full">
      <div className="w-full  h-full p-4 overflow-auto relative">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          added joutnal
          <fieldset className="h-full">
            <div className="h-[93%]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">{t("Add Journal")}</h1>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-400 text-2xl hover:text-red-500"
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journalStatus?.journalReferences === 0 && (
                  <InputElement
                    label="Reference NUmber"
                    form={form}
                    name="referenceNumber"
                    placeholder="Enter Reference Number"
                  />
                )}

                <InputElement
                  label="Transaction Date"
                  form={form}
                  name="transactionDate"
                  inputType="date"
                  placeholder="Enter Transaction Date"
                />
                <InputElement
                  label="Description"
                  form={form}
                  name="description"
                  placeholder="Enter Description"
                />
              </div>

              <h2 className="text-md font-semibold mt-6 mb-4">
                {t("Journal Entry Details")}
              </h2>

              <div className="overflow-auto h-[27rem] mb-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex">
                    <div className="flex w-[94%] mb-3">
                      <div className=" mb-6">
                        {allLedgers && (
                          <AppCombobox
                            dropDownWidth="w-full"
                            dropdownPositionClass="absolute"
                            label="Ledger"
                            required
                            options={allLedgers.Items}
                            value={selectedLedgerId[index]}
                            selected={
                              allLedgers.Items.find(
                                (g) => g.id === selectedLedgerId[index]
                              ) || null
                            }
                            onSelect={(group) => {
                              if (group) {
                                setSelectedLedgerId((prev) => ({
                                  ...prev,
                                  [index]: group?.id || "",
                                }));
                                handleSelectLedger(index, group.id || "");
                              } else {
                                setSelectedLedgerId((prev) => ({
                                  ...prev,
                                  [index]: "",
                                }));
                              }
                            }}
                            getLabel={(g) => g?.name ?? ""}
                            getValue={(g) => g?.id ?? ""}
                            renderOptionExtra={(g) => (
                              <LedgerGroupName
                                ledgerGroupId={g?.ledgerGroupId ?? ""}
                              />
                            )}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 w-[65%] ml-3">
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
                        <div className="pt-2">
                          <InputElement
                            label="Credit Amount"
                            layout="column"
                            form={form}
                            value={
                              journalEntries[index]?.type === "Credit" &&
                              journalEntries[index]?.creditAmount !== 0
                                ? journalEntries[index]?.creditAmount
                                : ""
                            }
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              form.setValue(
                                `journalEntries.${index}.creditAmount`,
                                Number(e.target.value)
                              )
                            }
                            name={`journalEntries.${index}.creditAmount`}
                            placeholder="Credit Amount"
                            disabled={journalEntries[index]?.type !== "Credit"}
                          />
                        </div>
                        <div className="pt-2">
                          <InputElement
                            label="Debit Amount"
                            layout="column"
                            form={form}
                            value={
                              journalEntries[index]?.type === "Debit" &&
                              journalEntries[index]?.debitAmount !== 0
                                ? journalEntries[index]?.debitAmount
                                : ""
                            }
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              form.setValue(
                                `journalEntries.${index}.debitAmount`,
                                Number(e.target.value)
                              )
                            }
                            name={`journalEntries.${index}.debitAmount`}
                            placeholder="Debit Amount"
                            disabled={journalEntries[index]?.type !== "Debit"}
                          />
                        </div>
                      </div>
                    </div>
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeJournalEntriesField(index)}
                        className="text-red-500 mt-1 ml-3"
                      >
                        {t("Remove")}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addJournalEntries}
                className="text-teal-500"
              >
                {t("Add Entry")}
              </button>

              <div className="mt-3 flex justify-between w-full px-4">
                <span className="font-semibold text-md">
                  {t("Total Debit")}: {totalDebit}
                </span>
                <span className="font-semibold text-md">
                  {t("Total Credit")}: {totalCredit}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-9">
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
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddJournalForm;
