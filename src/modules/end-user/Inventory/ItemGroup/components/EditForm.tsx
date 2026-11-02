import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IItemGroup } from "../types/IItemGroup";
import {
  useGetAllItemGroup,
  useEditItemGroup,
  useGetItemGroupById,
} from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

type Props = {
  form: UseFormReturn<IItemGroup>;
  onClose: () => void;
  currentPageIndex: number;
  ItemGroupId: string;
};
const EditItemGroupForm = ({
  form,
  onClose,
  ItemGroupId,
  currentPageIndex,
}: Props) => {
  const { t } = useTranslation();
  const editItemGroup = useEditItemGroup();
  const pageSize = 5;
  const { data: itemGroupData } = useGetItemGroupById(ItemGroupId);
  useEffect(() => {
    if (itemGroupData) {
      form.reset({
        id: itemGroupData?.id ?? "",
        name: itemGroupData?.name ?? "",
        itemGroupId: itemGroupData?.itemGroupId ?? "",
        description: itemGroupData?.description ?? null,
        isPrimary: itemGroupData?.isPrimary ?? false,
      });
    }
  }, [itemGroupData, form]);
  const { watch, setValue } = form;
  const isChecked = watch("isPrimary", false);

  const handleCheckBoxChange = () => {
    setValue("isPrimary", !isChecked);
  };
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  const { data: itemGroup } = useGetAllItemGroup();
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllItemGroup(query);
  const onSubmit: SubmitHandler<IItemGroup> = async (form) => {
    try {
      await editItemGroup.mutateAsync({
        id: ItemGroupId,
        data: form,
      });

      Toast.success("Successfully Updated Item Group");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update Item Group" + error);
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
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className=" max-h-screen w-[30rem]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">
                {t("Update Item Group")}
              </h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl  hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="mb-4">
              <InputElement
                required
                ref={refForInput}
                label="Item Group Name"
                layout="column"
                form={form}
                name="name"
                placeholder="Enter name of the Item Group"
              />
            </div>
            <div className="mb-2">
              <InputElement
                label="Description"
                layout="column"
                form={form}
                name="description"
                placeholder="Enter Description"
              />
            </div>
            <div className="mb-4 relative flex items-center">
              <label className="pl-2 test-slate-500 pr-2">
                {t("Is Primary")}
              </label>
              <InputElement
                layout="row"
                form={form}
                checked={isChecked}
                onChange={handleCheckBoxChange}
                name="isPrimary"
                inputTypeCheckBox="checkbox"
                customStyle="!border-0 after:!content-none"
              />
            </div>
            {!isChecked && (
              <div className="mb-4">
                <label className=" text-sm">{t("Item Group")}</label>
                <SelectElement
                  form={form}
                  name="itemGroupId"
                  className="sm:!min-w-[150px] !min-w-full"
                  data={
                    itemGroup?.Items?.map(({ name, id }) => {
                      return {
                        label: name,
                        value: id ?? "",
                      };
                    }) || []
                  }
                />
              </div>
            )}

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
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default EditItemGroupForm;
