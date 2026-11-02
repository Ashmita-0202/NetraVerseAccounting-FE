import { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { IItem } from "../types/IItem";
import { useEditItem, useGetItemById } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useGetAllUnits } from "../../Units/hooks";
import { useGetAllItemGroup } from "../../ItemGroup/hooks";
import Add from "../../Units/pages/Add";
import AddItemGroup from "../../ItemGroup/pages/Add";
import { useState, MouseEvent, useEffect } from "react";
import { EditButton } from "@/components/common/EditButton";
import { useGetAllInventory } from "../../InventoryLedger/hooks";
import { useGetItemStatusByCompany } from "@/modules/admin/Settings/hooks";
import { AppCombobox } from "@/components/common/ComboBox";
import { useGetAllConversionFactor } from "../../ConversionFactor/hooks";
import { UnitName } from "./GroupName";
import { useTranslation } from "react-i18next";

type Props = {
  form: UseFormReturn<IItem>;
  itemIsAdded?: boolean;
  onClose: () => void;
  ItemId: string;
};

const UpdateItemForm = ({ form, onClose, ItemId }: Props) => {
  const { t } = useTranslation();
  const { data: Units } = useGetAllUnits();
  const { data: ItemGroup } = useGetAllItemGroup();
  const updateItem = useEditItem();
  const { data: itemData } = useGetItemById(ItemId);
  const [units, setShowUnits] = useState(false);
  const [itemGroup, setItemGroup] = useState(false);
  const { refetch } = useGetAllInventory();
  const [amounts, setAmounts] = useState<number | null>();
  const { data: conversionFactors } = useGetAllConversionFactor();
  const [conversionFactorId, setConversionFactorId] = useState<string | null>();
  const [unitId, setUnitId] = useState("");
  const [itemGroupId, setItemGroupId] = useState("");
  const handleClose = () => {
    form.reset({
      name: "",
      price: null,
      itemGroupId: "",
      unitId: "",
      sellingPrice: null,
      costPrice: null,
      barCodeField: null,
      expiredDate: null,
      openingStockQuantity: null,
      serialNumbers: null,
      hsCode: null,
      minimumLevel: null,
      conversionFactorId: null,
      hasSerial: false,
    });
    onClose();
    setItemGroupId("");
    setUnitId("");
    setConversionFactorId("");
    setAmounts(null);
  };
  useEffect(() => {
    if (itemData) {
      form.reset({
        id: itemData?.id ?? "",
        name: itemData?.name ?? "",
        price: itemData?.price ?? null,
        itemGroupId: itemData?.itemGroupId ?? "",
        unitId: itemData?.unitId ?? "",
        sellingPrice: itemData?.sellingPrice ?? null,
        costPrice: itemData?.costPrice ?? null,
        barCodeField: itemData?.barCodeField ?? null,
        expiredDate: itemData?.expiredDate ?? null,
        openingStockQuantity: itemData?.openingStockQuantity ?? null,
        serialNumbers: itemData?.serialNumbers ?? null,
        hsCode: itemData?.hsCode ?? null,
        hasSerial: itemData?.hasSerial ?? true,
      });
      setItemGroupId(itemData.itemGroupId);
      setUnitId(itemData.unitId);
      setConversionFactorId(itemData.conversionFactorId);
    }
  }, [itemData, form]);
  const onSubmit: SubmitHandler<IItem> = async (formData) => {
    try {
      await updateItem.mutateAsync({
        id: ItemId,
        data: formData,
      });
      Toast.success("Successfully Updated Items");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update Items " + error);
      }
    } finally {
      handleClose();
    }
  };
  const AddUnit = () => (
    <div>
      <ButtonElement
        style={{
          borderRadius: "6px",
          minWidth: "1px",
        }}
        type="button"
        text="+"
        onClick={() => setShowUnits(true)}
        className="!text-md !font-bold !bg-teal-500 h-5 w-3"
      />
    </div>
  );

  const UpdateItemGroupButton = () => (
    <div>
      <ButtonElement
        id="itemGroup-overlay"
        style={{
          borderRadius: "6px",
          minWidth: "1px",
        }}
        type="button"
        text="+"
        onClick={() => setItemGroup(true)}
        className="!text-md !font-bold !bg-teal-500 h-5 w-3"
      />
    </div>
  );

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const handleOverlayClickForUnit = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "unit-overlay") {
      setShowUnits(false);
    }
  };
  const handleOverlayClickForItemGroup = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "itemGroup-overlay") {
      setItemGroup(false);
    }
  };
  const companyId = localStorage.getItem("companyId");

  const { data: allowExpiry } = useGetItemStatusByCompany(companyId);
  const watchConversionChecked = form.watch("hasConversionFactor");
  const watchExpiryChecked = form.watch("ExpiryCheckbox");
  const expiredCheck = allowExpiry?.isExpiredDate;
  const serialCheck = allowExpiry?.isSerialNo;
  useEffect(() => {
    if (!serialCheck) {
      form.setValue("hasSerial", false);
    }
  }, [serialCheck, form]);
  const watchSerialChecked = form.watch("hasSerial");
  const costPrice = form.watch("costPrice");
  const openingStockQuantity = form.watch("openingStockQuantity");
  const { data: allUnits } = useGetAllUnits();
  const getUnitName = (unitId?: string): string => {
    if (!unitId) return "";
    const unit = allUnits?.Items.find((u) => u.id === unitId);
    return unit?.name ?? "";
  };
  useEffect(() => {
    if (costPrice) {
      const parsedCost = parseFloat(costPrice) || 0;
      const parsedQuantity = Number(openingStockQuantity) || 0;
      const calculatedPrice = parsedCost * parsedQuantity;
      const formattedPrice = calculatedPrice.toFixed(2);
      setAmounts(Number(formattedPrice));
      form.setValue("price", Number(formattedPrice));
    }
  }, [costPrice, openingStockQuantity, form]);
  const handleSelectConversionFactor = (conversionFactorId: string) => {
    form.setValue("conversionFactorId", conversionFactorId);
  };
  const handleSelectUnit = (unitId: string) => {
    form.setValue("unitId", unitId);
  };
  const handleSelectItemGroup = (itemGroupId: string) => {
    form.setValue("itemGroupId", itemGroupId);
  };
  const isSubmitDisabled =
    !form.watch("name") || !form.watch("unitId") || !form.watch("itemGroupId");
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-10"
    >
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <fieldset className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h1 className="text-xl font-semibold">{t("Add Item")}</h1>
              <button
                type="button"
                onClick={handleClose}
                className="text-red-400 text-2xl hover:text-red-500"
              >
                <img src={close} alt="close" className="w-7 h-7" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="">
                <div className="mb-2">
                  <div className="flex"></div>
                  <InputElement
                    label="Item Name"
                    form={form}
                    name="name"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="mb-2">
                  <div className="mb-4">
                    <EditButton button={UpdateItemGroupButton()} />
                  </div>

                  <AppCombobox
                    value={itemGroupId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Item Group"
                    required
                    options={ItemGroup?.Items}
                    selected={
                      ItemGroup?.Items.find((g) => g.id === itemGroupId) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setItemGroupId(group.id || "");
                        handleSelectItemGroup(group.id || "");
                      } else {
                        setItemGroupId("");
                      }
                    }}
                    getLabel={(g) => g?.name || ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>
                <div className="mb-4">
                  <div className="mb-4">
                    <EditButton button={AddUnit()} />
                  </div>
                  <AppCombobox
                    value={unitId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Units"
                    required
                    options={Units?.Items}
                    selected={Units?.Items.find((g) => g.id === unitId) || null}
                    onSelect={(group) => {
                      if (group) {
                        setUnitId(group.id || "");
                        handleSelectUnit(group.id || "");
                      } else {
                        setUnitId("");
                      }
                    }}
                    getLabel={(g) => g?.name || ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="mt-2">
                      <InputElement
                        form={form}
                        name="hasConversionFactor"
                        inputTypeCheckBox="checkbox"
                      />
                    </div>
                    <span className="text-sm mt-3">
                      {t("Has Conversion Factors")}
                    </span>
                  </div>
                  {watchConversionChecked && (
                    <div className="my-6">
                      {conversionFactors && (
                        <AppCombobox
                          value={conversionFactorId}
                          dropDownWidth="w-full"
                          dropdownPositionClass="absolute"
                          label="Conversion Factor"
                          options={conversionFactors.Items}
                          selected={
                            conversionFactors.Items.find(
                              (g) => g.id === conversionFactorId
                            ) || null
                          }
                          onSelect={(group) => {
                            if (group) {
                              setConversionFactorId(group.id || "");
                              handleSelectConversionFactor(group.id || "");
                            } else {
                              setConversionFactorId("");
                            }
                          }}
                          getLabel={(g) => getUnitName(g?.toUnit) || ""}
                          getValue={(g) => g?.id ?? ""}
                          renderOptionExtra={(g) => (
                            <UnitName UnitId={g?.fromUnit} />
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <InputElement
                    label="Selling Price"
                    form={form}
                    name="sellingPrice"
                    placeholder="Selling Price"
                  />
                </div>

                <div className="mb-6">
                  <InputElement
                    label="Minimum Level"
                    form={form}
                    name="minimumLevel"
                    type="text"
                    placeholder="Minimum Level"
                  />
                </div>

                <div className="mb-6">
                  <InputElement
                    label="HS Code"
                    form={form}
                    name="hsCode"
                    type="number"
                    placeholder="HS Code"
                  />
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <InputElement
                    label="Cost Price"
                    form={form}
                    name="costPrice"
                    placeholder="Cost Price"
                  />
                </div>

                <div className="mb-6">
                  <InputElement
                    label="Bar Code"
                    form={form}
                    name="barCodeField"
                    placeholder="Barcode"
                  />
                </div>

                {expiredCheck === true && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <div className="mt-2">
                        <InputElement
                          form={form}
                          name="ExpiryCheckbox"
                          inputTypeCheckBox="checkbox"
                        />
                      </div>
                      <span className="text-sm mt-3">
                        {t("Has Expiry Date")}
                      </span>
                    </div>
                    {watchExpiryChecked && (
                      <div className="mt-4">
                        <InputElement
                          form={form}
                          label="Expired Date"
                          name="expiredDate"
                          inputType="date"
                          placeholder="Expiry date"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="mb-6">
                  <InputElement
                    label="Opening Stock Quantity"
                    form={form}
                    name="openingStockQuantity"
                    placeholder="Opening Stock"
                    type="number"
                  />
                </div>
                <div>
                  <InputElement
                    label="Amount"
                    readOnly
                    form={form}
                    name="price"
                    type="number"
                    placeholder="Amount"
                    value={amounts}
                    className="w-full border rounded p-1"
                  />
                </div>

                {serialCheck && (
                  <div>
                    <div className="flex items-center mt-2  gap-2">
                      <div className="mt-2">
                        <InputElement
                          form={form}
                          name="hasSerial"
                          inputTypeCheckBox="checkbox"
                        />
                      </div>
                      <span className="text-sm mt-3">
                        {t("Has Serial Number")}
                      </span>
                    </div>

                    {watchSerialChecked && (
                      <div className="max-h-64 overflow-y-auto border-none p-2 rounded-md">
                        <div className="grid grid-cols-1 gap-2">
                          <label className=" text-sm !text-slate-500 ml-2">
                            {t("Serial Number")}
                          </label>
                          {Array.from({
                            length: Number(openingStockQuantity) || 0,
                          }).map((_, index) => (
                            <InputElement
                              key={index}
                              form={form}
                              name={`serialNumbers.${index}`}
                              placeholder={`Serial Number ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-4 border-t mt-6">
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  disabled={isSubmitDisabled}
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "4px 0 5px 0",
                    borderRadius: "8px",
                  }}
                  type="submit"
                  className={`transition-all ${
                    !isSubmitDisabled
                      ? "hover:bg-teal-700"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  text="Submit"
                />
              </ThemeProvider>
            </div>
          </fieldset>
        </form>
      </div>
      {units && (
        <div
          id="unit-overlay"
          onClick={handleOverlayClickForUnit}
          className="fixed inset-0 z-30 flex justify-center items-center bg-white ml-[13.7%] bg-opacity-50 backdrop-blur-sm"
        >
          <div className="z-40">
            <Add
              visible={units}
              onClose={() => setShowUnits(false)}
              onUnitAdded={() => {
                return;
              }}
            />
          </div>
        </div>
      )}
      {itemGroup && (
        <div
          id="itemGroup-overlay"
          onClick={handleOverlayClickForItemGroup}
          className="fixed inset-0 z-30 ml-[13.7%] flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm"
        >
          <div className="z-60">
            <AddItemGroup
              visible={itemGroup}
              onClose={() => setItemGroup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateItemForm;
