import { IExpenses } from "../../Expenses/types/IExpenses";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useEditTransaction, useGetExpensesById } from "../../Expenses/hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import Addition from "@/assets/square-plus-solid.svg";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, useRef } from "react";
import { DeleteButton } from "@/components/common/DeleteButton";
import AddP from "@/modules/end-user/Payments/PaymentMethod/pages/Add";
import { Edit } from "lucide-react";
import { AppCombobox } from "@/components/common/ComboBox";
import { PeerInput } from "@/components/common/PeerInput";
import LedgerGroupName from "@/modules/end-user/PurchaseComp/purchase/component/LedgerGroupName";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import { ILedgers } from "@/modules/end-user/account/ledger/types/ILedgers";
import { useTranslation } from "react-i18next";
import { LedgerBalance } from "@/modules/end-user/account/ledger/components/GetBalance";
import { useGetAllParties } from "@/modules/end-user/account/parties/hooks";
import { useGetAllPaymentMethod } from "@/modules/end-user/Payments/PaymentMethod/hooks";
type Props = {
  form: UseFormReturn<IExpenses>;
  onClose: () => void;
  expenseId: string;
};

const EditExpenseForm = ({ form, onClose, expenseId }: Props) => {
  const { t } = useTranslation();
  const { data: ledgerForPayment } = useGetAllPaymentMethod();
  const { data: ExpenseData } = useGetExpensesById(expenseId);
  const editExpense = useEditTransaction();
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
  const [isOpen] = useState(true);
  const [selectedIdForPayment, setSelectedIdForPayment] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<ILedgers>();
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const [showAddPaymentForm, setshowAddPaymentForm] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [amounts, setAmounts] = useState<number | null>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
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
    setAmounts(null);
  };
  useEffect(() => {
    if (ExpenseData) {
      form.reset({
        id: ExpenseData?.id ?? "",
        transactionDate: ExpenseData?.transactionDate ?? "",
        totalAmount: ExpenseData?.totalAmount ?? 0,
        narration: ExpenseData?.narration ?? "",
        transactionMode: ExpenseData?.transactionMode ?? 1,
        addTransactionsItemsForExpense:
          ExpenseData?.addTransactionsItemsForExpense?.map((Item) => ({
            id: Item.id,
            remarks: Item.remarks,
            ledgerId: Item.ledgerId,
            amount: Item.amount,
          })) ?? [],
      });
      setAddedItems(
        ExpenseData.addTransactionsItemsForExpense?.map((item) => ({
          id: item.id,
          remarks: item.remarks,
          ledgerId: item.ledgerId,
          amount: item.amount,
          ledgerName:
            allParties?.Items.find((i) => i.id === item.ledgerId)?.name || "",
        })) || []
      );
      const newTotalAmount = ExpenseData.addTransactionsItemsForExpense.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);
    }
  }, [ExpenseData, form, allParties]);

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
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const handleAddToTable = (index: number) => {
    const currentItem = fields[index];
    console.log(currentItem);
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
      await editExpense.mutateAsync({
        id: expenseId,
        data: updatedData,
      });
      const isConfirmed = await Toast.success(
        "Successfully added Transaction",
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
        Toast.error(error.response?.data || "Failed to add Transaction");
      } else {
        Toast.error("Failed to add ExpenseDetails: " + error);
      }
    }
    handleClose();
  };
  const handleSelectLedgerForPayment = (ledgerId: string) => {
    form.setValue("paymentId", ledgerId);
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[88%] ml-[12%] h-[100%] bg-white p-4 overflow-auto relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <fieldset className="h-full">
            <div className="h-[93%]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">{t("Update Expense")}</h1>
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
                <div className="">
                  <InputElement
                    label="Date"
                    form={form}
                    name="transactionDate"
                    inputType="date"
                    placeholder="Enter Date"
                  />
                </div>
                <div className="mt-[4%]">
                  <PeerInput
                    onChange={() => form.setValue("totalAmount", totalAmount)}
                    label="Total Amount"
                    inputType="text"
                    placeholder="Amount"
                    value={totalAmount ?? ""}
                  />
                </div>
                <div>
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
                    <div className="mt-[2%]"></div>
                    <AppCombobox
                      value={selectedIdForPayment}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Payment"
                      required
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
                      renderOptionExtra={(g) => (
                        <LedgerGroupName
                          ledgerGroupId={g?.ledgerGroupId ?? ""}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mt-[4%]">
                  <InputElement
                    label="Narration"
                    form={form}
                    name="narration"
                    inputType="text"
                    placeholder="Enter Narration"
                  />
                </div>
              </div>

              <div className="mt-4  p-2 rounded-lg mb-1 relative border-teal-500 border">
                <div className="flex items-center mb-2">
                  <h2 className="font-semibold">
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

                <div className="overflow-y-auto h-[6rem] mb-2 relative flex items-center pl-4 ">
                  {fields.map((_ev, index) => (
                    <div key={index} className=" w-[90%]">
                      <div
                        ref={(el) => (blockRefs.current[index] = el)}
                        className="flex w-full "
                      >
                        {/* {filterItems && (
                          <AppCombobox
                            label="Payment"
                            required
                            options={filterItems}
                            selected={filterItems.find(
                              (g) => g.id === selectedItemId
                            )}
                            onSelect={(group) => {
                              if (group) {
                                handleSearchForItems(index, group);
                                setSearchTermForPayment(group.name);
                                setSelectedItemId(group.id);
                                handleSelectItem(index, group);
                                setIsItemSelected(true);
                              }
                            }}
                            getLabel={(g) => g.name ?? ""}
                            getValue={(g) => g.id ?? ""}
                            renderOptionExtra={(g) => (
                              <ItemName itemId={g.itemId} />
                            )}
                          />
                        )} */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-3 w-full ">
                          <div className="">
                            <AppCombobox
                              dropDownWidth="w-[22rem]"
                              dropdownPositionClass="fixed"
                              label="Ledger"
                              required
                              options={allParties?.Items}
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

                            {selectedLedgerId && (
                              <LedgerBalance ledgerId={selectedLedgerId} />
                            )}
                          </div>
                          <div className="relative mt-1">
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
                            />
                          </div>
                          <div className="relative mt-1 bg-slate-200">
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
                            />
                          </div>
                        </div>
                        <div className="absolute top-[15%] right-0 mt-2 gap-2 w-[8%]">
                          <button
                            type="button"
                            onClick={() => handleAddToTable(index)}
                            className={`px-3 py-1 rounded ${
                              editingIndex !== null
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-teal-500 hover:bg-teal-600"
                            } text-white`}
                          >
                            {editingIndex !== null
                              ? `${t("Update Item")}`
                              : `${t("Add Item")}`}
                          </button>

                          {editingIndex !== null && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              {t("Cancel")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="ml-2">{totalAmount}</p>
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
                ></ButtonElement>
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

export default EditExpenseForm;
