import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ILedgerGroups } from "../types/ILedgerGroup";
import { useGetAllLedgerGroups, useEditLedgerGroup } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
// import { SelectElement } from "@/components/FormComponents/SelectElement";
// import { MouseEvent } from "react";

type Props = {
  form: UseFormReturn<ILedgerGroups>;
  //   masterId: number;
  onClose: () => void;
  currentPageIndex: number;
  ledgerGroupId: string;
};
const EditLedgerGroupForm = ({
  form,
  onClose,
  ledgerGroupId,
  currentPageIndex,
}: Props) => {
  const editLedgerGroup = useEditLedgerGroup();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllLedgerGroups(query);

  const onSubmit: SubmitHandler<ILedgerGroups> = async (form) => {
    try {
      await editLedgerGroup.mutateAsync({
        id: ledgerGroupId,
        data: form,
      });

      Toast.success("Successfully Updated ledger Group");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update ledger group" + error);
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
      className=" fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className=" w-[26rem] flex justify-center bg-white py-4 rounded-lg drop-shadow-lg">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-evenly mt-6">
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Ledger Name"
                    layout="row"
                    form={form}
                    name="name"
                    placeholder="Enter Ledger Group Name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Master"
                    layout="row"
                    form={form}
                    name="masterId"
                    placeholder="Enter MasterId"
                  />
                </div>

                {/* <div className="mb-4">
                  <label className=" text-sm ml-2 text-slate-500">
                    Master
                  </label>
                  <SelectElement
                    form={form}
                    name="masterId"
                    className="sm:!min-w-[150px] !min-w-full"
                    data={
                      organizations?.Items?.map(({ name, id }) => {
                        return {
                          label: name,
                          value: id!,
                        };
                      }) || []
                    }
                    value={organizationId} // Use this to set the currently selected value
                  />
                </div> */}
                <div className="mb-2 flex items-center">
                  <InputElement
                    label=""
                    layout="row"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isCustom"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Custom</p>
                </div>
                <div className="mb-2 flex items-center">
                  <InputElement
                    label=""
                    layout="row"
                    form={form}
                    inputTypeCheckBox="checkbox"
                    name="isPrimary"
                    customStyle="!border-0 after:!content-none"
                  />
                  <p className="ml-4 ">Is Primary</p>
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

export default EditLedgerGroupForm;
