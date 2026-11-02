import { IPurchase, IPurchaseItems } from "../types/Ipurchase";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import {
  useAddPurchase,
  useGetBillNumberGeneration,
  useGetReferenceNumberForPurchase,
  useGetTaxForPurchase,
} from "../hooks/index";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import Addition from "@/assets/square-plus-solid.svg";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, useRef } from "react";
import { useGetAllUnits } from "@/modules/end-user/Inventory/Units/hooks";
import {
  useGetAllItem,
  useGetItemById,
} from "@/modules/end-user/Inventory/Item/hooks";
import { ToWords } from "to-words";
import {
  useGetAllInventory,
  useGetRemainingQty,
} from "@/modules/end-user/Inventory/InventoryLedger/hooks";
import Add from "@/modules/end-user/Inventory/Item/pages/Add";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import AddP from "@/modules/end-user/Payments/PaymentMethod/pages/Add";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import { useCallback } from "react";
import { AppCombobox } from "@/components/common/ComboBox";
import { PeerInput } from "@/components/common/PeerInput";
import { useGetAllPaymentMethod } from "@/modules/end-user/Payments/PaymentMethod/hooks";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import { useTranslation } from "react-i18next";
import { LedgerBalance } from "@/modules/end-user/account/ledger/components/GetBalance";
import { useHotkeys } from "react-hotkeys-hook";
import { useGetAllParties } from "@/modules/end-user/account/parties/hooks";
type Props = {
  form: UseFormReturn<IPurchase>;
  onClose: () => void;
};

const stackTokens: IStackTokens = { childrenGap: 10 };

