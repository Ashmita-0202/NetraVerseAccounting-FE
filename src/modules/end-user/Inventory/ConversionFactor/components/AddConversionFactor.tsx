import { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { IConversionFactor } from "../types/IConversionFactor";
import { useAddConversionFactor } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { useGetAllUnits } from "../../Units/hooks";
import { AppCombobox } from "@/components/common/ComboBox";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
type Props = {
  form: UseFormReturn<IConversionFactor>;
  onClose: () => void;
};

const AddConversionFactorForm = ({ form, onClose }: Props) => {
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  const { t } = useTranslation();
  const addConversionFactor = useAddConversionFactor();
  const { data: Units } = useGetAllUnits();
  const [toUnitId, setToUnitId] = useState("");
  const [fromUnitId, setFromUnitId] = useState("");
  const onSubmit: SubmitHandler<IConversionFactor> = async (data) => {
    try {
      await addConversionFactor.mutateAsync(data);
      Toast.success("Successfully added ConversionFactor");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add ConversionFactor");
      } else {
        Toast.error("Failed to add ConversionFactor: " + error);
      }
    } finally {
      handleClose();
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const handleSelectFromUnit = (unitId: string) => {
    form.setValue("fromUnit", unitId);
  };
  const handleSelectToUnit = (unitId: string) => {
    form.setValue("toUnit", unitId);
  };
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });
  useHotkeys(
    "esc",
    (event) => {
      event.preventDefault();
      handleClose();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
      preventDefault: true,
    }
  );
  const isSubmitDisabled =
    !form.watch("conversionFactor") ||
    !form.watch("fromUnit") ||
    !form.watch("toUnit") ||
    !form.watch("name");
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="w-[26rem] bg-white py-6 px-8 rounded-3xl shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">
            {t("Add Conversion Factor")}
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="text-red-400 text-2xl  hover:text-red-500 "
          >
            <img src={close} alt="close" className="w-8 h-7" />
          </button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <InputElement
              required
              ref={refForInput}
              label="Conversion Name"
              layout="column"
              form={form}
              name="name"
              type="text"
              placeholder="Enter name of Conversion"
            />
          </div>
          <div className="mb-4">
            <AppCombobox
              required
              value={fromUnitId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="From Unit"
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
              label="To Unit"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConversionFactorForm;
