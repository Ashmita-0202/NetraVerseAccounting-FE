import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IUnits } from "../types/IUnits";
import { useAddUnits } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import close from "@/assets/xmark-solid.svg";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useRef } from "react";

type Props = {
  form: UseFormReturn<IUnits>;
  onClose: () => void;
  onUnitAdded: () => void;
};

const AddUnitsForm = ({ form, onClose, onUnitAdded }: Props) => {
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  const addUnits = useAddUnits();
  const { t } = useTranslation();
  const handleClose = () => {
    form.reset();
    onClose();
  };
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
  const onSubmit: SubmitHandler<IUnits> = async (data) => {
    try {
      await addUnits.mutateAsync(data);
      onUnitAdded();
      Toast.success("Successfully added Units");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add Units");
      } else {
        Toast.error("Failed to add Units: " + error);
      }
    } finally {
      handleClose();
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const isSubmitDisabled = !form.watch("name");
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 px-8 py-6 relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {t("Add Unit")}
          </h2>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition duration-200"
          >
            <img src={close} alt="close" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <InputElement
              required
              ref={refForInput}
              label="Unit Name"
              layout="column"
              form={form}
              name="name"
              placeholder="Enter unit name"
              customStyle="focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-3 ml-1">
            <InputElement
              layout="row"
              form={form}
              inputTypeCheckBox="checkbox"
              name="isEnabled"
              customStyle="!border-0 after:!content-none"
            />
            <label htmlFor="isEnabled" className="text-gray-700 text-sm">
              {t("Is Enabled")}
            </label>
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

export default AddUnitsForm;
