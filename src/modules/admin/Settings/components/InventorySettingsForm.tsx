import { ButtonElement } from "@/components/FormComponents/Button";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Toast } from "@/helper/getToast";
import {
  useGetItemStatusByCompany,
  useUpdateInventoryMethod,
  useUpdateItemStatusByCompany,
} from "../hooks";
import { useState, useEffect, useMemo } from "react";
import { IInventoryStatus, IItemStatus } from "../types/ISettings";
import { SelectElement } from "@/components/FormComponents/SelectElement";
type Props = {
  formForStatus: UseFormReturn<IItemStatus>;
  formForLifoFifo: UseFormReturn<IInventoryStatus>;
};

const InventorySettingsForm = ({ formForStatus, formForLifoFifo }: Props) => {
  const { isSubmitting: isSubmittingOfStatus } = formForStatus.formState;
  const { isSubmitting: isSubmittingOfLifoFifo } = formForLifoFifo.formState;
  const companyId = localStorage.getItem("companyId") || "";
  const { data: expiredDateItemStatus, refetch } =
    useGetItemStatusByCompany(companyId);
  const updateInventoryMethod = useUpdateInventoryMethod();
  const editExpiredDateItemStatusByCompany = useUpdateItemStatusByCompany();
  const data = [
    { name: "FIFO", value: 1 },
    { name: "LIFO", value: 2 },
    { name: "Average Weighage", value: 3 },
  ];
  const [isExpired, setIsExpired] = useState(false);
  const [isSerialNo, setIsSerialNo] = useState(false);

  useEffect(() => {
    if (expiredDateItemStatus) {
      setIsExpired(expiredDateItemStatus.isExpiredDate);
    }
    if (expiredDateItemStatus) {
      setIsSerialNo(expiredDateItemStatus.isSerialNo);
    }
  }, [expiredDateItemStatus]);
  const onSubmitStatus: SubmitHandler<IItemStatus> = async () => {
    try {
      await editExpiredDateItemStatusByCompany.mutateAsync({
        id: companyId,
        data: {
          isExpiredDate: isExpired,
          isSerialNo: isSerialNo,
        },
      });
      Toast.success("Successfully Updated Inventory Settings");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitFifoLifo: SubmitHandler<IInventoryStatus> = async () => {
    try {
      await updateInventoryMethod.mutateAsync({
        id: companyId,
        data: formForLifoFifo.getValues(),
      });
      Toast.success("Successfully Updated Inventory Settings");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };
  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          themePrimary: "#14b8a6",
        },
      }),
    []
  );
  const handleExpiredStatusToggle = () => {
    setIsExpired((prev) => !prev);
  };
  const handleSerialNoStatusToggle = () => {
    setIsSerialNo((prev) => !prev);
  };
  return (
    <div className=" w-full mx-auto  rounded-xl p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await formForStatus.handleSubmit(onSubmitStatus)();
          await formForLifoFifo.handleSubmit(onSubmitFifoLifo)();

          // If both submissions are successful, show the toast and refetch
          Toast.success("Successfully Updated Inventory Settings");
          refetch();
        }}
      >
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Inventory Settings
        </h1>

        <div className="flex  w-[51.5%] pb-6 border-b-2 border-gray-200 border-solid">
          <div className="w-full">
            <div className="flex py-2 items-center justify-between w-full">
              <div className="justify-start  flex">
                <label className="text-gray-700 ">
                  Show Expired Date of Items
                </label>
              </div>
              <div className="">
                <input
                  type="checkbox"
                  checked={isExpired}
                  className="w-4 h-4 accent-teal-500 justify-end"
                  onChange={handleExpiredStatusToggle}
                />
              </div>
            </div>

            <div className="flex py-2 items-center justify-between w-full">
              <label className="text-gray-700 ">Show Serial No of Items</label>
              <input
                type="checkbox"
                checked={isSerialNo}
                className="w-4 h-4 accent-teal-500"
                onChange={handleSerialNoStatusToggle}
              />
            </div>
          </div>
        </div>
        <div className="my-4 flex w-[51.5%] justify-between mt-10">
          <label className="text-sm text-gray-600 block mb-1 ">
            Inventory Method
          </label>
          <SelectElement
            form={formForLifoFifo}
            name="inventoryMethod"
            className=" border rounded-lg px-3 py-2 items-center w-[20rem]"
            data={data.map(({ name, value }) => ({ label: name, value }))}
          />
        </div>
        {/* Buttons */}
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
              text={
                isSubmittingOfLifoFifo || isSubmittingOfStatus
                  ? "Saving..."
                  : "Change"
              }
              disabled={isSubmittingOfLifoFifo || isSubmittingOfStatus}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};

export default InventorySettingsForm;
