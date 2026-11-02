import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IPaymentMethod } from "../types/IPaymentMethod";
import Addition from "@/assets/square-plus-solid.svg";
import { useGetAllPaymentMethod, useEditPaymentMethod } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import close from "@/assets/xmark-solid.svg";
import { AxiosError } from "axios";
import { AppCombobox } from "@/components/common/ComboBox";
import { useState } from "react";
import AddL from "@/modules/end-user/account/ledger/pages/Add";
import { useGetAllLedgerGroups } from "@/modules/end-user/account/ledgerGroup/hooks";
import MasterName from "@/modules/end-user/Report/TrialBalance/components/MasterName";
import { useTranslation } from "react-i18next";

type Props = {
  form: UseFormReturn<IPaymentMethod>;
  //   masterId: number;
  onClose: () => void;
  currentPageIndex: number;
  unitsId: string;
};
const EditPaymentMethodForm = ({
  form,
  onClose,
  unitsId,
  currentPageIndex,
}: Props) => {
  const { t } = useTranslation();
  const editPaymentMethod = useEditPaymentMethod();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllPaymentMethod(query);
  const handleOpenAddLedgerForm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddLedgerForm(true);
  };
  const { data: allLedger } = useGetAllLedgerGroups();
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const validLedgerGroupIds = [
    "a1d2f3b4-c5e6-7890-a123-b456c789d012",
    "z6t7u8v9-a012-3456-z789-a012b345c678",
  ];
  const ledger = allLedger?.Items.filter((group) =>
    validLedgerGroupIds.includes(group.id)
  );
  const handleCloseAddLedgerForm = () => {
    setShowAddLedgerForm(false);
  };
  const [showAddLedgerForm, setShowAddLedgerForm] = useState(false);
  const handleSelectLedger = (ledgerId: string) => {
    form.setValue("ledgerGroupId", ledgerId);
  };
  const onSubmit: SubmitHandler<IPaymentMethod> = async (form) => {
    try {
      await editPaymentMethod.mutateAsync({
        id: unitsId,
        data: form,
      });

      Toast.success("Successfully Updated PaymentMethod");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update PaymentMethod" + error);
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
      <div className=" w-[26rem]   bg-white py-4 rounded-lg drop-shadow-lg">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center ml-2 mb-4">
              <h1 className="text-lg font-semibold">
                {t("Update Payment Method")}
              </h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 text-2xl mr-2  hover:text-red-500 "
              >
                <img src={close} alt="close" className="w-8 h-7" />
              </button>
            </div>
            <div className="flex justify-evenly mt-6 px-6">
              <div className="w-full">
                <div className="my-6">
                  <InputElement
                    required
                    label="Payment Method Name"
                    layout="column"
                    form={form}
                    name="name"
                    placeholder="Enter PaymentMethod name"
                  />
                </div>
                <div className=" ">
                  <button
                    type="button"
                    onClick={handleOpenAddLedgerForm}
                    className="text-red-500 hover:text-red-700 sm:p-0 flex"
                  >
                    <img
                      src={Addition}
                      alt="Add Item"
                      className="ml-1 w-4 h-4 sm:w-4 sm:h-4"
                    />
                  </button>
                  {ledger && (
                    <AppCombobox
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Ledger"
                      required
                      options={ledger}
                      value={selectedLedgerId}
                      selected={
                        ledger.find((g) => g.id === selectedLedgerId) || null
                      }
                      onSelect={(group) => {
                        if (group) {
                          setSelectedLedgerId(group.id || "");
                          handleSelectLedger(group.id || "");
                        } else {
                          setSelectedLedgerId("");
                        }
                      }}
                      getLabel={(g) => g?.name ?? ""}
                      getValue={(g) => g?.id ?? ""}
                      renderOptionExtra={(g) => (
                        <MasterName masterId={g?.masterId ?? ""} />
                      )}
                    />
                  )}
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
        {showAddLedgerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
            <AddL
              onLedgerAdded={() => console.log("added")}
              inset
              visible
              onClose={handleCloseAddLedgerForm}
              // ledgerIsAdded={itemIsAdded}
              // onLedgerAdded={handleNewItemAdded}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPaymentMethodForm;
