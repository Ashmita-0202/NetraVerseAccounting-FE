import { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { IItemGroup } from "../types/IItemGroup";
import { useAddItemGroup, useGetAllItemGroup } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import close from "@/assets/xmark-solid.svg";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { AppCombobox } from "@/components/common/ComboBox";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  form: UseFormReturn<IItemGroup>;
  onClose: () => void;
};

const AddItemGroupForm = ({ form, onClose }: Props) => {
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  const { t } = useTranslation();
  const { data: itemGroup } = useGetAllItemGroup();
  const addItemGroup = useAddItemGroup();
  const { watch, setValue } = form;
  const isChecked = watch("isPrimary", false);
  const [itemGroupId, setItemGroupId] = useState("");
  const handleCheckBoxChange = () => {
    setValue("isPrimary", !isChecked);
  };
  useHotkeys("esc", onClose, {
    enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
  });

  const onSubmit: SubmitHandler<IItemGroup> = async (data) => {
    try {
      await addItemGroup.mutateAsync(data);
      Toast.success("Successfully added ItemGroup");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "Failed to add ItemGroup");
      } else {
        Toast.error("Failed to add ItemGroup: " + error);
      }
    } finally {
      onClose();
      setItemGroupId("");
    }
  };

  const handleSelectItemGroup = (itemGroupId: string) => {
    form.setValue("itemGroupId", itemGroupId);
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
      className="fixed inset-0 flex justify-center z-30 items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="max-h-screen w-[30rem]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">{t("Add Item Group")}</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl  hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="mb-6">
              <InputElement
                required
                ref={refForInput}
                label="Item Group Name"
                layout="column"
                form={form}
                name="name"
                placeholder="Enter name of Item Group"
              />
            </div>
            <div className="mb-6">
              <InputElement
                label="Description"
                layout="column"
                form={form}
                name="description"
                placeholder="Enter Description"
              />
            </div>
            <div className="mb-6 relative flex items-center">
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
              <div className="mb-6">
                {itemGroup && (
                  <AppCombobox
                    value={itemGroupId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Item Group"
                    options={itemGroup.Items}
                    selected={
                      itemGroup.Items.find((g) => g.id === itemGroupId) || null
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
                )}
              </div>
            )}

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
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddItemGroupForm;
