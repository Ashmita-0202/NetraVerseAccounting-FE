import { ISales, ISalesDetailsItems, ISalesItems } from "../types/ISales";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import {
  useEditSales,
  useGetAllSales,
  useGetBillNumberGenerationForSales,
  useGetReferenceNumberForSales,
  useGetSalesById,
  useGetSalesDetailsItems,
} from "../hooks/index";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import Addition from "@/assets/square-plus-solid.svg";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useGetAllUnits } from "@/modules/end-user/Inventory/Units/hooks";
import { useGetAllItem } from "@/modules/end-user/Inventory/Item/hooks";
import { IUnits } from "@/modules/end-user/Inventory/Units/types/IUnits";
import { ToWords } from "to-words";
import {
  useGetAllInventory,
  useGetRemainingQty,
} from "@/modules/end-user/Inventory/InventoryLedger/hooks";
import Add from "@/modules/end-user/Inventory/Item/pages/Add";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { DeleteButton } from "@/components/common/DeleteButton";
import { Edit } from "lucide-react";
import { useCallback } from "react";
import { AppCombobox } from "@/components/common/ComboBox";
import AddP from "@/modules/end-user/Payments/PaymentMethod/pages/Add";
import { PeerInput } from "@/components/common/PeerInput";
import { useTranslation } from "react-i18next";
import { useGetAllPaymentMethod } from "@/modules/end-user/Payments/PaymentMethod/hooks";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import { useGetAllParties } from "@/modules/end-user/account/parties/hooks";
type Props = {
  form: UseFormReturn<ISales>;
  SalesId: string;
  onClose: () => void;
};

const stackTokens: IStackTokens = { childrenGap: 10 };