const AddPurchaseForm = ({ form, onClose }: Props) => {
  const { t } = useTranslation();
  const toWords = new ToWords();
  const addPurchase = useAddPurchase();
  const [itemIsAdded, setItemIsAdded] = useState(false);
  const [fields, setFields] = useState<
    {
      quantity: number;
      unitId: string;
      itemId: string;
      price: number;
      amount: number;
      serialNumbers?: string[];
    }[]
  >([
    {
      quantity: 0,
      unitId: "",
      itemId: "",
      price: 0,
      amount: 0,
      serialNumbers: [],
    },
  ]);
  const [addedItems, setAddedItems] = useState<
    {
      itemId: string;
      itemName: string;
      unitId: string;
      unitName: string;
      quantity: number;
      price: number;
      amount: number;
      isOn: boolean;
      serialNumbers?: string[];
    }[]
  >([]);
  const [serialNumbers, setSerialNumbers] = useState<{
    [key: number]: string[];
  }>({});
  const [openSerialModal, setOpenSerialModal] = useState<{
    [key: number]: boolean;
  }>({});
  const { data: allParties } = useGetAllParties();
  const { data: allPayment } = useGetAllPaymentMethod();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();
  const { refetch } = useGetAllInventory();
  const companyId = localStorage.getItem("companyId");
  const [isOpen] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIdForPayment, setSelectedIdForPayment] = useState("");
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const { data: billGeneration } = useGetBillNumberGeneration(companyId);
  const { data: referenceNumber } = useGetReferenceNumberForPurchase(companyId);
  const { data: purchaseTax } = useGetTaxForPurchase(companyId);
  const { data: unitsData } = useGetAllUnits();
  const query = `?pageSize=1000&pageIndex=1&IsPagination=false`;
  const { data: allItems, refetch: refetchItems } = useGetAllItem(query);
  const [itemId, setItemId] = useState<string>("");
  const { data: remainingQty } = useGetRemainingQty(itemId);
  const [hasSerial, setHasSerial] = useState(false);
  const [itemCostPrice, setItemCostPrice] = useState<number | null>();
  const [showAddPaymentForm, setshowAddPaymentForm] = useState(false);
  const [itemOpeningStock, setItemOpeningStock] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOn, setIsOn] = useState(true);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const [amounts, setAmounts] = useState<number | null>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const { data: items, refetch: refetchInventory } = useGetAllInventory();
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const { data: itemsData } = useGetItemById(itemId);
  const [totalDiscountPercent, setTotalDiscountPercent] = useState("");
  const [totalVatAmount, setTotalVatAmount] = useState<string | null>("");
  const [totalDiscountAmount, setTotalDiscountAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const showTax = purchaseTax?.showTaxInPurchase;
  const handleSelectedUnit = (
    index: number,
    selectedUnit: { id: string; name: string }
  ) => {
    form.setValue(`PurchaseItems.${index}.unitId`, selectedUnit.id);
  };

  const handleSelectItem = (selectedItem: { itemId: string }) => {
    setItemId(selectedItem.itemId);
  };

  const handleSelectLedgerForPayment = (ledgerId: string) => {
    form.setValue("paymentId", ledgerId);
  };
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerId", ledgerId);
  };

  const handleEdit = (index: number) => {
    const itemToEdit = addedItems[index];
    setIsItemSelected(true);
    setSerialNumbers(() => ({
      [0]: itemToEdit.serialNumbers ?? [],
    }));
    const item = allItems?.Items.find((i) => i.id === itemToEdit.itemId);
    if (!item) {
      Toast.error("Item to edit does not exist");
      return;
    }
    setEditingIndex(index);
    setIsEditingLoading(true);
    setItemId(itemToEdit.itemId);
    const updatedFields = [
      {
        itemId: itemToEdit.itemId,
        unitId: itemToEdit.unitId,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
        amount: itemToEdit.amount,
        serialNumbers: itemToEdit.serialNumbers,
      },
    ];
    setFields(updatedFields);
    form.setValue(`PurchaseItems.0.itemId`, itemToEdit.itemId);
    form.setValue(`PurchaseItems.0.unitId`, itemToEdit.unitId);
    form.setValue(`PurchaseItems.0.quantity`, Number(itemToEdit.quantity));
    form.setValue(`PurchaseItems.0.price`, itemToEdit.price);
    form.setValue(`PurchaseItems.0.amount`, itemToEdit.amount);
    setSelectedItemId(itemToEdit.itemId);
    setSelectedUnitId(itemToEdit.unitId);
    setItemOpeningStock({ 0: `${itemToEdit.quantity}` });
    setItemCostPrice(itemToEdit.price);
    setAmounts(Number(itemToEdit.amount));
    setIsOn(itemToEdit.isOn);
  };
  const handleClose = () => {
    setAddedItems([]);
    setTotalAmount(0);
    setGrandTotal("0");
    setTotalVatAmount(null);
    setTotalDiscountAmount("");
    setTotalDiscountPercent("");
    setTotalTaxableAmount(0);
    onClose();
    const resetFields = fields.map(() => ({
      quantity: 0,
      unitId: "",
      itemId: "",
      price: 0,
      amount: 0,
      serialNumbers: [],
    }));
    setFields(resetFields);
    form.reset();
    setSelectedIdForPayment("");
    setSelectedLedgerId("");
    setSelectedItemId("");
    setSelectedUnitId("");
    setItemOpeningStock({});
    setItemCostPrice(null);
    setEditingIndex(null);
    setIsEditingLoading(false);
    setAmounts(null);
    setIsOn(true);
    setIsToggleDisabled(false);
    setSerialNumbers([]);
  };
  const handleAddToTable = useCallback(
    (index: number) => {
      const currentItem = fields[index];
      console.log(currentItem);
      if (!currentItem.itemId || !currentItem.unitId || !currentItem.quantity) {
        Toast.error("Please fill all item fields");
        return;
      }

      const item = allItems?.Items.find((i) => i.id === currentItem.itemId);
      if (!item) {
        Toast.error("Item does not exist");
        return;
      }

      const serials = serialNumbers[index] || [];
      if (hasSerial) {
        if (serials.length !== currentItem.quantity) {
          Toast.error(
            "Please provide ${currentItem.quantity} serial number(s)"
          );
          return;
        }
        if (serials.some((serial) => !serial.trim())) {
          Toast.error("All serial numbers must be filled");
          return;
        }
      }
      const unit = unitsData?.Items.find((u) => u.id === currentItem.unitId);
      if (!unit) {
        Toast.error("Unit details not found");
        return;
      }
      const discountedPrice = isOn
        ? currentItem.price
        : currentItem.price - (13 / 100) * currentItem.price;
      if (editingIndex !== null) {
        const updatedItems = [...addedItems];
        updatedItems[editingIndex] = {
          itemId: currentItem.itemId,
          itemName: item.name,
          unitId: currentItem.unitId,
          unitName: unit.name,
          quantity: currentItem.quantity,
          price: discountedPrice,
          amount: currentItem.amount,
          isOn,
          serialNumbers: serials,
        };
        const newTotalAmount = updatedItems.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        setTotalAmount(newTotalAmount);
        setAddedItems(updatedItems);
        setEditingIndex(null);
      } else {
        const updatedAddedItems = [...addedItems];
        const existingItemIndex = updatedAddedItems.findIndex(
          (addedItem) =>
            addedItem.itemId === currentItem.itemId && addedItem.isOn === isOn
        );
        if (existingItemIndex !== -1) {
          updatedAddedItems[existingItemIndex] = {
            ...updatedAddedItems[existingItemIndex],
            quantity:
              updatedAddedItems[existingItemIndex].quantity +
              currentItem.quantity,
            amount:
              updatedAddedItems[existingItemIndex].amount + currentItem.amount,
            serialNumbers: [
              ...(updatedAddedItems[existingItemIndex].serialNumbers ?? []),
              ...serials,
            ],
          };
        } else {
          updatedAddedItems.push({
            itemId: currentItem.itemId,
            itemName: item.name,
            unitId: currentItem.unitId,
            unitName: unit.name,
            quantity: currentItem.quantity,
            price: discountedPrice,
            amount: currentItem.amount,
            isOn,
            serialNumbers: serials,
          });
        }
        const newTotalAmount = updatedAddedItems.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        setTotalAmount(newTotalAmount);
        setTotalVatAmount(
          showTax ? `${(13 / 100) * Number(totalTaxableAmount)}` : null
        );
        setAddedItems(updatedAddedItems);
      }

      const updatedFields = [
        {
          quantity: 0,
          unitId: "",
          itemId: "",
          price: 0,
          amount: 0,
          serialNumbers: [""],
        },
      ];
      setFields(updatedFields);
      form.setValue("PurchaseItems", updatedFields);
      const resetFields = fields.map(() => ({
        quantity: 0,
        unitId: "",
        itemId: "",
        price: 0,
        amount: 0,
        serialNumbers: [],
      }));
      setFields(resetFields);
      setItemId("");
      setIsEditingLoading(false);
      setSelectedItemId("");
      setSelectedUnitId("");
      setItemOpeningStock({ 0: "" });
      setItemCostPrice(null);
      setSerialNumbers({ 0: [] });
      setOpenSerialModal({ 0: false });
      setIsToggleDisabled(true);
      setIsItemSelected(false);
      setAmounts(null);
    },
    [
      totalAmount,
      fields,
      allItems?.Items,
      serialNumbers,
      hasSerial,
      unitsData?.Items,
      isOn,
      editingIndex,
      form,
      addedItems,
    ]
  );
  useEffect(() => {
    if (totalAmount) {
      const totalVat = showTax
        ? `${(13 / 100) * Number(totalTaxableAmount)}`
        : null;
      setTotalVatAmount(totalVat);
      form.setValue("vatAmount", totalVat);
    }
  }, [totalAmount, totalTaxableAmount]);

  useEffect(() => {
    if (totalAmount && totalDiscountPercent) {
      const totalDiscount = `${
        (Number(totalDiscountPercent) / 100) * Number(totalAmount)
      }`;
      setTotalDiscountAmount(totalDiscount);
      form.setValue("discountAmount", totalDiscount);
    }
  }, [totalAmount, totalDiscountPercent]);

  useEffect(() => {
    if (totalAmount) {
      const taxableAmount = totalAmount - (Number(totalDiscountAmount) || 0);
      setTotalTaxableAmount(taxableAmount);
    }
  }, [totalAmount, totalDiscountAmount]);
  const onSubmit: SubmitHandler<IPurchase> = useCallback(
    async (data) => {
      if (editingIndex !== null) {
        Toast.error("Please finish editing the item before submitting");
        return;
      }
      if (
        !data.referenceNumber &&
        referenceNumber?.showReferenceNumberForPurchase
      ) {
        Toast.error("Reference Number is required");
        return;
      }
      if (addedItems.length === 0) {
        Toast.error("At least one item is required");
        return;
      }
      for (const item of addedItems) {
        if (!allItems?.Items.find((i) => i.id === item.itemId)) {
          Toast.error("Item with ID ${item.itemId} does not exist");
          return;
        }
      }

      const filteredPurchaseItems: IPurchaseItems[] = addedItems.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ isOn, itemName, unitName, ...rest }) => ({
          itemId: rest.itemId,
          unitId: rest.unitId,
          quantity: rest.quantity,
          price: rest.price,
          amount: rest.amount,
          serialNumbers: rest.serialNumbers,
        })
      );
      const updatedData: IPurchase = {
        ledgerId: data.ledgerId,
        paymentId: selectedIdForPayment,
        date: data.date,
        referenceNumber: data.referenceNumber,
        billNumber: data.billNumber,
        PurchaseItems: filteredPurchaseItems,
        vatPercent: showTax ? "13" : null,
        vatAmount: totalVatAmount,
        discountPercent: totalDiscountPercent,
        discountAmount: totalDiscountAmount,
        grandTotalAmount: Number(grandTotal),
        amountInWords: toWords.convert(Number(grandTotal)),
        id: data.id || "",
      };

      const sanitizedData = Object.fromEntries(
        Object.entries(updatedData).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      ) as IPurchase;
      try {
        setIsSubmitting(true);
        await addPurchase.mutateAsync(sanitizedData);
        Toast.success("Successfully added PurchaseDetails");
        refetch();
        form.reset();
        setAddedItems([]);
        setTotalAmount(0);
        setGrandTotal("");
        setTotalDiscountPercent("");
        setSerialNumbers({ 0: [] });
        setOpenSerialModal({ 0: false });
        setIsToggleDisabled(false);
        handleClose();
      } catch (error: AxiosError | unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || "Failed to add PurchaseDetails"
            : "Failed to add PurchaseDetails";
        Toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      refetch,
      selectedIdForPayment,
      totalDiscountAmount,
      totalDiscountPercent,
      totalVatAmount,
      editingIndex,
      referenceNumber?.showReferenceNumberForPurchase,
      addedItems,
      grandTotal,
      toWords,
      addPurchase,
      form,
      allItems,
    ]
  );

  const handleDelete = (index: number) => {
    const newAmount = totalAmount - addedItems[index].amount;
    setTotalAmount(newAmount);
    const updatedItems = addedItems.filter((_, i) => i !== index);
    setAddedItems(updatedItems);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsEditingLoading(false);

    const resetFields = fields.map(() => ({
      quantity: 0,
      unitId: "",
      itemId: "",
      price: 0,
      amount: 0,
      serialNumbers: [],
    }));

    setFields(resetFields);
    form.reset();
    setSelectedItemId("");
    setSelectedUnitId("");
    setItemOpeningStock({});
    setItemCostPrice(null);
    setAmounts(null);
    setIsOn(false);
  };

  const handleOpenAddItemForm = (e: React.MouseEvent) => {
    setItemIsAdded(true);
    e.preventDefault();
    e.stopPropagation();
    setShowAddItemForm(true);
  };

  const handleCloseAddItemForm = () => {
    setShowAddItemForm(false);
    setItemIsAdded(false);
  };

  const handleOpenAddLedgerForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddLedgerForm(true);
  };

  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false);
  };

  const handleOpenAddPaymentForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setshowAddPaymentForm(true);
  };
  const handleCloseAddPaymentForm = () => {
    setshowAddPaymentForm(false);
  };
  const handleIsOn = (
    _ev: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ) => {
    if (!isToggleDisabled) {
      setIsOn(!!checked);
    }
  };

  useEffect(() => {
    if (isItemSelected === true && itemsData && !isEditingLoading) {
      if (itemsData.hasSerial) setHasSerial(itemsData.hasSerial);
      const costPrice = Number(itemsData.costPrice);
      setItemCostPrice(costPrice);
      setItemOpeningStock((prev) => ({
        ...prev,
        [0]: "1",
      }));
    }
  }, [itemsData, isItemSelected, items]);

  useEffect(() => {
    if (
      isItemSelected &&
      itemsData &&
      itemCostPrice !== undefined &&
      itemOpeningStock[0] !== undefined
    ) {
      const costPrice = itemCostPrice;
      const quantity = Number(itemOpeningStock[0]);
      const updatedFields = [...fields];
      if (costPrice) {
        updatedFields[0] = {
          itemId: itemsData.id,
          unitId: itemsData.unitId,
          price: costPrice,
          quantity,
          amount: costPrice * quantity,
          serialNumbers: [],
        };
        setSelectedUnitId(itemsData.unitId);
        setFields(updatedFields);
        setAmounts(costPrice * quantity);
      }
    }
  }, [
    itemCostPrice,
    itemOpeningStock,
    items,
    isItemSelected,
    unitsData,
    itemsData,
  ]);

  useEffect(() => {
    if (!isNaN(totalAmount)) {
      const grandTotal = totalTaxableAmount + (Number(totalVatAmount) || 0);
      setGrandTotal(`${grandTotal}`);
      form.setValue("grandTotalAmount", Number(grandTotal));
      form.setValue("amountInWords", toWords.convert(Number(grandTotal)));
    } else {
      setGrandTotal(`1`);
    }
  }, [
    totalAmount,
    showTax,
    setTotalDiscountAmount,
    form,
    grandTotal,
    totalTaxableAmount,
  ]);

  const [newAddedItemName, setNewAddedItemName] = useState("");
  const handleNewItemAdded = async (itemName: string) => {
    setNewAddedItemName(itemName);
    handleCloseAddItemForm();
  };
  useEffect(() => {
    if (newAddedItemName) {
      refetchInventory();
      refetchItems();
    }
  }, [newAddedItemName]);

  useEffect(() => {
    if (!newAddedItemName || !items || !allItems) return;
    const nameMatch = allItems.Items.find(
      (item) => item.name === newAddedItemName
    );
    if (!nameMatch) return;
    const addedItem = items.Items.find((item) => item.itemId === nameMatch.id);
    if (addedItem) {
      setIsItemSelected(true);
      handleSelectItem(addedItem);
      setNewAddedItemName("");
    }
  }, [items, allItems, newAddedItemName]);
  const inputRefForLedger = useRef<HTMLInputElement>(null);
  const inputRefForPayment = useRef<HTMLInputElement>(null);
  const inputRefForItem = useRef<HTMLInputElement>(null);
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
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
  useHotkeys(
    "alt+n",
    () => {
      if (document.activeElement === inputRefForItem.current) {
        setShowAddItemForm(true);
        inputRefForItem.current?.blur();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
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
  useHotkeys(
    "esc",
    (event) => {
      if (showAddLedgerForm) {
        event.preventDefault();
        setShowAddLedgerForm(false);
      }
    },
    {
      enabled: showAddLedgerForm,
      preventDefault: true,
    }
  );
  useHotkeys(
    "esc",
    (event) => {
      if (showAddItemForm) {
        event.preventDefault();
        setShowAddItemForm(false);
      }
    },
    {
      enabled: showAddItemForm,
      preventDefault: true,
    }
  );
  useHotkeys(
    "esc",
    (event) => {
      if (showAddPaymentForm) {
        event.preventDefault();
        setshowAddPaymentForm(false);
      }
    },
    {
      enabled: showAddPaymentForm,
      preventDefault: true,
    }
  );

  useHotkeys(
    "esc",
    (event) => {
      if (!showAddLedgerForm && !showAddItemForm && !showAddPaymentForm) {
        event.preventDefault();
        handleClose();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  if (!isOpen) return null;

  return (
    <div className=" inset-0 flex items-center justify-center pt-5 w-full h-full">
      <div className="w-[88%]  h-[100%] bg-white p-4 overflow-auto relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <fieldset disabled={isSubmitting} className="h-full ">
            <div className="h-[90%]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">{t("Add Purchase")}</h1>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-red-400 text-2xl hover:text-red-500"
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mt-[-1%]">
                  <InputElement
                    label="Date"
                    form={form}
                    name="date"
                    inputType="date"
                    placeholder="Enter Date"
                  />
                </div>

                {billGeneration?.BillNumberGenerationType === 0 && (
                  <div className="mt-[-1%]">
                    <InputElement
                      required
                      label="Bill No"
                      form={form}
                      ref={refForInput}
                      name="billNumber"
                      placeholder="Enter Bill Number"
                    />
                  </div>
                )}

                {referenceNumber?.showReferenceNumberForPurchase === true && (
                  <div className="mt-[-1%]">
                    <InputElement
                      label="Reference Number"
                      form={form}
                      name="referenceNumber"
                      placeholder="Enter Reference Number"
                    />
                  </div>
                )}

                <div className="mt-[-15px] sm:mt-[-1px] md:mt-[-12px] lg:mt-[-28px] xl:mt-[-33px] ">
                  <button
                    type="button"
                    onClick={handleOpenAddLedgerForm}
                    className="text-red-500 hover:text-red-700 sm:p-0 flex cursor-pointer"
                  >
                    <img
                      src={Addition}
                      alt="Add Item"
                      className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
                    />
                  </button>
                  <div className="mt-3">
                    <AppCombobox
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Ledger"
                      required
                      ref={inputRefForLedger}
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
                          handleSelectLedger(group.id || "");
                        } else {
                          setSelectedLedgerId("");
                        }
                      }}
                      getLabel={(g) => g?.name ?? ""}
                      getValue={(g) => g?.id ?? ""}
                      renderOptionExtra={(g) => (
                        <div>
                          {
                            AllLedgerGroup?.Items.find(
                              (val) => val.id === g?.ledgerGroupId
                            )?.name
                          }
                        </div>
                      )}
                    />

                    {selectedLedgerId && (
                      <LedgerBalance ledgerId={selectedLedgerId} />
                    )}
                  </div>
                </div>

                <div className="mt-[-15px] sm:mt-[-1px] md:mt-[-12px] lg:mt-[-28px] xl:mt-[-3px] ">
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
                  <div className="mt-3">
                    <AppCombobox
                      value={selectedIdForPayment}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Payment"
                      required
                      ref={inputRefForPayment}
                      options={allPayment?.Items}
                      selected={
                        allPayment?.Items.find(
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
                <div className="flex items-center mb-4">
                  <h2 className="font-semibold">{t("Purchase Items")}</h2>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleOpenAddItemForm}
                      className="text-red-500 hover:text-red-700 p-2 sm:p-0"
                    >
                      <img
                        src={Addition}
                        alt="Add Item"
                        className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
                      />
                    </button>
                  </div>
                  <div className="flex">
                    <p className="ml-2 ">
                      {t("Remaining Qty")} : {remainingQty?.RemainingQuantity}
                    </p>
                  </div>
                </div>

                <div className="overflow-y-auto h-[6rem] mb-2 relative">
                  {fields.map((_ev, index) => (
                    <div key={index} className=" w-[90%] h-full">
                      <div className="flex w-full h-full items-center ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center gap-3 w-full">
                          <div>
                            {items && (
                              <AppCombobox
                                dropDownWidth="w-[11.4rem]"
                                dropdownPositionClass="fixed"
                                label="Items"
                                required
                                ref={inputRefForItem}
                                defaultValue={selectedItemId ?? null}
                                options={items.Items}
                                selected={
                                  items.Items.find(
                                    (g) => g.itemId === selectedItemId
                                  ) || null
                                }
                                onSelect={(group) => {
                                  if (group) {
                                    setSelectedItemId(group.itemId);
                                    handleSelectItem(group);
                                    setIsItemSelected(true);
                                  } else {
                                    setSelectedItemId("");
                                  }
                                }}
                                getLabel={(g) => g?.itemNames ?? ""}
                                getValue={(g) => g?.itemId ?? ""}
                              />
                            )}
                          </div>
                          <div className="  relative">
                            <AppCombobox
                              dropDownWidth="w-[11.4rem]"
                              dropdownPositionClass="fixed"
                              label="Units"
                              options={unitsData?.Items}
                              defaultValue={selectedUnitId}
                              selected={
                                unitsData?.Items.find(
                                  (g) => g.id === selectedUnitId
                                ) || null
                              }
                              onSelect={(group) => {
                                if (group) {
                                  setSelectedUnitId(group.id);
                                  handleSelectedUnit(index, group);
                                  setIsItemSelected(true);
                                } else {
                                  setSelectedUnitId("");
                                }
                              }}
                              getLabel={(g) => g?.name ?? ""}
                              getValue={(g) => g?.id ?? ""}
                            />
                          </div>

                          <div className="relative mt-1">
                            <PeerInput
                              label="Quantity"
                              onChange={(e) => {
                                const quantity = Number(e.target.value);
                                form.setValue(
                                  `PurchaseItems.${index}.quantity`,
                                  quantity
                                );
                                setIsItemSelected(true);
                                const newAmount =
                                  Number(itemCostPrice) * quantity;
                                setItemOpeningStock((prev) => ({
                                  ...prev,
                                  [index]: `${quantity}`,
                                }));
                                setAmounts(newAmount);
                                form.setValue(
                                  `PurchaseItems.${index}.amount`,
                                  newAmount
                                );
                              }}
                              value={itemOpeningStock[index] || ""}
                              inputType="number"
                              name={`PurchaseItems.${index}.quantity`}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="grid grid-cols-1">
                            <div className="relative top-[-16%]">
                              <div className="flex justify-center ml-12">
                                <Stack tokens={stackTokens}>
                                  <Toggle
                                    inlineLabel
                                    onText="Exclusive"
                                    offText="Inclusive"
                                    onChange={handleIsOn}
                                    disabled={isToggleDisabled}
                                    checked={isOn}
                                  />
                                </Stack>
                              </div>
                              <PeerInput
                                label="Rate"
                                onChange={(e) => {
                                  const price = Number(e.target.value);
                                  form.setValue(
                                    `PurchaseItems.${index}.price`,
                                    price
                                  );
                                  setIsItemSelected(true);
                                  setItemCostPrice(price);
                                  const newAmount =
                                    Number(itemOpeningStock[index]) * price;

                                  setAmounts(newAmount);
                                  form.setValue(
                                    `PurchaseItems.${index}.amount`,
                                    newAmount
                                  );
                                  // form.setValue();
                                }}
                                value={itemCostPrice ?? ""}
                                name={`PurchaseItems.${index}.price`}
                                inputType="text"
                                placeholder="Rate"
                              />
                            </div>
                          </div>
                          <div className="mt-1">
                            <PeerInput
                              onChange={() =>
                                form.setValue(
                                  `PurchaseItems.${index}.amount`,
                                  Number(amounts)
                                )
                              }
                              label="Amount"
                              disabled
                              inputType="text"
                              placeholder="Amount"
                              value={amounts ?? ""}
                            />
                          </div>
                        </div>
                      </div>
                      {openSerialModal[index] && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
                          <div className="bg-white p-4 rounded-lg w-[30%]">
                            <h3 className="font-semibold mb-2">
                              {t("Enter")} {fields[index].quantity}{" "}
                              {t("Serial Number")}
                            </h3>
                            {Array.from({
                              length: fields[index].quantity,
                            }).map((_, i) => (
                              <input
                                key={i}
                                type="text"
                                placeholder={`Serial ${i + 1}`}
                                value={serialNumbers[index]?.[i] || ""}
                                onChange={(e) => {
                                  const newSerials = [
                                    ...(serialNumbers[index] || []),
                                  ];
                                  newSerials[i] = e.target.value.trim();
                                  setSerialNumbers((prev) => ({
                                    ...prev,
                                    [index]: newSerials,
                                  }));
                                  form.setValue(
                                    `PurchaseItems.${index}.serialNumbers`,
                                    newSerials
                                  );
                                }}
                                className="w-full p-1 border rounded mb-2"
                              />
                            ))}
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditingLoading(false);
                                  setEditingIndex(null);
                                  const resetFields = fields.map(() => ({
                                    quantity: 0,
                                    unitId: "",
                                    itemId: "",
                                    price: 0,
                                    amount: 0,
                                    serialNumbers: [],
                                  }));

                                  setFields(resetFields);
                                  setSelectedItemId("");
                                  setItemId("");
                                  setSelectedUnitId("");
                                  setItemOpeningStock({});
                                  setHasSerial(false);
                                  setItemCostPrice(null);
                                  setAmounts(null);
                                  setOpenSerialModal((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                  setSerialNumbers((prev) => ({
                                    ...prev,
                                    [index]: [],
                                  }));

                                  form.setValue(
                                    `PurchaseItems.${index}.serialNumbers`,
                                    []
                                  );
                                }}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                {t("Cancel")}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditingLoading(false);
                                  setEditingIndex(null);
                                  const serials = serialNumbers[index] || [];
                                  if (
                                    serials.length !== fields[index].quantity
                                  ) {
                                    Toast.error(
                                      `Please provide ${fields[index].quantity} serial number(s)`
                                    );
                                    return;
                                  }
                                  if (
                                    serials.some((serial) => !serial.trim())
                                  ) {
                                    Toast.error(
                                      "All serial numbers must be filled"
                                    );
                                    return;
                                  }
                                  form.setValue(
                                    `PurchaseItems.${index}.serialNumbers`,
                                    serials
                                  );
                                  handleAddToTable(index);
                                  setOpenSerialModal((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                                className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                              >
                                {t("Save")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-[15%] right-0 mt-2 gap-2">
                        <button
                          type="button"
                          onClick={
                            hasSerial
                              ? () => {
                                  setOpenSerialModal((prev) => ({
                                    ...prev,
                                    [index]: true,
                                  }));
                                }
                              : () => handleAddToTable(index)
                          }
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
              <p className="ml-2">{totalAmount}</p>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="bg-gray-100 p-2 rounded-lg w-full md:w-[48%]">
                  <div className="block ml-2">
                    <div>
                      {t("Vat")}: {totalVatAmount}
                    </div>
                    <span>
                      {t("Discount")}: {totalDiscountAmount}
                    </span>
                    <div>
                      {t("Grand Total")}: {grandTotal}
                    </div>
                    {!isNaN(Number(grandTotal)) && (
                      <div>
                        {t("Grand Total In Words")}:{" "}
                        {toWords.convert(Number(grandTotal))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-2 rounded-lg w-full md:w-[48%]">
                  <h2 className="font-semibold mb-2">{t("Bill Sundry")}</h2>
                  <div className="h-[8rem]">
                    <div style={{ marginBottom: "1rem" }}>
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[92%]">
                        <div className="ml-4 flex items-center ">
                          {t("Vat")}
                        </div>

                        <PeerInput
                          disabled={showTax === false}
                          label="Vat"
                          inputType="number"
                          placeholder="%"
                          onChange={() => form.setValue("vatPercent", "13")}
                          value={showTax === true ? "13" : ""}
                        />
                        <PeerInput
                          disabled={showTax === false}
                          label="Vat Amount"
                          inputType="number"
                          placeholder="Amount"
                          onChange={() =>
                            form.setValue("vatAmount", totalVatAmount)
                          }
                          value={totalVatAmount}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 w-[92%]">
                        <div className="ml-4 flex items-center ">
                          {t("Discount")}
                        </div>

                        <PeerInput
                          label="Discount"
                          inputType="number"
                          placeholder="%"
                          value={totalDiscountPercent}
                          onChange={(e) => {
                            const newDiscount = e.target.value;
                            setTotalDiscountPercent(newDiscount);
                            form.setValue("discountPercent", newDiscount);
                          }}
                        />
                        <PeerInput
                          label="Discount Amount"
                          inputType="number"
                          placeholder="Amount"
                          onChange={() =>
                            form.setValue("discountAmount", totalDiscountAmount)
                          }
                          value={totalDiscountAmount}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" h-[45%] overflow-y-auto">
                {addedItems.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">
                      {t("Added")} {t("Purchase Items")}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="p-2 border text-left">
                              {t("Item")}
                            </th>
                            <th className="p-2 border text-left">
                              {t("Unit")}
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
                              <td className="p-2 border">{item.itemName}</td>
                              <td className="p-2 border">{item.unitName}</td>
                              <td className="p-2 border">{item.quantity}</td>
                              <td className="p-2 border">{item.price}</td>
                              <td className="p-2 border">{item.amount}</td>
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
                                      editingIndex === null
                                    ) {
                                      handleEdit(idx);
                                    }
                                  }}
                                  disabled={
                                    isEditingLoading && editingIndex === idx
                                  }
                                  className={`
                                  px-3 py-1 rounded-md border flex items-center justify-center
                                  ${
                                    isEditingLoading && editingIndex === idx
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
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "8px 20px",
                    borderRadius: "8px",
                  }}
                  type="submit"
                >
                  Submit Purchase
                </ButtonElement>
              </ThemeProvider>
            </div>
          </fieldset>
        </form>
      </div>

      {showAddItemForm && (
        <div className="fixed inset-0 bg-white ml-[11.9%] bg-opacity-70 flex items-center justify-center z-[100]">
          <Add
            inset
            visible
            onClose={handleCloseAddItemForm}
            itemIsAdded={itemIsAdded}
            onItemAdded={handleNewItemAdded}
          />
        </div>
      )}
      {showAddLedgerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <AddL
            onLedgerAdded={() => console.log("added")}
            visible
            onClose={handleCloseAddLedgerForm}
            // ledgerIsAdded={itemIsAdded}
            // onLedgerAdded={handleNewItemAdded}
          />
        </div>
      )}
      {showAddPaymentForm && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-[100]">
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

export default AddPurchaseForm;
