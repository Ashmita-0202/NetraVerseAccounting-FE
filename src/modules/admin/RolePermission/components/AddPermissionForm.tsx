import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IRolePermission } from "../types/IRolePermission";
import { useAddPermission } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { useGetAllRoles } from "../../rolesdepartment/hooks";

type Props = {
  form: UseFormReturn<IRolePermission>;
  onClose: () => void;
};

const AddPermissionForm = ({ form, onClose }: Props) => {
  const addPermission = useAddPermission();
  const { data: roles } = useGetAllRoles();
  const onSubmit: SubmitHandler<IRolePermission> = async (data) => {
    try {
      await addPermission.mutateAsync(data);
      Toast.success("Successfully added User");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data
          : `Failed to add user: ${error}`;
      Toast.error(errorMessage);
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const customTheme1 = createTheme({
    palette: {
      themePrimary: "#f97316",
    },
  });

  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className="max-h-screen w-[20rem]">
        <div className="rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg  font-semibold">Add Permission</h1>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-400 text-2xl hover:text-red-500 "
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="grid grid-rows-2 gap-4 flex-1">
                  <InputElement
                    label="Name"
                    form={form}
                    layout="row"
                    name="name"
                    placeholder="Enter permission name"
                  />
                  <div className="mb-4">
                    <label className=" text-sm">Roles</label>
                    <SelectElement
                      form={form}
                      name="roleId"
                      className="sm:!min-w-[150px] !min-w-full"
                      data={
                        roles?.Items?.map(({ Name, Id }) => {
                          return {
                            label: Name,
                            value: Id ?? "",
                          };
                        }) || []
                      }
                    />
                  </div>
                </div>
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
                <ThemeProvider>
                  <ButtonElement
                    style={{
                      backgroundColor: customTheme1.palette.themePrimary,
                      padding: "4px 0 5px 0",
                      borderRadius: "6px",
                    }}
                    type="button"
                    className="hover:bg-gray-700 transition-all !text-xm font-bold !bg-gray-400 "
                    text="Discard"
                    onClick={onClose}
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

export default AddPermissionForm;
