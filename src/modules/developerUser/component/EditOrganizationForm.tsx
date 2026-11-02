import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IOrganization } from "../types/IOrganization";
import { useEditOrganization, useGetAllOrganization } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";

type Props = {
  form: UseFormReturn<IOrganization>;
  onClose: () => void;
  organizationId: string;
  currentPageIndex: number;
};

const EditOrganizationForm = ({
  form,
  onClose,
  currentPageIndex,
  organizationId,
}: Props) => {
  const UpdateOrganization = useEditOrganization(organizationId);
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllOrganization(query);
  const onSubmit: SubmitHandler<IOrganization> = async (data) => {
    try {
      await UpdateOrganization.mutateAsync(data);
      Toast.success("Organization updated successfully!");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data || "An error occurred");
      } else {
        Toast.error("Failed to update organization");
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
      className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center justify-center min-h-screen  p-6">
        <div className="bg-white shadow-lg lg:min-w-[500px] sm:min-w-[300px] p-10 rounded-lg">
          <h2 className="text-2xl font-bold text-teal-600 text-center mb-6">
            Update Organization
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <InputElement
                label="Organization Name"
                name="name"
                placeholder="Enter organization name"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Address"
                name="address"
                placeholder="Enter address"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                placeholder="Enter mobile number"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Logo Url"
                name="logo"
                placeholder="Enter logo URL"
                form={form}
              />
            </div>
            <div className="mb-4">
              <InputElement
                label="Province Id"
                name="provinceId"
                type="number"
                placeholder="Enter province ID"
                form={form}
              />
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
              <ThemeProvider theme={customTheme}>
                <ButtonElement
                  style={{
                    padding: "4px 0 5px 0",
                    borderRadius: "6px",
                  }}
                  type="button"
                  onClick={() => onClose()}
                  className="hover:bg-red-500 transition-all !bg-gray-400 !text-xm !font-bold"
                  text={"Discard"}
                />
              </ThemeProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationForm;
