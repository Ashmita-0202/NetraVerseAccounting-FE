import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IInstitution } from "../types/IInstitution";
import { useAddInstitution, useGetAllInstitution } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useGetAllOrganization } from "../../../developerUser/hooks/index";
import { SelectElement } from "@/components/FormComponents/SelectElement";
type Props = {
  form: UseFormReturn<IInstitution>;
  onClose: () => void;
};
const AddInstitutionForm = ({ form, onClose }: Props) => {
  const addInstitution = useAddInstitution();
  const { refetch } = useGetAllInstitution();
  const onSubmit: SubmitHandler<IInstitution> = async (data) => {
    try {
      await addInstitution.mutateAsync(data);
      Toast.success("Successfully added Institution");
      refetch();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to add Institution" + error);
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

  const { data: organization } = useGetAllOrganization();
  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center h-full items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className=" w-[32rem] flex bg-white py-4 rounded-lg drop-shadow-lg">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg  font-semibold">Add Institution</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="flex justify-evenly mt-6">
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Name"
                    layout="row"
                    form={form}
                    name="name"
                    placeholder="Enter Institution name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Address"
                    layout="row"
                    form={form}
                    name="address"
                    placeholder="Enter Address"
                    customStyle="placeholder:text-red-300"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Email"
                    layout="row"
                    form={form}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Short Name"
                    layout="row"
                    form={form}
                    name="shortName"
                    placeholder="Enter short name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Contact Number"
                    layout="row"
                    form={form}
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Contact Person"
                    layout="row"
                    form={form}
                    name="contactPerson"
                    placeholder="Enter Contact Person"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Pan"
                    layout="row"
                    form={form}
                    name="pan"
                    placeholder="Enter Pan"
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Image Url"
                    layout="row"
                    form={form}
                    name="imageUrl"
                    placeholder="Enter Image Url"
                  />
                </div>

                <div className="">
                  <label className=" text-sm text-slate-500 ml-2">
                    Organization
                  </label>
                  <SelectElement
                    form={form}
                    name="organizationId"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      organization?.Items?.map(({ name, id }) => {
                        return {
                          label: name,
                          value: id ?? "",
                        };
                      }) || []
                    }
                  />
                </div>
                <div className=" flex items-center">
                  <InputElement
                    label=""
                    layout="row"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isEnable"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Enable</p>
                </div>
                <div className=" flex items-center">
                  <InputElement
                    label=""
                    layout="row"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isDeleted"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Deleted</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 ">
              <ThemeProvider theme={customTheme} className="mr-3">
                <ButtonElement
                  style={{
                    backgroundColor: customTheme.palette.themePrimary,
                    padding: "4px 0 5px 0",
                    borderRadius: "6px",
                  }}
                  type="submit"
                  className="hover:bg-teal-700 transition-all !text-xm !font-bold"
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

export default AddInstitutionForm;
