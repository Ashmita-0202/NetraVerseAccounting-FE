import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IUnits } from "../types/IUnits";
import { useGetAllUnits, useEditUnits } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
// import { SelectElement } from "@/components/FormComponents/SelectElement";
// import { MouseEvent } from "react";

type Props = {
  form: UseFormReturn<IUnits>;
  //   masterId: number;
  onClose: () => void;
  currentPageIndex: number;
  unitsId: string;
};
const EditUnitsForm = ({ form, onClose, unitsId, currentPageIndex }: Props) => {
  const { t } = useTranslation();
  const editUnits = useEditUnits();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllUnits(query);

  const onSubmit: SubmitHandler<IUnits> = async (form) => {
    try {
      await editUnits.mutateAsync({
        id: unitsId,
        data: form,
      });

      Toast.success("Successfully Updated Units");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update Units" + error);
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
  const isSubmitDisabled = !form.watch("name");
  return (
    <div
      id="container"
      className=" fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className=" w-[26rem]   bg-white py-4 rounded-lg drop-shadow-lg">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center ml-2 mb-4">
              <h1 className="text-lg font-semibold">{t("Update Unit")}</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl mr-2  hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="flex justify-evenly mt-6">
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Unit Name"
                    layout="row"
                    form={form}
                    name="name"
                    placeholder="Enter Units Name"
                  />
                </div>
                <div className="mb-2 flex items-center ml-2">
                  <InputElement
                    layout="row"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isEnabled"
                    customStyle="!border-0 after:!content-none"
                  />
                  <h1 className="relative ml-2">{t("Is Enabled")}</h1>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 ">
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
    </div>
  );
};

export default EditUnitsForm;
