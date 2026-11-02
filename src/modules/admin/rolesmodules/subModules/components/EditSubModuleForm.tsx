import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ISubModules } from "../types/ISubModules";
import { useEditSubModule, useGetAllSubModules } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import close from "@/assets/xmark-solid.svg";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { useGetAllModules } from "../../modules/hooks";
// import { MouseEvent } from "react";
type Props = {
  form: UseFormReturn<ISubModules>;
  subModulesId: string;
  onClose: () => void;
  modulesId: string;
  currentPageIndex: number;
};

const EditSubModuleForm = ({
  form,
  subModulesId,
  onClose,
  modulesId,
  currentPageIndex,
}: Props) => {
  const editSubModule = useEditSubModule();
  const { data: modules } = useGetAllModules();

  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllSubModules(query);

  const onSubmit: SubmitHandler<ISubModules> = async (form) => {
    try {
      await editSubModule.mutateAsync({
        id: subModulesId,
        data: form,
      });

      Toast.success("Successfully Updated SubModule");
      onClose();
      refetch();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update SubModule" + error);
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
      className="fixed inset-0 flex justify-center items-center border-rounded-lg  backdrop-blur-sm"
    >
      <div className=" max-h-screen w-[25rem]">
        <div className="rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg  font-semibold">Update SubModule</h1>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-400 text-2xl hover:text-red-500 "
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Name"
                    layout="column"
                    form={form}
                    name="name"
                    placeholder="Enter submodule name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Icon Url"
                    layout="column"
                    form={form}
                    name="iconUrl"
                    placeholder="Enter Icon Url"
                    customStyle="placeholder:text-red-300"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Target Url"
                    layout="column"
                    form={form}
                    name="targetUrl"
                    placeholder="Enter target URl"
                  />
                </div>
                <div className="mb-4">
                  <label className=" text-sm">Module</label>
                  <SelectElement
                    form={form}
                    name="modulesId"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      modules?.Items?.map(({ Name, Id }) => {
                        return {
                          label: Name,
                          value: Id ?? "",
                        };
                      }) || []
                    }
                    value={modulesId}
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
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubModuleForm;