const UpdateSalesForm = ({ form, onClose, SalesId }: Props) => {
  const { t } = useTranslation();
  const toWords = new ToWords();
  const updateSales = useEditSales();
  const [fields, setFields] = useState(
    [] as {
      id?: string;
      quantity: number;
      unitId: string;
      itemId: string;
      price: number;
      amount: string;
      serialNumbers?: string[];
    }[]
  );
  const [addedItems, setAddedItems] = useState(
    [] as {
      itemId: string;
      itemName: string;
      unitId: string;
      unitName: string;
      quantity: number;
      price: number;
      isOn: boolean;
      amount: string;
      serialNumbers: string[];
    }[]
  );
  const { data: allPayment } = useGetAllPaymentMethod();
  const { data: allParties } = useGetAllParties();
  const { data: AllLedgerGroup } = useGetAllLedgerGroups();
  const { refetch } = useGetAllSales();
  const companyId = localStorage.getItem("companyId");
  const [isOpen] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const { data: SalesData } = useGetSalesById(SalesId);
  // const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedIdForPayment, setSelectedIdForPayment] = useState("");
  const [searchTermForSerial, setSearchTermForSerial] = useState("");
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const [showAddPaymentForm, setshowAddPaymentForm] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const { data: billGeneration } =
    useGetBillNumberGenerationForSales(companyId);
  const { data: referenceNumber } = useGetReferenceNumberForSales(companyId);
  const { data: unitsData } = useGetAllUnits();
  const { data: allItems, refetch: refetchItems } = useGetAllItem();
  const [itemId, setItemId] = useState<string>("");
  const [itemsData, setItemsData] = useState<ISalesDetailsItems>();
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [availableSerialNumbers, setAvailableSerialNumbers] = useState<
    string[]
  >([]);
  const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
  const [itemStocks, setItemStocks] = useState<{ id: string; stock: number }[]>(
    []
  );
  const [selectedItemId, setSelectedItemId] = useState("");
  const [remainingQuantity, setRemainingQuantity] = useState("");
  const [tempSelectedSerials, setTempSelectedSerials] = useState<string[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
  const [dropdownSerial, setDropdownForSerial] = useState(false);
  const inputRefForSerial = useRef<HTMLInputElement>(null);
  const dropdownRefForSerial = useRef<HTMLUListElement>(null);
  const { data: itemsDetails } = useGetSalesDetailsItems(itemId);
  const { data: remainingQty } = useGetRemainingQty(itemId);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [itemSellingPrice, setItemSellingPrice] = useState<number | null>();
  const [itemOpeningStock, setItemOpeningStock] = useState<{
    [key: number]: string;
  }>({});
  const [, setItemUnit] = useState<{
    [key: number]: IUnits;
  }>({});
  const [hasSerial, setHasSerial] = useState(false);
  const [isOn, setIsOn] = useState(true);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [amounts, setAmounts] = useState<number | null>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const { data: inventoryItems, refetch: refetchInventory } =
    useGetAllInventory();
  const items = inventoryItems?.Items.filter(
    (item) => item.remainingQuantity > 0
  );
  // const filterItems = items?.filter((group) =>
  //   group.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
  const [allSerials, setAllSerials] = useState<string[]>([]);
  const handleSearchForSerial = useCallback((value: string) => {
    setSearchTermForSerial(value);
  }, []);

  const handleSelectSerial = (serial: string) => {
    if (tempSelectedSerials.length === Number(itemOpeningStock[0])) {
      window.alert("You cannot select more than the quantity");
    } else {
      setTempSelectedSerials((prev) =>
        prev.includes(serial)
          ? prev.filter((s) => s !== serial)
          : [...prev, serial]
      );
      setAvailableSerialNumbers((prev) =>
        prev.includes(serial)
          ? prev.filter((s) => s !== serial)
          : [...prev, serial]
      );
    }
  };

  const handleUnSelectSerial = (
    e: ChangeEvent<HTMLInputElement>,
    serial: string
  ) => {
    const serialNumber = serial;
    const prevSerial = allSerials.find((s) => s === serial);
    if (isEditingLoading) {
      if (!e.target.checked) {
        setAvailableSerialNumbers((prev) =>
          prev.filter((s) => s !== serialNumber)
        );
        setTempSelectedSerials((prev) =>
          prev.filter((s) => s !== serialNumber)
        );
      }
    } else {
      if (prevSerial) {
        window.alert("You cannot unSelect the previously selected Serial");
      } else {
        if (!e.target.checked) {
          setAvailableSerialNumbers((prev) =>
            prev.filter((s) => s !== serialNumber)
          );
          setTempSelectedSerials((prev) =>
            prev.filter((s) => s !== serialNumber)
          );
        }
      }
    }
  };

  const [totalDiscountPercent, setTotalDiscountPercent] = useState("");
  const [totalVatAmount, setTotalVatAmount] = useState<string | null>("");
  const [totalDiscountAmount, setTotalDiscountAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const filteredSerial = (itemsData?.serialNumbers as string[])
    ?.filter((group) =>
      group.toLowerCase().includes(searchTermForSerial.toLowerCase())
    )
    ?.filter((group) => !availableSerialNumbers.includes(group));

  const handleSelectedUnit = (
    index: number,
    selectedUnit: { id: string; name: string }
  ) => {
    form.setValue(`salesItems.${index}.unitId`, selectedUnit.id);
    setSelectedUnitId(selectedUnit.id);
  };
  useEffect(() => {
    if (itemId && itemsDetails) {
      if (itemsDetails.serialNumbers.length > 0) {
        setHasSerial(true);
      } else {
        setHasSerial(false);
      }
      setItemsData(itemsDetails);
    }
  }, [itemId, itemsDetails, remainingQty, itemOpeningStock, hasSerial]);

  const handleSelectItem = (
    index: number,
    selectedItem: {
      itemId: string;
    }
  ) => {
    setItemId(selectedItem.itemId);
    setSelectedIndex(index);
    // setItemOpeningStock((prev) => ({
    //   ...prev,
    //   [index]: `${selectedItem.remainingQuantity}` || "1",
    // }));
    setCurrentFieldIndex(index);
    setTempSelectedSerials([]);
  };
  const handleClose = () => {
    setAddedItems([]);
    setIsToggleDisabled(false);
    setTotalAmount(0);
    setGrandTotal("0");
    setTotalDiscountAmount("");
    setTotalVatAmount(null);
    setTotalDiscountAmount("");
    setTotalDiscountPercent("");
    setRemainingQuantity("0");
    const resetFields = fields.map(() => ({
      quantity: 0,
      unitId: "",
      itemId: "",
      price: 0,
      amount: "",
      serialNumbers: [],
    }));
    setFields(resetFields);
    form.reset();
    setSelectedLedgerId("");
    setSelectedIdForPayment("");
    setSelectedUnitId("");
    setSelectedItemId("");
    setItemOpeningStock({});
    setItemSellingPrice(null);
    setAmounts(null);
    setIsOn(false);
    setTotalDiscountPercent("");
    setTempSelectedSerials([]);
    setAvailableSerialNumbers([]);
    setAllSerials([]);
  };
  const handleSelectLedgerForPayment = (ledgerId: string) => {
    form.setValue("paymentId", ledgerId);
  };

  // const handleSearchForUnit = (value: string) => {
  //   setSearchTermsForUnit(value);
  //   // unitsData?.Items?.filter(({ name }) =>
  //   //   name.toLowerCase().includes(value.toLowerCase())
  //   // ) || [];
  // };
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerId", ledgerId);
  };
  const handleEdit = (index: number) => {
    const itemToEdit = addedItems[index];
    const item = allItems?.Items.find((i) => i.id === itemToEdit.itemId);
    if (!item) {
      Toast.error("Item to edit does not exist");
      return;
    }
    setItemOpeningStock(() => ({
      [0]: `${itemToEdit.quantity}`,
    }));
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
    form.setValue(`salesItems.0.itemId`, itemToEdit.itemId);
    form.setValue(`salesItems.0.unitId`, itemToEdit.unitId);
    form.setValue(`salesItems.0.quantity`, Number(itemToEdit.quantity));
    form.setValue(`salesItems.0.price`, itemToEdit.price);
    form.setValue(`salesItems.0.amount`, itemToEdit.amount);
    setSelectedUnitId(itemToEdit.unitId);
    setSelectedItemId(itemToEdit.itemId);
    setItemOpeningStock({ 0: `${itemToEdit.quantity}` });
    setItemSellingPrice(itemToEdit.price);
    setAmounts(Number(itemToEdit.amount));
    setIsOn(itemToEdit.isOn);
    setAvailableSerialNumbers(itemToEdit.serialNumbers);
    setTempSelectedSerials(itemToEdit.serialNumbers);
  };
  const handleAddToTable = (index: number) => {
    const currentItem = fields[index];
    setIsItemSelected(false);
    let finalSerials: string[] = [];
    if (hasSerial) {
      finalSerials = tempSelectedSerials;
      if (tempSelectedSerials.length === 0) {
        Toast.error("Please select at least one serial number");
        return;
      }
      if (tempSelectedSerials.length !== currentItem.quantity) {
        Toast.error("Selected serial numbers must match the quantity");
        return;
      }
    }
    if (!currentItem.itemId || !currentItem.unitId || !currentItem.quantity) {
      Toast.error("Please fill all item fields");
      return;
    }

    const item = allItems?.Items.find((i) => i.id === currentItem.itemId);
    const unit = unitsData?.Items.find((u) => u.id === currentItem.unitId);

    if (!item || !unit) {
      Toast.error("Item or unit details not found");
      return;
    }
    setAllSerials((prev) => [...prev, ...tempSelectedSerials]);
    const discountedPrice = isOn
      ? currentItem.price
      : currentItem.price - (13 / 100) * currentItem.price;

    if (editingIndex !== null) {
      const updatedItems = [...addedItems];
      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        itemId: currentItem.itemId,
        itemName: item.name,
        unitId: currentItem.unitId,
        unitName: unit.name,
        quantity: currentItem.quantity,
        price: discountedPrice,
        amount: currentItem.amount,
        isOn: isOn,
        serialNumbers: finalSerials,
      };
      const newTotalAmount = updatedItems.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);
      setAddedItems(updatedItems);
      setEditingIndex(null);
      setIsEditingLoading(false);
      const existingIndex = itemStocks.findIndex(
        (stock) => stock.id === currentItem.itemId
      );
      if (existingIndex !== -1) {
        const updatedStocks = (() => {
          const newStocks = [...itemStocks];
          const initialQty = Number(remainingQty?.RemainingQuantity ?? 0);
          newStocks[existingIndex].stock = initialQty;
          return newStocks;
        })();
        setItemStocks(updatedStocks);
      }
    } else {
      const updatedAddedItems = [...addedItems];
      const existingItemIndex = updatedAddedItems.findIndex(
        (addedItem) =>
          addedItem.itemId === currentItem.itemId && addedItem.isOn === isOn
      );

      if (existingItemIndex !== -1) {
        const newQuantity =
          Number(updatedAddedItems[existingItemIndex].quantity) +
          Number(currentItem.quantity);
        const combinedSerialNumbers = [
          ...updatedAddedItems[existingItemIndex].serialNumbers,
          ...finalSerials,
        ];
        updatedAddedItems[existingItemIndex] = {
          ...updatedAddedItems[existingItemIndex],
          quantity: newQuantity,
          amount: `${
            Number(updatedAddedItems[existingItemIndex].amount) +
            Number(currentItem.amount)
          }`,
          serialNumbers: combinedSerialNumbers,
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
          isOn: isOn,
          serialNumbers: finalSerials,
        });
      }
      setAddedItems(updatedAddedItems);
      const newTotalAmount = updatedAddedItems.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      setTotalAmount(newTotalAmount);
      const updatedStocks = (() => {
        const existingIndex = itemStocks.findIndex(
          (stock) => stock.id === currentItem.itemId
        );

        if (existingIndex !== -1) {
          const newStocks = [...itemStocks];
          const remainingQty = newStocks[existingIndex].stock;
          newStocks[existingIndex].stock =
            remainingQty - Number(currentItem.quantity);
          return newStocks;
        } else {
          const initialQty = Number(remainingQty?.RemainingQuantity ?? 0);
          return [
            ...itemStocks,
            {
              id: currentItem.itemId,
              stock: initialQty - Number(currentItem.quantity),
            },
          ];
        }
      })();
      setItemStocks(updatedStocks);
    }

    const updatedFields = [...fields];
    updatedFields[index] = {
      quantity: 0,
      unitId: "",
      itemId: "",
      price: 0,
      amount: "",
      serialNumbers: [],
    };
    setFields(updatedFields);
    setIsToggleDisabled(true);
    handleConfirmSerials();
    setAmounts(null);
    setSelectedUnitId("");
    setSelectedItemId("");
    setItemOpeningStock((prev) => ({ ...prev, [index]: "" }));
    setItemSellingPrice(null);
    setTempSelectedSerials([]);
    setAvailableSerialNumbers([]);
    setItemId("");
  };
  useEffect(() => {
    if (SalesData) {
      form.reset({
        date: SalesData.date || "",
        billNumber: SalesData.billNumber || "",
        ledgerId: SalesData.ledgerId || "",
        amountInWords: SalesData.amountInWords || "",
        discountPercent: SalesData.discountPercent || "",
        discountAmount: SalesData.discountAmount || "",
        vatPercent: SalesData.vatPercent || "",
        vatAmount: SalesData.vatAmount || "",
        paymentId: SalesData.paymentId || "",
        salesItems: SalesData.salesItems?.map((item) => ({
          quantity: item.quantity,
          unitId: item.unitId,
          itemId: item.itemId,
          price: item.price,
          amount: item.amount,
          serialNumbers: Array.isArray(item.serialNumbers)
            ? item.serialNumbers
            : item.serialNumbers
            ? [item.serialNumbers]
            : Array(item.quantity).fill(""),
        })) || [
          {
            quantity: 0,
            unitId: "",
            itemId: "",
            price: 0,
            amount: 0,
            serialNumbers: [],
          },
        ],
      });
      setAddedItems(
        SalesData.salesItems?.map((item) => ({
          id: item.id,
          itemId: item.itemId,
          itemName:
            allItems?.Items.find((i) => i.id === item.itemId)?.name || "",
          unitId: item.unitId,
          unitName:
            unitsData?.Items.find((u) => u.id === item.unitId)?.name || "",
          quantity: item.quantity,
          price: item.price,
          isOn: true,
          amount: item.amount,
          serialNumbers: Array.isArray(item.serialNumbers)
            ? item.serialNumbers
            : item.serialNumbers
            ? [item.serialNumbers]
            : Array(item.quantity).fill(""),
        })) || []
      );
      setSelectedLedgerId(SalesData.ledgerId);
      setSelectedIdForPayment(SalesData.paymentId);
      setTotalAmount(
        Number(SalesData.grandTotalAmount) -
          Number(SalesData.vatAmount) +
          Number(SalesData.discountAmount) || 0
      );
    }
  }, [SalesData, form, allItems, unitsData]);

  useEffect(() => {
    if (SalesData?.vatPercent && SalesData?.vatAmount) {
      setTotalVatAmount(SalesData.vatAmount);
    }
    if (SalesData?.discountPercent && SalesData?.discountAmount) {
      setTotalDiscountAmount(SalesData.discountAmount);
      setTotalDiscountPercent(SalesData.discountPercent);
    }
  }, [SalesData]);
  const foundStock = itemStocks.find((i) => i.id === itemId);

  const handleOpenAddLedgerForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddLedgerForm(true);
  };
  const handleOpenAddPaymentForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setshowAddPaymentForm(true);
  };
  const handleCloseAddPaymentForm = () => {
    setshowAddPaymentForm(false);
  };

  const onSubmit: SubmitHandler<ISales> = async (data) => {
    if (editingIndex !== null) {
      return;
    }
    if (!data.ledgerId) {
      Toast.error("Ledger ID is required");
      return;
    }
    const filteredSalesItems: ISalesItems[] = addedItems.map(
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
    const updatedData: ISales = {
      ledgerId: data.ledgerId,
      paymentId: data.paymentId,
      date: data.date,
      billNumber: data.billNumber,
      salesItems: filteredSalesItems,
      vatPercent: "13",
      vatAmount: totalVatAmount,
      discountPercent: totalDiscountPercent,
      discountAmount: totalDiscountAmount,
      grandTotalAmount: grandTotal,
      amountInWords: toWords.convert(Number(grandTotal)),
      id: data.id || "",
    };
    try {
      await updateSales.mutateAsync({
        id: SalesId,
        data: updatedData,
      });
      Toast.success("Successfully Updated SalesDetails");
      refetchInventory();
      refetch();
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update SalesDetails"
          : "An unexpected error occurred";
      Toast.error(message);
    }
  };
  const handleDelete = (index: number) => {
    const newAmount = totalAmount - Number(addedItems[index].amount);
    const updatedSerials = allSerials.filter(
      (serial) => !addedItems[index].serialNumbers.includes(serial)
    );
    setAllSerials(updatedSerials);
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
      amount: "",
      serialNumbers: [],
    }));

    setFields(resetFields);
    form.reset();
    setSelectedItemId("");
    setSelectedUnitId("");
    setItemOpeningStock({});
    setItemSellingPrice(null);
    setAmounts(null);
    setIsOn(false);
    setTempSelectedSerials([]);
    setAvailableSerialNumbers([]);
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

  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false);
  };

  const handleIsOn = (
    _ev: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ) => {
    if (!isToggleDisabled) {
      setIsOn(!!checked);
    }
  };

  const handleConfirmSerials = () => {
    const quantity = tempSelectedSerials.length;
    setItemOpeningStock((prev) => ({
      ...prev,
      [currentFieldIndex]: `${quantity}`,
    }));
    if (itemSellingPrice) {
      const newAmount = itemSellingPrice * quantity;
      setAmounts(newAmount);
      form.setValue(`salesItems.${currentFieldIndex}.quantity`, quantity);
      form.setValue(`salesItems.${currentFieldIndex}.amount`, `${newAmount}`);
    }

    setShowSerialModal(false);
  };

  const handleCloseSerialModal = () => {
    setShowSerialModal(false);
    setTempSelectedSerials([]);
    setAvailableSerialNumbers([]);
  };

  useEffect(() => {
    if (isItemSelected === true) {
      if (itemsData) {
        setItemSellingPrice(itemsData ? Number(itemsData.rate) : 0);
        if (itemStocks.length < 1) {
          const updatedStocks = (() => {
            {
              const initialQty = Number(remainingQty?.RemainingQuantity);
              return [
                ...itemStocks,
                {
                  id: itemId,
                  stock: initialQty,
                },
              ];
            }
          })();
          setItemStocks(updatedStocks);
        }

        if (allSerials) {
          const matchingSerials = allSerials.filter((serial) =>
            itemsData.serialNumbers.includes(serial)
          );
          const updatedSerials = Array.from(
            new Set([...tempSelectedSerials, ...matchingSerials])
          );
          if (matchingSerials) {
            setAvailableSerialNumbers(updatedSerials);
          } else {
            setAvailableSerialNumbers([]);
          }
        }
      }
    }
  }, [isItemSelected, itemsData]);

  useEffect(() => {
    if (isItemSelected === true && itemsData) {
      const sellingPrice = Number(itemsData.rate);
      setItemSellingPrice(sellingPrice);
      setItemOpeningStock((prev) => ({
        ...prev,
        [currentFieldIndex]: "1",
      }));
    }
  }, [itemsData, isItemSelected]);

  useEffect(() => {
    if (
      (isItemSelected && itemsData && itemSellingPrice !== undefined) ||
      (itemsData && itemSellingPrice !== undefined && editingIndex !== null)
    ) {
      const sellingPrice = itemSellingPrice;
      const quantity = Number(itemOpeningStock[selectedIndex]);
      const updatedFields = [...fields];
      if (sellingPrice) {
        updatedFields[selectedIndex] = {
          itemId: itemId,
          unitId: itemsData.unitId,
          price: sellingPrice,
          quantity,
          amount: `${sellingPrice * quantity}`,
          serialNumbers: itemsData.serialNumbers,
        };
        form.setValue(`salesItems.${selectedIndex}.itemId`, itemId);
        setFields(updatedFields);
        setAmounts(sellingPrice * quantity);
      }

      const matchedUnit = unitsData?.Items?.find(
        (unit) => unit.id === itemsData.unitId
      );
      if (matchedUnit) {
        setItemUnit((prev) => ({
          ...prev,
          [selectedIndex]: matchedUnit,
        }));
        setSelectedUnitId(matchedUnit.id);
      }
    }
  }, [itemSellingPrice, itemOpeningStock]);

  useEffect(() => {
    const formFields = form.watch("salesItems") || [];
    if (JSON.stringify(fields) !== JSON.stringify(formFields)) {
      setFields(formFields);
    }
  }, [form.watch("salesItems")]);

  useEffect(() => {
    if (totalAmount) {
      const totalVat = SalesData?.vatPercent
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

  useEffect(() => {
    if (!isNaN(totalAmount)) {
      const grandTotal = totalTaxableAmount + (Number(totalVatAmount) || 0);
      setGrandTotal(`${grandTotal}`);
      form.setValue("grandTotalAmount", `${grandTotal}`);
      form.setValue("amountInWords", toWords.convert(Number(grandTotal)));
    } else {
      setGrandTotal(`1`);
    }
  }, [
    totalAmount,
    setTotalDiscountAmount,
    form,
    grandTotal,
    totalTaxableAmount,
  ]);

  useEffect(() => {
    const handleClickOutsideForSerial = (event: MouseEvent) => {
      if (
        dropdownRefForSerial.current &&
        !dropdownRefForSerial.current.contains(event.target as Node)
      ) {
        setDropdownForSerial(false);
        setSearchTermForSerial("");
      }
    };
    document.addEventListener("mousedown", handleClickOutsideForSerial);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideForSerial);
    };
  }, []);
  const [newAddedItemName, setNewAddedItemName] = useState("");
  const [itemIsAdded, setItemIsAdded] = useState(false);
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
    if (!newAddedItemName || !inventoryItems || !allItems) return;
    const nameMatch = allItems.Items.find(
      (item) => item.name === newAddedItemName
    );
    if (!nameMatch) return;
    const addedItem = inventoryItems.Items.find(
      (item) => item.itemId === nameMatch.id
    );
    if (addedItem) {
      const indexToSelect = inventoryItems.Items.length - 1;
      setIsItemSelected(true);
      handleSelectItem(indexToSelect, addedItem);

      setNewAddedItemName("");
    }
  }, [inventoryItems, allItems, newAddedItemName]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[88%] ml-[12%] h-[100%] bg-white p-4 overflow-auto relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <fieldset className="h-full">
            <div className="h-[93%]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">{t("Update Sales")}</h1>
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
                    name="date"
                    inputType="date"
                    placeholder="Enter Date"
                  />
                </div>

                {billGeneration?.BillNumberGenerationType === 0 && (
                  <div className=" mt-[5%]">
                    <InputElement
                      required
                      label="Bill No"
                      form={form}
                      name="billNumber"
                      placeholder="Enter Bill Number"
                    />
                  </div>
                )}

                {referenceNumber?.showReferenceNumberForSales === 0 && (
                  <div className=" mt-[5%]">
                    <InputElement
                      required
                      label="Reference Number"
                      form={form}
                      name="referenceNumber"
                      placeholder="Enter Reference Number"
                    />
                  </div>
                )}
                <div>
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

                  <AppCombobox
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
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
                </div>

                <div>
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
                  <AppCombobox
                    value={selectedIdForPayment}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Payment"
                    required
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

              <div className="mt-4  p-2 rounded-lg mb-1 relative border-teal-500 border">
                <div className="flex items-center mb-2">
                  <h2 className="font-semibold">{t("Sales Items")}</h2>
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
                    <p className="ml-2">
                      {t("Remaining Qty")} :
                      {remainingQuantity
                        ? remainingQuantity
                        : remainingQty?.RemainingQuantity
                        ? Number(remainingQty?.RemainingQuantity) - 1
                        : 0}
                    </p>
                  </div>
                </div>

                <div className="overflow-y-auto h-[6rem] mb-2 relative flex items-center pl-4 ">
                  {fields.map((item, index) => (
                    <div key={index} className=" w-[90%]">
                      <div className="flex w-full ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center gap-3 w-full">
                          <div>
                            {items && (
                              <AppCombobox
                                dropDownWidth="w-[11.4rem]"
                                dropdownPositionClass="fixed"
                                label="Items"
                                required
                                value={selectedItemId}
                                options={items}
                                selected={items.find(
                                  (g) => g.itemId === selectedItemId
                                )}
                                onSelect={(group) => {
                                  if (group) {
                                    setSelectedItemId(group.itemId);
                                    handleSelectItem(index, group);
                                    setIsItemSelected(true);
                                  } else {
                                    setSelectedItemId("");
                                  }
                                }}
                                getLabel={(g) => g.itemNames ?? ""}
                                getValue={(g) => g.itemId ?? ""}
                              />
                            )}
                          </div>
                          <div className="  relative">
                            {unitsData && (
                              <AppCombobox
                                dropDownWidth="w-[11.4rem]"
                                dropdownPositionClass="fixed"
                                label="Units"
                                options={unitsData.Items}
                                value={selectedUnitId}
                                selected={
                                  unitsData.Items.find(
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
                            )}
                          </div>

                          <div className="relative mt-1">
                            <PeerInput
                              label="Quantity"
                              onChange={(e) => {
                                let quantity = Number(e.target.value);
                                let availableQty;
                                if (editingIndex !== null) {
                                  availableQty =
                                    remainingQty?.RemainingQuantity;
                                } else {
                                  if (foundStock) {
                                    availableQty = foundStock.stock;
                                  } else {
                                    availableQty = Number(
                                      itemsData?.totalQuantity
                                    );
                                  }
                                }
                                const newRemaining =
                                  Number(availableQty) - quantity;
                                setRemainingQuantity(`${newRemaining}`);

                                if (newRemaining < 0) {
                                  alert("Not enough items");
                                  quantity = Number(item.quantity);
                                }
                                setItemOpeningStock((prev) => ({
                                  ...prev,
                                  [index]: `${quantity}`,
                                }));
                                if (itemSellingPrice) {
                                  const newAmount = itemSellingPrice * quantity;
                                  setAmounts(newAmount);
                                  form.setValue(
                                    `salesItems.${index}.amount`,
                                    `${newAmount}`
                                  );
                                }
                                form.setValue(
                                  `salesItems.${index}.quantity`,
                                  quantity
                                );
                              }}
                              value={itemOpeningStock[index] || ""}
                              inputType="number"
                              name={`salesItems.${index}.quantity`}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="grid grid-cols-1">
                            <div className="relative top-[-19%]">
                              <div className="flex justify-center ml-12">
                                <Stack tokens={stackTokens}>
                                  <Toggle
                                    inlineLabel
                                    onText={t("Exclusive")}
                                    offText={t("Inclusive")}
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
                                    `salesItems.${index}.price`,
                                    price
                                  );
                                  setItemSellingPrice(price);
                                  const newAmount =
                                    Number(itemOpeningStock[index]) * price;

                                  setAmounts(newAmount);
                                  form.setValue(
                                    `salesItems.${index}.amount`,
                                    `${newAmount}`
                                  );
                                }}
                                value={itemSellingPrice ?? ""}
                                name={`salesItems.${index}.price`}
                                inputType="text"
                                placeholder="Rate"
                              />
                            </div>
                          </div>
                          <div className="mt-1">
                            <PeerInput
                              onChange={() =>
                                form.setValue(
                                  `salesItems.${index}.amount`,
                                  `${amounts}`
                                )
                              }
                              label="Amount"
                              inputType="text"
                              placeholder="Amount"
                              value={amounts ?? ""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[15%] right-0 mt-2 gap-2 w-[8%]">
                        <button
                          type="button"
                          onClick={
                            hasSerial
                              ? () => {
                                  setShowSerialModal(true);
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

                <div className="border pb-8 p-2 rounded-lg w-full md:w-[48%]">
                  <h2 className="font-semibold mb-2">{t("Bill Sundry")}</h2>
                  <div className="h-[4.9rem]">
                    <div style={{ marginBottom: "1rem" }}>
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[92%]">
                        <div className="ml-4 flex items-center ">
                          {t("Vat")}
                        </div>

                        <PeerInput
                          disabled={!SalesData?.vatPercent}
                          label="Vat"
                          inputType="number"
                          placeholder="%"
                          onChange={() => form.setValue("vatPercent", "13")}
                          value={SalesData?.vatPercent ? "13" : ""}
                        />
                        <PeerInput
                          disabled={!SalesData?.vatPercent}
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
              <div className="h-[45%] overflow-y-auto">
                {addedItems.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">
                      {t("Added")} {t("Sales Items")}
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
                  Submit Sales
                </ButtonElement>
              </ThemeProvider>
            </div>
          </fieldset>
        </form>
      </div>

      {showSerialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[30rem] relative">
            <h2 className="text-lg font-semibold mb-4">
              {t("Select Serial Number")}
            </h2>
            <div className="relative h-[76%]">
              <input
                ref={inputRefForSerial}
                type="text"
                placeholder={t("Search Serial Number")}
                defaultValue={searchTermForSerial}
                onChange={(e) => handleSearchForSerial(e.target.value)}
                onFocus={() => setDropdownForSerial(true)}
                className="w-full border rounded px-2 py-2 mb-1"
              />

              {dropdownSerial && (
                <ul
                  ref={dropdownRefForSerial}
                  className="absolute left-0 top-8 w-full bg-white border rounded shadow z-40 max-h-30 overflow-y-auto py-1 mt-1"
                >
                  {filteredSerial.map((group) => (
                    <li
                      key={group}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setDropdownForSerial(false);
                        handleSelectSerial(group);
                      }}
                    >
                      {group}
                    </li>
                  ))}
                </ul>
              )}

              <div className="h-[80%] overflow-y-auto pr-1 mt-2">
                {availableSerialNumbers.length > 0 ? (
                  <div className="space-y-1">
                    {availableSerialNumbers.map((serial, index) => (
                      <div key={index} className="flex items-center py-1">
                        <input
                          type="checkbox"
                          checked={availableSerialNumbers.includes(serial)}
                          className="mr-2"
                          onChange={(e) => handleUnSelectSerial(e, serial)}
                        />
                        <span>{serial}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {t("No Serial Numbers Found")}.
                  </p>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-6 right-6 flex justify-between">
              <button
                type="button"
                onClick={() => handleAddToTable(0)}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                {t("Confirm")}
              </button>
              <button
                type="button"
                onClick={handleCloseSerialModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddItemForm && (
        <div className="fixed inset-0 ml-[13.7%] bg-white bg-opacity-70 flex items-center justify-center z-[100]">
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
        <div className="fixed inset-0 ml-[13.7%] bg-white bg-opacity-70 flex items-center justify-center z-[100]">
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
        <div className="fixed inset-0 ml-[13.7%] bg-white bg-opacity-70 flex items-center justify-center z-[100]">
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

export default UpdateSalesForm;
