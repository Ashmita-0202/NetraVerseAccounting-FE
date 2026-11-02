import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { ISalesReturn } from "../types/ISalesReturn";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGetAllSales } from "../../sales/hooks";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import { useGetAllItem } from "@/modules/end-user/Inventory/Item/hooks";
import ItemName from "@/modules/end-user/Inventory/InventoryLedger/components/ItemName";
import {
  useAddSalesReturn,
  useGetAllSalesReturn,
  useGetSalesDetailsByReferenceId,
} from "../hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllPaymentMethod } from "@/modules/end-user/Payments/PaymentMethod/hooks";
import { PeerInput } from "@/components/common/PeerInput";
import { useHotkeys } from "react-hotkeys-hook";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  form: UseFormReturn<ISalesReturn>;
  onClose: () => void;
  selectedSalesDetailsId?: string;
  visible?: boolean;
};

const AddSalesReturnForm = ({
  form,
  onClose,
  selectedSalesDetailsId,
}: Props) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<
    {
      salesItemsId: string;
      returnQuantity: number;
      returnUnitPrice: number;
      returnTotalAmount: number;
      itemsId: string;
    }[]
  >([
    {
      salesItemsId: "",
      returnQuantity: 0,
      returnUnitPrice: 0,
      returnTotalAmount: 0,
      itemsId: "",
    },
  ]);
  const [addedItems, setAddedItems] = useState<
    {
      salesItemsId: string;
      returnQuantity: number;
      returnUnitPrice: number;
      returnTotalAmount: number;
      itemsId: string;
    }[]
  >([]);
  const [selectedRefId, setSelectedRefId] = useState("");
  const { data: SalesData, isFetching } =
    useGetSalesDetailsByReferenceId(selectedRefId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetch } = useGetAllSalesReturn();
  const [stock, setStock] = useState(0);
  const { data: allPayment } = useGetAllPaymentMethod();
  const [selectedSalesId, setSelectedSalesId] = useState("");
  const addSalesReturn = useAddSalesReturn();
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState<number>();
  const onSubmit: SubmitHandler<ISalesReturn> = useCallback(
    async (data) => {
      if (editingIndex !== null) {
        Toast.error("Please finish editing the item before submitting");
        return;
      }
      if (!data.SalesReturnItems) {
        Toast.error("Ledger ID is required");
        return;
      }

      if (addedItems.length === 0) {
        Toast.error("At least one item is required");
        return;
      }
      if (SalesData) {
        const updatedData: ISalesReturn = {
          id: "",
          salesDetailsId: SalesData?.id,
          paymentId: data.paymentId,
          returnDate: data.returnDate,
          totalReturnAmount: data.totalReturnAmount,
          taxAdjustment: data.taxAdjustment,
          netReturnAmount: data.netReturnAmount,
          discount: data.discount,
          reason: data.reason,
          SalesReturnItems: addedItems,
        };

        try {
          await addSalesReturn.mutateAsync(updatedData);
          Toast.success("Successfully added SalesReturnDetails");
          refetch();
          form.reset();
          setAddedItems([]);
          onClose();
        } catch (error: AxiosError | unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to add SalesReturnDetails"
              : "Failed to add SalesReturnDetails";
          Toast.error(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [addedItems, form, onClose]
  );
  useEffect(() => {
    if (selectedSalesDetailsId) {
      setSelectedRefId(selectedSalesDetailsId);
    }
  }, [selectedSalesDetailsId]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  useEffect(() => {
    if (selectedSalesDetailsId) {
      setSelectedSalesId(selectedSalesDetailsId);
    }
  }, [selectedSalesDetailsId]);
  const { data: allItems } = useGetAllItem();
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [searchTermsForItems, setSearchTermsForItems] = useState<{
    [key: number]: string;
  }>({});
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [itemQuantity, setItemQuantity] = useState<{
    [key: number]: number;
  }>({});
  const [vat, setVat] = useState(0);
  const [itemPrice, setItemPrice] = useState<{
    [key: number]: number;
  }>({});
  const [itemAmount, setItemAmount] = useState<{
    [key: number]: number;
  }>({});
  const { data: salesDetailsData } = useGetAllSales();
  const [paymentId, setPaymentId] = useState("");
  const handleEdit = (index: number) => {
    const itemToEdit = addedItems[index];
    const itemName = allItems?.Items.find((i) => i.id === itemToEdit.itemsId);
    setStock(itemToEdit.returnQuantity);
    const item = allItems?.Items.find((i) => i.id === itemToEdit.itemsId);
    if (!item) {
      Toast.error("Item to edit does not exist");
      return;
    }
    setEditingIndex(index);
    setIsEditingLoading(true);
    const updatedFields = [
      {
        salesItemsId: itemToEdit.salesItemsId,
        returnQuantity: itemToEdit.returnQuantity,
        returnUnitPrice: itemToEdit.returnUnitPrice,
        returnTotalAmount: itemToEdit.returnTotalAmount,
        itemsId: itemToEdit.itemsId,
      },
    ];
    setFields(updatedFields);
    form.setValue(`SalesReturnItems.0.salesItemsId`, selectedSalesId);
    form.setValue(
      `SalesReturnItems.0.returnQuantity`,
      itemToEdit.returnQuantity
    );
    form.setValue(
      `SalesReturnItems.0.returnUnitPrice`,
      Number(itemToEdit.returnUnitPrice)
    );
    form.setValue(
      `SalesReturnItems.0.returnTotalAmount`,
      itemToEdit.returnTotalAmount
    );
    form.setValue(`SalesReturnItems.0.itemsId`, itemToEdit.itemsId);
    if (itemName) setSearchTermsForItems({ 0: itemName?.name });
    setItemQuantity({ 0: itemToEdit.returnQuantity });
    setItemPrice({ 0: itemToEdit.returnUnitPrice });
    setItemAmount({ 0: Number(itemToEdit.returnTotalAmount) });
  };

  const handleSalesDetailsSelect = (itemId: string) => {
    form.setValue("salesDetailsId", itemId);
    setSelectedSalesId(itemId);
  };
  useEffect(() => {
    if (SalesData) {
      setAddedItems(
        SalesData?.salesItems?.map((item) => ({
          salesItemsId: item.id ?? "",
          returnQuantity: item.quantity,
          returnUnitPrice: item.price,
          returnTotalAmount: Number(item.amount),
          itemsId: item.itemId ?? "",
        }))
      );
      const newTotalAmount = SalesData.salesItems.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);

      const newTaxableAmount =
        newTotalAmount - (Number(SalesData.discountAmount) || 0);
      setNetAmount(
        newTaxableAmount +
          newTaxableAmount * ((Number(SalesData?.vatPercent) || 0) / 100)
      );
      setVat(Number(SalesData.vatPercent));
    }
  }, [SalesData, selectedSalesId]);

  useEffect(() => {
    form.setValue("SalesReturnItems", addedItems);
  }, [addedItems]);

  const handleAddToTable = useCallback(
    (index: number) => {
      const currentItem = fields[index];
      if (
        !currentItem.itemsId ||
        !currentItem.returnQuantity ||
        !currentItem.returnTotalAmount
      ) {
        Toast.error("Please fill all item fields");
        return;
      }
      const item = allItems?.Items.find((i) => i.id === currentItem.itemsId);
      if (!item) {
        Toast.error("Item does not exist");
        return;
      }
      if (editingIndex !== null) {
        const updatedItems = [...addedItems];
        updatedItems[editingIndex] = {
          itemsId: currentItem.itemsId,
          salesItemsId: currentItem.salesItemsId,
          returnQuantity: currentItem.returnQuantity,
          returnUnitPrice: currentItem.returnUnitPrice,
          returnTotalAmount: currentItem.returnTotalAmount,
        };
        setAddedItems(updatedItems);
        const newTotalAmount = updatedItems.reduce(
          (sum, item) => sum + Number(item.returnTotalAmount || 0),
          0
        );
        setTotalAmount(newTotalAmount);
        const newTaxableAmount =
          newTotalAmount - (Number(SalesData?.discountAmount) || 0);
        setNetAmount(
          newTaxableAmount +
            newTaxableAmount * ((Number(SalesData?.vatPercent) || 0) / 100)
        );
        setEditingIndex(null);
      } else {
        const updatedAddedItems = [...addedItems];
        {
          updatedAddedItems.push({
            salesItemsId: currentItem.salesItemsId,
            itemsId: currentItem.itemsId,
            returnQuantity: currentItem.returnQuantity,
            returnUnitPrice: currentItem.returnUnitPrice,
            returnTotalAmount: currentItem.returnTotalAmount,
          });
        }
        setAddedItems(updatedAddedItems);
        const newTotalAmount = updatedAddedItems.reduce(
          (sum, item) => sum + Number(item.returnTotalAmount || 0),
          0
        );
        setTotalAmount(newTotalAmount);
        const newTaxableAmount =
          newTotalAmount - (Number(SalesData?.discountAmount) || 0);
        setNetAmount(
          newTaxableAmount +
            newTaxableAmount * ((Number(SalesData?.vatPercent) || 0) / 100)
        );
      }

      const updatedFields = [
        {
          salesItemsId: "",
          returnQuantity: 0,
          returnUnitPrice: 0,
          returnTotalAmount: 0,
          itemsId: "",
        },
      ];
      form.setValue("SalesReturnItems", updatedFields);
      setFields(updatedFields);
      setIsEditingLoading(false);
      setSearchTermsForItems({ 0: "" });
      setItemQuantity({ 0: 0 });
      setItemAmount({ 0: 0 });
      setItemPrice({ 0: 0 });
    },
    [fields, allItems?.Items, editingIndex, form, addedItems]
  );

  useEffect(() => {
    if (totalAmount && netAmount) {
      form.setValue("netReturnAmount", netAmount);
      form.setValue("totalReturnAmount", totalAmount);
      form.setValue("taxAdjustment", vat);
    }
  }, [totalAmount]);

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsEditingLoading(false);

    const resetFields = fields.map(() => ({
      salesItemsId: "",
      returnQuantity: 0,
      returnUnitPrice: 0,
      returnTotalAmount: 0,
      itemsId: "",
    }));

    setFields(resetFields);
    form.reset();

    setSearchTermsForItems({});
    setItemQuantity({});
    setItemPrice({});
    setItemAmount({});
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleDelete = (index: number) => {
    const newAmount = totalAmount - addedItems[index].returnTotalAmount;
    setTotalAmount(newAmount);
    const updatedItems = addedItems.filter((_, i) => i !== index);
    setAddedItems(updatedItems);
  };

  const handleSelectPayment = (ledgerId: string) => {
    form.setValue("paymentId", ledgerId);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[65%] bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("Add Sales Return")}
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="hover:scale-110 transition"
          >
            <img src={close} alt="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {salesDetailsData && (
                <AppCombobox
                  ref={refForInput}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Sales Reference Number"
                  required
                  options={salesDetailsData.Items}
                  value={selectedRefId}
                  selected={
                    salesDetailsData.Items.find(
                      (g) => g.referenceNumber === selectedRefId
                    ) || null
                  }
                  onSelect={(group) => {
                    if (group) {
                      setSelectedRefId(group.referenceNumber || "");
                      handleSalesDetailsSelect(group.id || "");
                    } else {
                      setSelectedRefId("");
                    }
                  }}
                  getLabel={(g) => g?.referenceNumber ?? ""}
                  getValue={(g) => g?.referenceNumber ?? ""}
                />
              )}
            </div>
            <div>
              <InputElement
                label="Return Date"
                form={form}
                defaultValue={""}
                name="returnDate"
                inputType="date"
                placeholder="Return Date"
              />
            </div>
            <div className="grid grid-cols-1">
              <PeerInput
                disabled
                name="netReturnAmount"
                label="Net Return Amount"
                value={netAmount}
                onChange={() => {
                  form.setValue("netReturnAmount", netAmount ? netAmount : 0);
                }}
                placeholder="Net Return Amount"
              />
            </div>
            <div>
              <InputElement
                label="Reason"
                form={form}
                name="reason"
                placeholder="Reason for Return"
              />
            </div>
            <div>
              <AppCombobox
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Payment"
                required
                options={allPayment?.Items}
                value={paymentId}
                selected={
                  allPayment?.Items.find((g) => g.id === paymentId) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setPaymentId(group.id || "");
                    handleSelectPayment(group.id || "");
                  } else {
                    setPaymentId("");
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
            </div>
            {t("Total Amount")} :{totalAmount}
          </div>
          <div>
            <div>
              <div>
                <h2>{t("Sales Items")}</h2>
              </div>
              <div className="overflow-y-auto h-[6rem] mb-2 relative">
                {fields.map((_ev, index) => (
                  <div key={index} className="">
                    <div
                      ref={(el) => (blockRefs.current[0] = el)}
                      className="flex"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 w-[92%]">
                        <div className="grid grid-cols-1 mt-3">
                          <PeerInput
                            disabled
                            label="Item"
                            inputType="text"
                            value={searchTermsForItems[0] || ""}
                            placeholder="Enter or Select Item"
                            onChange={() => {
                              return;
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 mt-3">
                          <PeerInput
                            label="Quantity"
                            onChange={(e) => {
                              const quantity = Number(e.target.value);
                              setItemQuantity((prev) => ({
                                ...prev,
                                [index]: quantity,
                              }));
                              if (quantity > stock) {
                                Toast.error("Cannot return more than salesd");
                                return;
                              }
                              const newAmount = itemPrice[index] * quantity;
                              setItemAmount({ 0: newAmount });
                              setFields((prev) => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  returnQuantity: quantity,
                                  returnTotalAmount: newAmount,
                                };
                                return updated;
                              });
                              form.setValue(
                                `SalesReturnItems.${index}.returnQuantity`,
                                quantity
                              );
                              form.setValue(
                                `SalesReturnItems.${index}.returnTotalAmount`,
                                newAmount
                              );
                            }}
                            value={itemQuantity[index]}
                            inputType="text"
                            placeholder="Quantity"
                          />
                        </div>
                        <div className="grid grid-cols-1 mt-3">
                          <PeerInput
                            disabled
                            label="Price"
                            value={itemPrice[index]}
                            name={`SalesReturnItems.${index}.returnUnitPrice`}
                            inputType="number"
                            onChange={() => {
                              return;
                            }}
                            placeholder="Rate"
                          />
                        </div>
                        <div className="grid grid-cols-1 mt-3">
                          <PeerInput
                            disabled
                            label="Amount"
                            inputType="text"
                            placeholder="Amount"
                            onChange={() => {
                              return;
                            }}
                            value={itemAmount[index]}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[15%] right-0 mt-2 gap-2">
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
                ))}
              </div>
            </div>
            {isFetching ? (
              <div className="fixed ml-60 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <ClipLoader color="#36d7b7" size={50} />
              </div>
            ) : (
              <div>
                {addedItems.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">{t("Sales Items")}</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="p-2 border text-left">{t("SN")}</th>
                            <th className="p-2 border text-left">
                              {t("Sales Items")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Quantity")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Rate")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Amount")}
                            </th>
                            <th className="p-2 border text-center">
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-100">
                              <td className="p-2 border">{idx + 1}</td>
                              <td className="p-2 border">
                                <ItemName itemId={item.itemsId} />
                              </td>
                              <td className="p-2 border">
                                {item.returnQuantity}
                              </td>
                              <td className="p-2 border">
                                {item.returnUnitPrice}
                              </td>
                              <td className="p-2 border">
                                {item.returnTotalAmount}
                              </td>
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
            )}
          </div>
          <div className="flex justify-end mt-6">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                text={isSubmitting ? "Submitting..." : "Submit"}
                type="submit"
                className="!px-6 !py-2 !text-base"
              />
            </ThemeProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesReturnForm;
