import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IRoles } from "../types/IRoles";
import { useEditRole } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { useGetAllRoles } from "../hooks";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { createTheme, ThemeProvider } from "@fluentui/react";
type Props = {
  form: UseFormReturn<IRoles>;
  Id: string | undefined;
  onClose: () => void;
  currentPageIndex: number;
};
const EditRoleForm = ({ form, Id, onClose, currentPageIndex }: Props) => {
  const updateRole = useEditRole(Id);
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllRoles(query);
  const onSubmit: SubmitHandler<IRoles> = async (form) => {
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg  font-semibold">Update Role</h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <img src={close} alt="close" className="w-8 h-7" />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <InputElement
                label="Name"
                layout="row"
                form={form}
                name="Name"
                placeholder="Enter Role Name"
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

export default EditRoleForm;
