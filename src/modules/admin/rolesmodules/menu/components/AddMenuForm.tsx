import { SubmitHandler, UseFormReturn } from "react-hook-form";

import { IMenu } from "../types/IMenu";
import { useAddMenu } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { useGetAllSubModules } from "../../subModules/hooks";
import { SelectElement } from "@/components/FormComponents/SelectElement";
type Props = {
  form: UseFormReturn<IMenu>;
  onClose: () => void;
};
const AddMenuForm = ({ form, onClose }: Props) => {
  const addMenu = useAddMenu();

  const onSubmit: SubmitHandler<IMenu> = async (data) => {
    try {
      await addMenu.mutateAsync(data);
      Toast.success("Successfully added Menu");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to add Menu" + error);
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

  const { data: submodules } = useGetAllSubModules();
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className=" max-h-screen w-[25rem]">
        <div className="rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg  font-semibold">Add Menu</h1>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-400 text-2xl hover:text-red-500 "
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="mb-4">
                <InputElement
                  label="Name"
                  layout="column"
                  form={form}
                  name="name"
                  placeholder="Enter menu name"
                />
              </div>
              <div className="mb-4">
                <InputElement
                  label="Target Url"
                  layout="column"
                  form={form}
                  name="targetUrl"
                  placeholder="Enter Target Url"
                  customStyle="placeholder:text-red-300"
                />
              </div>
              <div className="mb-4">
                <InputElement
                  label="Icon Url"
                  layout="column"
                  form={form}
                  name="iconUrl"
                  placeholder="Enter Icon URl"
                />
              </div>
              <div className="mb-4">
                <label className=" text-sm">Sub Modules</label>
                <SelectElement
                  form={form}
                  name="subModulesId"
                  className="sm:!min-w-[150px] !min-w-full"
                  data={
                    submodules?.Items?.map(({ name, id }) => {
                      return {
                        label: name,
                        value: id ?? "",
                      };
                    }) || []
                  }
                />
              </div>

              <div className="mb-4">
                <InputElement
                  label="Rank"
                  layout="column"
                  form={form}
                  name="rank"
                  placeholder="Enter rank name"
                />
              </div>
              <div className="mb-2 flex items-center">
                <InputElement
                  label=""
                  layout="column"
                  form={form}
                  inputTypeCheckBox="checkbox"
                  name="isActive"
                  customStyle="!border-0 after:!content-none"
                />
                <p className="ml-4 ">Is Active</p>
              </div>
              <div className="flex mt-4 justify-center space-x-2">
                <ThemeProvider theme={customTheme}>
                  <ButtonElement
                    style={{
                      backgroundColor: customTheme.palette.themePrimary,
                      padding: "4px 0 5px 0",
                      borderRadius: "6px",
                    }}
                    type="submit"
                    className="hover:bg-teal-700 transition-all !text-xm font-bold !bg-teal-500"
                    text="Submit"
                  />
                </ThemeProvider>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenuForm;
