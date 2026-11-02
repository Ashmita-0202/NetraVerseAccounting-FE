import { useEffect, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IConversionFactor } from "../types/IConversionFactor";
import {
  useGetConversionFactorById,
  useEditConversionFactor,
  useGetAllConversionFactor,
} from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import close from "@/assets/xmark-solid.svg";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { useGetAllUnits } from "../../Units/hooks";
import { AppCombobox } from "@/components/common/ComboBox";

type Props = {
  form: UseFormReturn<IConversionFactor>;
  onClose: () => void;
  currentPageIndex: number;
  ConversionFactorId: string;
};

const EditConversionFactorForm = ({
  form,
  onClose,
  ConversionFactorId,
  currentPageIndex,
}: Props) => {
  const { data: conversionFactorData, isSuccess: isConversionDataReady } =
    useGetConversionFactorById(ConversionFactorId);
  const { data: Units, isSuccess: isUnitsReady } = useGetAllUnits();
  const [toUnitId, setToUnitId] = useState("");
  const [fromUnitId, setFromUnitId] = useState("");
  const editConversionFactor = useEditConversionFactor();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllConversionFactor(query);
  const handleSelectFromUnit = (unitId: string) => {
    form.setValue("fromUnit", unitId);
  };
  const handleSelectToUnit = (unitId: string) => {
    form.setValue("toUnit", unitId);
  };
  // Initialize form when both datasets are ready
  useEffect(() => {
    if (
      isConversionDataReady &&
      isUnitsReady &&
      conversionFactorData &&
      Units
    ) {
      // Verify the units exist in the options
      const fromUnitExists = Units.Items.some(
        (item) => item.id === conversionFactorData.fromUnit
      );
      const toUnitExists = Units.Items.some(
        (item) => item.id === conversionFactorData.toUnit
      );
      setFromUnitId(conversionFactorData.fromUnit);
      setToUnitId(conversionFactorData.toUnit);
      form.reset({
        fromUnit: fromUnitExists ? conversionFactorData.fromUnit : "",
        toUnit: toUnitExists ? conversionFactorData.toUnit : "",
        conversionFactor: Number(conversionFactorData.conversionFactor),
        name: conversionFactorData.name,
      });
    }
  }, [isConversionDataReady, isUnitsReady, conversionFactorData, Units, form]);

  const onSubmit: SubmitHandler<IConversionFactor> = async (formData) => {
    try {
      await editConversionFactor.mutateAsync({
        id: ConversionFactorId,
        data: formData,
      });
      Toast.success("Successfully Updated Conversion Factor");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update Conversion Factor" + error);
      }
    }
  };
  const isSubmitDisabled =
    !form.watch("conversionFactor") ||
    !form.watch("fromUnit") ||
    !form.watch("toUnit") ||
    !form.watch("name");
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-0 backdrop-blur-sm">
      <div className="w-[30rem] bg-white p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-700">
            Update Conversion Factor
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <img src={close} alt="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <InputElement
              required
              label="Conversion Name"
              layout="column"
              form={form}
              name="name"
              type="text"
              defaultValue={form.watch("name") || ""}
              placeholder="Enter name of Conversion"
            />
          </div>
          <div className="mb-4">
            <AppCombobox
              required
              value={fromUnitId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="From Unit "
              options={Units?.Items}
              selected={Units?.Items.find((g) => g.id === fromUnitId) || null}
              onSelect={(group) => {
                if (group) {
                  setFromUnitId(group.id || "");
                  handleSelectFromUnit(group.id || "");
                } else {
                  setFromUnitId("");
                }
              }}
              getLabel={(g) => g?.name || ""}
              getValue={(g) => g?.id ?? ""}
            />
          </div>
          <div className="mb-4">
            <AppCombobox
              required
              value={toUnitId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="To Unit "
              options={Units?.Items}
              selected={Units?.Items.find((g) => g.id === toUnitId) || null}
              onSelect={(group) => {
                if (group) {
                  setToUnitId(group.id || "");
                  handleSelectToUnit(group.id || "");
                } else {
                  setToUnitId("");
                }
              }}
              getLabel={(g) => g?.name || ""}
              getValue={(g) => g?.id ?? ""}
            />
          </div>
          <div className="mb-4">
            <InputElement
              required
              label="Conversion Factor"
              layout="column"
              form={form}
              name="conversionFactor"
              type="number"
              defaultValue={form.watch("conversionFactor") || ""}
              placeholder="Enter conversionFactor"
            />
          </div>

          <div className="flex justify-center">
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

            <ThemeProvider theme={customTheme} className="ml-2">
              <ButtonElement
                style={{
                  padding: "4px 0 5px 0",
                  borderRadius: "8px",
                }}
                type="button"
                onClick={() => onClose()}
                className="hover:bg-teal-700 !bg-gray-400 transition-all !text-xm !font-bold "
                text="Discard"
              />
            </ThemeProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConversionFactorForm;
