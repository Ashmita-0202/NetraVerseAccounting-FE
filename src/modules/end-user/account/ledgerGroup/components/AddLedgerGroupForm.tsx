import { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { ILedgerGroups } from "../types/ILedgerGroup";
import { useAddLedgerGroup } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type Props = {
  form: UseFormReturn<ILedgerGroups>;
  onClose: () => void;
};

const AddLedgerGroupForm = ({ form, onClose }: Props) => {
  const addLedgerGroup = useAddLedgerGroup();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<ILedgerGroups> = async (data) => {
    form.reset();
    try {
      await addLedgerGroup.mutateAsync(data);
      Toast.success("Successfully added LedgerGroup");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add LedgerGroup");
      } else {
        Toast.error("Failed to add LedgerGroup: " + error);
      }
    } finally {
      onClose();
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="w-[26rem] bg-white py-10 px-8 rounded-3xl shadow-2xl transform transition-all duration-300">
        <h1 className="text-lg font-semibold mb-4">{t("Add LedgerGroup")}</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-2">
            <InputElement
              label="Ledger Name"
              layout="column"
              form={form}
              name="name"
              placeholder="Enter LedgerGroup name"
            />
          </div>
          <div className=" flex items-center ml-2">
            <InputElement
              label=""
              layout="row"
              form={form}
              inputTypeCheckBox="checkbox"
              name="isCustom"
              customStyle="!border-0 after:!content-none"
            />
            <h1 className="relative ml-2">{t("Is Custom")}</h1>
          </div>
          <div className="mb-2 flex items-center ml-2">
            <InputElement
              label=""
              layout="row"
              form={form}
              inputTypeCheckBox="checkbox"
              name="isPrimary"
              customStyle="!border-0 after:!content-none"
            />
            <h1 className="relative ml-2">{t("Is Primary")}</h1>
          </div>
          <div className="mb-4 relative ">
            <InputElement
              label="Master"
              layout="column"
              form={form}
              type="number"
              name="masterId"
              placeholder="Enter master ID"
            />
          </div>
          <div className="flex justify-center">
            <ThemeProvider theme={customTheme}>
              <ButtonElement
                style={{
                  backgroundColor: customTheme.palette.themePrimary,
                  padding: "4px 0 5px 0",
                  borderRadius: "8px",
                }}
                type="submit"
                className="hover:bg-teal-700 transition-all !text-xm !font-bold"
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

export default AddLedgerGroupForm;
