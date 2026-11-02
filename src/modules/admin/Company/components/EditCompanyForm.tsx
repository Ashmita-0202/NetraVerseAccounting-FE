import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ICompany } from "../types/ICompany";
import { useEditCompany, useGetAllCompany } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { useGetAllInstitution } from "../../Institution/hooks";
import { SelectElement } from "@/components/FormComponents/SelectElement";

type Props = {
  form: UseFormReturn<ICompany>;
  CompanyId: string;
  onClose: () => void;
  currentPageIndex: number;
  institutionId: string;
};
const EditCompanyForm = ({
  form,
  onClose,
  CompanyId,
  currentPageIndex,
  institutionId,
}: Props) => {
  const editCompany = useEditCompany();
  const { data: institutions } = useGetAllInstitution();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllCompany(query);
  const data = [
    { name: "Automatic", value: 1 },
    { name: "Manual", value: 0 },
  ];
  const onSubmit: SubmitHandler<ICompany> = async (form) => {
    try {
      await editCompany.mutateAsync({
        id: CompanyId,
        data: form,
      });

      Toast.success("Successfully Updated Company");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update Company" + error);
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
      className=" fixed inset-0 flex justify-center  items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className="w-[36rem] flex  bg-white py-4 rounded-lg drop-shadow-lg">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg ml-4 font-semibold">Update Company</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 mr-2 text-2xl hover:text-red-500 "
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
                    placeholder="Enter Company name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Address"
                    layout="row"
                    form={form}
                    name="address"
                    placeholder="Enter address"
                    customStyle="placeholder:text-red-300"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Email"
                    layout="row"
                    form={form}
                    name="email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Short Name"
                    layout="row"
                    form={form}
                    name="shortName"
                    placeholder="Enter shortName"
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
                    placeholder="Enter pan"
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
                <div className="mb-4">
                  <label className=" text-sm text-slate-500 ml-2">
                    Institution
                  </label>
                  <SelectElement
                    form={form}
                    name="institutionId"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      institutions?.Items?.map(({ name, id }) => {
                        return {
                          label: name,
                          value: id!,
                        };
                      }) || []
                    }
                    value={institutionId} // Use this to set the currently selected value
                  />
                </div>
                <div className="mb-2 flex items-center">
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
                <div className="">
                  <label className=" text-sm !text-slate-500 ml-2">
                    Bill Number Generation Type For Purchase
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
                <div className="">
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
            <div className="flex justify-center mt-4 mx-10">
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

export default EditCompanyForm;
