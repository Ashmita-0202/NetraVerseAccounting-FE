import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ICompany } from "../types/ICompany";
import { useAddCompany, useGetAllCompany } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import close from "@/assets/xmark-solid.svg";
import { useGetAllInstitution } from "../../Institution/hooks";
import { SelectElement } from "@/components/FormComponents/SelectElement";
type Props = {
  form: UseFormReturn<ICompany>;
  onClose: () => void;
};
const AddCompanyForm = ({ form, onClose }: Props) => {
  const { refetch: companyRefetch } = useGetAllCompany();
  const addCompany = useAddCompany();
  const data = [
    { name: "Automatic", value: 1 },
    { name: "Manual", value: 0 },
  ];
  const { data: institution, refetch } = useGetAllInstitution();
  const onSubmit: SubmitHandler<ICompany> = async (data) => {
    try {
      await addCompany.mutateAsync(data);
      Toast.success("Successfully added Company");
      refetch();
      companyRefetch();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to add Company" + error);
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
    <div className="fixed pl-[6%]  bg-black bg-opacity-50 flex  z-50  inset-0  items-center justify-center pt-5 w-full h-full">
      <div className="w-[88%]  h-[100%] bg-white p-4 overflow-auto relative">
        <div className=" w-full ">
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <div className="flex justify-between items-center my-2 ">
              <h1 className="text-lg font-semibold pl-6 ">Add Company</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Name"
                    layout="column"
                    form={form}
                    name="name"
                    placeholder="Enter Company name"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Address"
                    layout="column"
                    form={form}
                    name="address"
                    placeholder="Enter Address"
                    customStyle="placeholder:text-red-300"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Email"
                    layout="column"
                    form={form}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Short Name"
                    layout="column"
                    form={form}
                    name="shortName"
                    placeholder="Enter short name"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Contact Number"
                    layout="column"
                    form={form}
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Contact Person"
                    layout="column"
                    form={form}
                    name="contactPerson"
                    placeholder="Enter Contact Person"
                  />
                </div>
              </div>
              <div>
                <div className="mt-[3%]">
                  <label className=" text-sm !text-slate-500 ml-2">
                    Pan No
                  </label>
                  <InputElement
                    label="Pan"
                    layout="column"
                    form={form}
                    name="pan"
                    placeholder="Enter Pan"
                  />
                </div>
                <div className="mt-[3%]">
                  <InputElement
                    label="Image Url"
                    layout="column"
                    form={form}
                    name="imageUrl"
                    placeholder="Enter Image Url"
                  />
                </div>

                <div className="mt-[3%]">
                  <label className=" text-sm !text-slate-500 ml-2">
                    Institution
                  </label>
                  <SelectElement
                    form={form}
                    name="institutionId"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      institution?.Items?.map(({ name, id }) => {
                        return {
                          label: name,
                          value: id ?? "",
                        };
                      }) || []
                    }
                  />
                </div>
                <div className=" flex items-center mt-[3%]">
                  <InputElement
                    label=""
                    layout="column"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isEnable"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Enable</p>
                </div>
                <div className=" flex items-center ">
                  <InputElement
                    label=""
                    layout="column"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isDeleted"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Deleted</p>
                </div>
                <div className="mt-[3%]">
                  <label className=" text-sm !text-slate-500 ml-2">
                    Type For Purchase
                  </label>
                  <SelectElement
                    form={form}
                    name="billNumberGenerationTypeForPurchase"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      data?.map(({ name, value }) => {
                        return {
                          label: name,
                          value: value,
                        };
                      }) || []
                    }
                  />
                </div>
                <div className="mt-[3%]">
                  <label className=" text-sm !text-slate-500 ml-2">
                    Bill Number Generation Type For Sales
                  </label>
                  <SelectElement
                    form={form}
                    name="billNumberGenerationTypeForSales"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      data?.map(({ name, value }) => {
                        return {
                          label: name,
                          value: value,
                        };
                      }) || []
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-[3%] mx-10">
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

export default AddCompanyForm;
