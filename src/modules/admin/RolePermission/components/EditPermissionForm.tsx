import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IRolePermission } from "../types/IRolePermission";
import { useEditRolePermission } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllPermission } from "../hooks";
import close from "@/assets/xmark-solid.svg";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { useGetAllRoles } from "../../rolesdepartment/hooks";

type Props = {
  form: UseFormReturn<IRolePermission>;
  Id: string | undefined;
  onClose: () => void;
};
const EditRolePermissionForm = ({ form, Id, onClose }: Props) => {
  const updateRole = useEditRolePermission(Id);
  const { data: roles } = useGetAllRoles();
  const onSubmit: SubmitHandler<IRolePermission> = async (form) => {
    try {
      await updateRole.mutateAsync(form);
      Toast.success("Successfully updated Role");
      onClose();
      refetch();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to add module" + error);
      }
    } finally {
      onClose();
    }
  };

  const { refetch } = useGetAllPermission();
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });
  return (
    <div
      id="container"
      className=" fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 z-[5] backdrop-blur-sm"
    >
      <div className="w-[16rem] flex justify-center bg-white rounded-lg drop-shadow-lg py-4">
        <div>
          <h1 className="mb-4 text-lg font-semibold">
            Update Permission
            <img
              src={close}
              onClick={onClose}
              className="h-6 w-6 float-right cursor-pointer"
            />
          </h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <InputElement
                label="Name"
                layout="row"
                form={form}
                name="name"
                placeholder="Enter Permission Name"
              />
            </div>
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
            <div className="flex justify-center ">
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "10px 0 10px 0",
                    borderRadius: "8px",
                  }}
                  type="submit"
                  className="hover:bg-teal-700 transition-all !text-xs font-bold !bg-teal-500"
                  text={"Submit"}
                />
              </ThemeProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRolePermissionForm;
