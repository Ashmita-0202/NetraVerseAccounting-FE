import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { UseFormReturn } from "react-hook-form";
import { IJournalStatus } from "../types/ISettings";
import { Toast } from "@/helper/getToast";
import {
  useGetJournalRefByCompany,
  useUpdateJournalRefByCompany,
} from "../hooks";
import { SubmitHandler } from "react-hook-form";
type Props = {
  form: UseFormReturn<IJournalStatus>;
};
const SalesSettingsForm = ({ form }: Props) => {
  const { isSubmitting } = form.formState;
  const companyId = localStorage.getItem("companyId");
  const editBillNumberStatusForSales = useUpdateJournalRefByCompany();
  const { refetch } = useGetJournalRefByCompany(companyId);
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const data = [
    { name: "Automatic", value: 1 },
    { name: "Manual", value: 0 },
  ];

  const onSubmit: SubmitHandler<IJournalStatus> = async (form) => {
    try {
      await editBillNumberStatusForSales.mutateAsync({
        id: companyId,
        data: form,
      });
      Toast.success("Successfully Updated Sales Settings");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full mx-auto  rounded-xl p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Account Settings
        </h1>

        <div className="my-4 flex w-[51.5%] justify-between mt-10">
          <label className="text-sm text-gray-600 block mb-1">
            Journal Reference
          </label>
          <SelectElement
            form={form}
            name="journalReferences"
            className="w-full border items-center rounded-lg px-3 py-2"
            data={data.map(({ name, value }) => ({ label: name, value }))}
          />
        </div>
        {/* <div className="flex items-center space-x-2 mb-4">
          <input type="checkbox" className="w-4 h-4 accent-teal-500" />
          <label className="text-gray-700">Show Serial Number</label>
        </div> */}
        <div className="flex mt-6 space-x-3">
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "8px 16px",
                borderRadius: "8px",
              }}
              type="submit"
              className="text-white font-medium transition hover:bg-teal-700"
              text={isSubmitting ? "Saving..." : "Change"}
              disabled={isSubmitting}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};

export default SalesSettingsForm;
