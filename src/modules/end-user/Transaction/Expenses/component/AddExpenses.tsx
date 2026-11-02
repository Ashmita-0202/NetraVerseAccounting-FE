import { IExpenses } from "../types/IExpenses";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useAddExpenses } from "../hooks/index";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import Addition from "@/assets/square-plus-solid.svg";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, useRef } from "react";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import { AppCombobox } from "@/components/common/ComboBox";
// import { UnitName } from "../../Inventory/Item/components/GroupName";
import AddP from "@/modules/end-user/Payments/PaymentMethod/pages/Add";
import { PeerInput } from "@/components/common/PeerInput";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import { ILedgers } from "@/modules/end-user/account/ledger/types/ILedgers";
import { useGetAllPaymentMethod } from "@/modules/end-user/Payments/PaymentMethod/hooks";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
import { LedgerBalance } from "@/modules/end-user/account/ledger/components/GetBalance";
import { useGetAllParties } from "@/modules/end-user/account/parties/hooks";
type Props = {
  form: UseFormReturn<IExpenses>;
  onClose: () => void;
};

const AddExpenseForm = ({ form, onClose }: Props) => {
  const { t } = useTranslation();
  const addExpense = useAddExpenses();
  const { data: allParties, refetch: refetchLedger } = useGetAllParties();
  const [fields, setFields] = useState(
    [] as {
      id?: string;
      amount: number;
      remarks: string;
      ledgerId: string;
    }[]
  );
  const [addedItems, setAddedItems] = useState(
    [] as {
      id?: string;
      amount: number;
      remarks: string;
      ledgerId: string;
      ledgerName: string;
    }[]
  );
  const { data: ledgerForPayment } = useGetAllPaymentMethod();
  const [selectedIdForPayment, setSelectedIdForPayment] = useState("");
  const handleSelectLedgerForPayment = (ledgerId: string) => {
    form.setValue("paymentId", ledgerId);
  };
  const [isOpen] = useState(true);

  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<ILedgers>();
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [showAddPaymentForm, setshowAddPaymentForm] = useState(false);
  const [amounts, setAmounts] = useState<number | null>();
  const [totalAmount, setTotalAmount] = useState<number>();
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const [remarks, setRemarks] = useState("");
  const handleClose = () => {
    setAddedItems([]);
    setTotalAmount(0);
    const resetFields = fields.map(() => ({
      id: "",
      amount: 0,
      remarks: "",
      transactionId: "",
      ledgerId: "",
    }));
    setFields(resetFields);
    form.reset();
    setSelectedLedgerId("");
    setSelectedIdForPayment("");
    setAmounts(null);
    onClose();
  };
  const handleEdit = (index: number) => {
    const itemToEdit = addedItems[index];
    setEditingIndex(index);
    setIsEditingLoading(true);
    const updatedFields = [
      {
        id: itemToEdit.id,
        amount: itemToEdit.amount,
        remarks: itemToEdit.remarks,
        ledgerId: itemToEdit.ledgerId,
      },
    ];
    setFields(updatedFields);
    form.setValue(`addTransactionsItemsForExpense.0.id`, itemToEdit.id);
    form.setValue(`addTransactionsItemsForExpense.0.amount`, itemToEdit.amount);
    form.setValue(
      `addTransactionsItemsForExpense.0.remarks`,
      itemToEdit.remarks
    );
    form.setValue(
      `addTransactionsItemsForExpense.0.ledgerId`,
      itemToEdit.ledgerId
    );
    setAmounts(itemToEdit.amount);
    setSelectedLedgerId(itemToEdit.ledgerId);
    setRemarks(itemToEdit.remarks);
  };
  const handleAddToTable = (index: number) => {
    const currentItem = fields[index];
    if (!currentItem.amount || !currentItem.ledgerId || !currentItem.remarks) {
      Toast.error("Please fill all item fields");
      return;
    }

    if (editingIndex !== null) {
      const updatedItems = [...addedItems];
      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        id: currentItem.id,
        amount: currentItem.amount,
        remarks: currentItem.remarks,
        ledgerId: currentItem.ledgerId,
      };
      const newTotalAmount = updatedItems.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      setAddedItems(updatedItems);
      setEditingIndex(null);
      setIsEditingLoading(false);
      setTotalAmount(newTotalAmount);
    }
    const updatedAddedItems = [...addedItems];
    if (selectedLedger)
      updatedAddedItems.push({
        ledgerName: selectedLedger.name,
        ledgerId: currentItem.ledgerId,
        amount: currentItem.amount,
        remarks: currentItem.remarks,
      });
    const newTotalAmount = updatedAddedItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    setTotalAmount(newTotalAmount);
    setAddedItems(updatedAddedItems);
    const updatedFields = [...fields];
    updatedFields[index] = {
      amount: 0,
      remarks: "",
      ledgerId: "",
    };
    setFields(updatedFields);
    setSelectedLedgerId("");
    setAmounts(null);
    setRemarks("");
  };
  useEffect(() => {
    if (selectedLedgerId && amounts && remarks !== undefined) {
      const newRemarks = remarks;
      const newAmount = amounts;
      const newLedger = selectedLedgerId;
      const updatedFields = [...fields];
      updatedFields[0] = {
        ledgerId: newLedger,
        remarks: newRemarks,
        amount: newAmount,
      };
      setFields(updatedFields);
    }
  }, [selectedLedgerId, amounts, remarks]);
  useEffect(() => {
    if (totalAmount) form.setValue("totalAmount", totalAmount);
  }, [totalAmount, form]);
  const onSubmit: SubmitHandler<IExpenses> = async (data) => {
    if (editingIndex !== null) {
      return;
    }
    if (!data.narration) {
      Toast.error("Narration is required");
      return;
    }
    const filteredExpenseItems = addedItems.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ ledgerName, ...rest }) => rest
    );
    const updatedData = {
      ...data,
      transactionsItems: filteredExpenseItems,
    };

    try {
      await addExpense.mutateAsync(updatedData);
      const isConfirmed = await Toast.success(
        "Successfully added Expenses",
        () => {
          form.reset();
        }
      );
      if (!isConfirmed) {
        onClose();
      }
      setAddedItems([]);
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add Expenses");
      } else {
        Toast.error("Failed to add ExpenseDetails: " + error);
      }
    }
    handleClose();
  };

  const handleSelectLedger = (
    index: number,
    selectedLedger: { id: string; name: string }
  ) => {
    form.setValue(
      `addTransactionsItemsForExpense.${index}.ledgerId`,
      selectedLedger.id
    );
    setSelectedLedgerId(selectedLedger.id);
  };
  const handleDelete = (index: number) => {
    if (totalAmount)
      setTotalAmount(totalAmount - Number(addedItems[index].amount));
    const updatedItems = addedItems.filter((_, i) => i !== index);
    setAddedItems(updatedItems);
  };
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsEditingLoading(false);

    const resetFields = fields.map(() => ({
      id: "",
      amount: 0,
      remarks: "",
      transactionId: "",
      ledgerId: "",
    }));

    setFields(resetFields);
    form.reset();
    setAmounts(null);
  };

  const handleOpenAddLedgerForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddLedgerForm(true);
    setLedgerIsAdded(true);
  };

  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false);
    setLedgerIsAdded(false);
  };
  const handleOpenAddPaymentForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setshowAddPaymentForm(true);
  };
  const handleCloseAddPaymentForm = () => {
    setshowAddPaymentForm(false);
  };

  useEffect(() => {
    const formFields = form.watch("addTransactionsItemsForExpense") || [];
    if (JSON.stringify(fields) !== JSON.stringify(formFields)) {
      setFields(formFields);
    }
  }, [form.watch("addTransactionsItemsForExpense")]);

  const [newAddedLedgerName, setNewAddedLedgerName] = useState("");
  const [ledgerIsAdded, setLedgerIsAdded] = useState(false);
  const handleAddNewLedger = async (itemName: string) => {
    setNewAddedLedgerName(itemName);
    handleCloseAddLedgerForm();
  };
  useEffect(() => {
    if (newAddedLedgerName) {
      refetchLedger();
    }
  }, [newAddedLedgerName]);
  useEffect(() => {
    if (!newAddedLedgerName || !allParties) return;
    const addedLedger = allParties.Items.find(
      (item) => item.name === newAddedLedgerName
    );
    if (!addedLedger) return;

    if (addedLedger) {
      setSelectedLedgerId(addedLedger.id);
      setNewAddedLedgerName("");
    }
  }, [allParties, newAddedLedgerName]);
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
  const inputRefForLedger = useRef<HTMLInputElement>(null);
  useHotkeys(
    "alt+n",
    () => {
      if (document.activeElement === inputRefForLedger.current) {
        setShowAddLedgerForm(true);
        inputRefForLedger.current?.blur();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  const inputRefForPayment = useRef<HTMLInputElement>(null);
  useHotkeys(
    "alt+n",
    () => {
      if (document.activeElement === inputRefForPayment.current) {
        setshowAddPaymentForm(true);
        inputRefForPayment.current?.blur();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  if (!isOpen) return null;

  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-full p-4 overflow-auto relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <fieldset className="h-full">
            <div className="h-[93%]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">{t("Add Expense")}</h1>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onClose();
                  }}
                  className="text-red-400 text-2xl hover:text-red-500"
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                <div className="mt-[4%]">
                  <InputElement
                    label="Date"
                    form={form}
                    name="transactionDate"
                    inputType="date"
                    placeholder="Enter Date"
                  />
                </div>
                <div className="mt-[-1%]">
                  <button
                    type="button"
                    onClick={handleOpenAddPaymentForm}
                    className="text-red-500 hover:text-red-700 sm:p-0 flex"
                  >
                    <img
                      src={Addition}
                      alt="Add Item"
                      className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
                    />
                  </button>
                  <div className="mt-[2%]">
                    <AppCombobox
                      value={selectedIdForPayment}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Payment"
                      required
                      ref={inputRefForPayment}
                      options={ledgerForPayment?.Items}
                      selected={
                        ledgerForPayment?.Items.find(
                          (g) => g.id === selectedIdForPayment
                        ) || null
                      }
                      onSelect={(group) => {
                        if (group) {
                          setSelectedIdForPayment(group.id || "");
                          handleSelectLedgerForPayment(group.id || "");
                        } else {
                          setSelectedIdForPayment("");
                        }
                      }}
                      getLabel={(g) => g?.name ?? ""}
                      getValue={(g) => g?.id ?? ""}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4  p-2 rounded-lg mb-1 relative border-teal-500 border">
                <div className="flex items-center mb-2">
                  <h2 className="font-semibold">
                    {" "}
                    {t("Expense")} {t("Items")}
                  </h2>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleOpenAddLedgerForm}
                      className="text-red-500 hover:text-red-700 p-2 sm:p-0"
                    >
                      <img
                        src={Addition}
                        alt="Add Item"
                        className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
                      />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto h-[6rem] mb-2 relative">
                  {fields.map((_ev, index) => (
                    <div key={index} className="w-full pb-2">
                      <div
                        ref={(el) => (blockRefs.current[index] = el)}
                        className="w-full flex flex-col md:flex-row md:items-end gap-2"
                      >
                        <div className="flex flex-col w-full md:w-[22rem] relative">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-gray-600"></label>
                            {selectedLedgerId && (
                              <div className="text-xs text-green-600 font-semibold">
                                <LedgerBalance ledgerId={selectedLedgerId} />
                              </div>
                            )}
                          </div>

                          <AppCombobox
                            dropDownWidth="w-[22rem]"
                            dropdownPositionClass="fixed"
                            label="Ledger"
                            ref={inputRefForLedger}
                            required
                            options={allParties?.items}
                            value={selectedLedgerId}
                            selected={
                              allParties?.Items.find(
                                (g) => g.id === selectedLedgerId
                              ) || null
                            }
                            onSelect={(group) => {
                              if (group) {
                                setSelectedLedgerId(group.id || "");
                                handleSelectLedger(index, group);
                                setSelectedLedger(group);
                              } else {
                                setSelectedLedgerId("");
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
                        </div>

                        <div className="flex-1 min-w-[120px]">
                          <PeerInput
                            label="Amount"
                            onChange={(e) => {
                              const amount = Number(e.target.value);
                              setAmounts(amount);
                              form.setValue(
                                `addTransactionsItemsForExpense.${index}.amount`,
                                amount
                              );
                            }}
                            value={amounts || ""}
                            inputType="number"
                            name={`transactionsItems.${index}.amount`}
                            placeholder="Amount"
                            className="w-full"
                          />
                        </div>

                        {/* Remarks Field */}
                        <div className="flex-1 min-w-[120px]">
                          <PeerInput
                            label="Remarks"
                            inputType="text"
                            onChange={(e) => {
                              const remarks = e.target.value;
                              setRemarks(remarks);
                              form.setValue(
                                `addTransactionsItemsForExpense.${index}.remarks`,
                                remarks
                              );
                            }}
                            value={remarks || ""}
                            name={`transactionsItems.${index}.remarks`}
                            placeholder="Remarks"
                            className="w-full"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-end gap-2 mb-1">
                          <button
                            type="button"
                            onClick={() => handleAddToTable(index)}
                            className={`px-3 py-1 rounded text-white ${
                              editingIndex !== null
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-teal-500 hover:bg-teal-600"
                            }`}
                          >
                            {editingIndex !== null ? "Update" : "Add"}
                          </button>

                          {editingIndex !== null && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                <div className="mt-[4%]">
                  <InputElement
                    label="Narration"
                    form={form}
                    name="narration"
                    inputType="text"
                    placeholder="Enter Narration"
                  />
                </div>
                <div className="mt-[4%]">
                  <PeerInput
                    onChange={() => {
                      if (totalAmount)
                        form.setValue("totalAmount", totalAmount);
                    }}
                    disabled
                    label="Total Amount"
                    inputType="text"
                    placeholder="Amount"
                    value={totalAmount ?? ""}
                  />
                </div>
              </div>

              <div className="h-[45%] overflow-y-auto">
                {addedItems.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">
                      {t("Added")} {t("Expense")} {t("Items")}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="p-2 border text-left">
                              {t("Amount")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Remarks")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Ledger")}
                            </th>
                            <th className="p-2 border text-center">
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-100">
                              <td className="p-2 border">{item.amount}</td>
                              <td className="p-2 border">{item.remarks}</td>
                              <td className="p-2 border">{item.ledgerName}</td>
                              <td
                                className="p-2 border text-center flex justify-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DeleteButton
                                  handleDelete={() => handleDelete(idx)}
                                  isLoading={false}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      !isEditingLoading &&
                                      (editingIndex === null ||
                                        editingIndex !== idx)
                                    ) {
                                      handleEdit(idx);
                                    }
                                  }}
                                  disabled={
                                    isEditingLoading && editingIndex !== idx
                                  }
                                  className={`
                                  px-3 py-1 rounded-md border flex items-center justify-center
                                  ${
                                    isEditingLoading && editingIndex !== idx
                                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                      : "border-blue-500 text-blue-600 hover:bg-blue-50"
                                  }
                                  transition-colors duration-200
                                `}
                                >
                                  <Edit />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center ">
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  text="Submit"
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "8px 20px",
                    borderRadius: "8px",
                  }}
                  type="submit"
                >
                  Submit Expense
                </ButtonElement>
              </ThemeProvider>
            </div>
          </fieldset>
        </form>
      </div>
      {showAddLedgerForm && (
        <div className="fixed inset-0 ml-[12%] bg-white bg-opacity-100 flex items-center justify-center z-[100]">
          <AddL
            onLedgerAdded={() => handleAddNewLedger}
            visible
            onClose={handleCloseAddLedgerForm}
            ledgerIsAdded={ledgerIsAdded}
          />
        </div>
      )}
      {showAddPaymentForm && (
        <div className="fixed inset-0 ml-[12%] bg-white bg-opacity-100 flex items-center justify-center z-[100]">
          <AddP
            onUnitAdded={() => console.log("added")}
            visible
            onClose={handleCloseAddPaymentForm}
          />
        </div>
      )}
    </div>
  );
};

export default AddExpenseForm;
