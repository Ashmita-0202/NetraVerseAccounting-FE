import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { UseFormReturn } from "react-hook-form";
import {
  IBillNumberGenerationForSales,
  IReferenceGenerationForSales,
  ITaxForSales,
} from "@/modules/end-user/SalesComp/sales/types/ISales";
import { Toast } from "@/helper/getToast";
import {
  useEditBillNumberGenerationForSales,
  useEditReferenceNumberForSales,
  useEditTaxForSales,
  useGetBillNumberGenerationForSales,
  useGetReferenceNumberForSales,
  useGetTaxForSales,
} from "@/modules/end-user/SalesComp/sales/hooks";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";

type Props = {
  form: UseFormReturn<IBillNumberGenerationForSales>;
  RefForm: UseFormReturn<IReferenceGenerationForSales>;
  TaxForm: UseFormReturn<ITaxForSales>;
};

const SalesSettingsForm = ({ form, RefForm, TaxForm }: Props) => {
  const { isSubmitting: formIsSubmitting } = form.formState;
  const { isSubmitting: refFormIsSubmitting } = RefForm.formState;

  const companyId = localStorage.getItem("companyId");

  const editBillNumberStatusForSales = useEditBillNumberGenerationForSales();
  const editTaxForSales = useEditTaxForSales();
  const editReferenceNumberStatusForSales = useEditReferenceNumberForSales();

  const { data: billData, refetch } =
    useGetBillNumberGenerationForSales(companyId);
  const { data: SalesRefShow, refetch: refetchRef } =
    useGetReferenceNumberForSales(companyId);
  const { data: SalesTaxShow, refetch: refetchTax } =
    useGetTaxForSales(companyId);

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const data = [
    { name: "Automatic", value: 1 },
    { name: "Manual", value: 0 },
  ];

  const [initialBillForm, setInitialBillForm] =
    useState<IBillNumberGenerationForSales | null>(null);
  const [initialShowRef, setInitialShowRef] = useState(false);
  const [initialShowTax, setInitialShowTax] = useState(false);

  const [showRef, setShowRef] = useState(false);
  const [showTax, setShowTax] = useState(false);
  useEffect(() => {
    if (billData) {
      setInitialBillForm(billData);
      form.reset(billData);
    }
  }, [billData]);

  const billType = form.watch("BillNumberGenerationType");
  useEffect(() => {
    if (SalesRefShow) {
      setInitialShowRef(SalesRefShow.showReferenceNumberForSales);
      setShowRef(SalesRefShow.showReferenceNumberForSales);
    }
  }, [SalesRefShow]);

  useEffect(() => {
    if (SalesTaxShow) {
      setInitialShowTax(SalesTaxShow.showTaxInSales);
      setShowTax(SalesTaxShow.showTaxInSales);
    }
  }, [SalesTaxShow]);

  const isBillFormChanged = useMemo(() => {
    return (
      initialBillForm &&
      billType !== undefined &&
      billType !== initialBillForm.BillNumberGenerationType
    );
  }, [billType, initialBillForm]);

  const isRefChanged = useMemo(
    () => showRef !== initialShowRef,
    [showRef, initialShowRef]
  );
  const isTaxChanged = useMemo(
    () => showTax !== initialShowTax,
    [showTax, initialShowTax]
  );

  const isAnyChange =
    (initialBillForm &&
      billType !== undefined &&
      billType !== initialBillForm.BillNumberGenerationType) ||
    isRefChanged ||
    isTaxChanged;

  // Handlers
  const handleToggleShowRef = () => {
    setShowRef((prev) => !prev);
  };

  const handleToggleShowTax = () => {
    setShowTax((prev) => !prev);
  };

  const onSubmit: SubmitHandler<IBillNumberGenerationForSales> = async (
    formData
  ) => {
    try {
      await editBillNumberStatusForSales.mutateAsync({
        id: companyId,
        data: formData,
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitRef: SubmitHandler<IReferenceGenerationForSales> = async () => {
    try {
      await editReferenceNumberStatusForSales.mutateAsync({
        id: companyId,
        data: {
          id: "",
          showReferenceNumberForSales: showRef,
        },
      });
      refetchRef();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitTax: SubmitHandler<ITaxForSales> = async () => {
    try {
      await editTaxForSales.mutateAsync({
        id: companyId,
        data: {
          companyId: "",
          showTaxInSales: showTax,
        },
      });
      refetchTax();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto rounded-xl p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (!isAnyChange) {
            Toast.error("No changes made");
            return;
          }

          if (isBillFormChanged) await form.handleSubmit(onSubmit)();
          if (isRefChanged) await RefForm.handleSubmit(onSubmitRef)();
          if (isTaxChanged) await TaxForm.handleSubmit(onSubmitTax)();

          Toast.success("Successfully Updated Inventory Settings");
        }}
      >
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Settings
        </h1>

        <div className="my-4 flex w-[51.5%] justify-between mt-10">
          <label className="text-sm text-gray-600 block mb-1">
            Bill Type For Sales
          </label>
          <SelectElement
            form={form}
            name="BillNumberGenerationType"
            className="w-full border items-center rounded-lg px-3 py-2"
            data={data.map(({ name, value }) => ({ label: name, value }))}
          />
        </div>

        <div className="flex py-2 items-center justify-between w-[51.5%]">
          <label className="text-gray-700">
            Show Reference Number in Sales
          </label>
          <input
            type="checkbox"
            checked={showRef}
            className="w-4 h-4 accent-teal-500"
            onChange={handleToggleShowRef}
          />
        </div>

        <div className="flex py-2 items-center justify-between w-[51.5%]">
          <label className="text-gray-700">Show Tax in Sales</label>
          <input
            type="checkbox"
            checked={showTax}
            className="w-4 h-4 accent-teal-500"
            onChange={handleToggleShowTax}
          />
        </div>

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
                formIsSubmitting || refFormIsSubmitting ? "Saving..." : "Change"
              }
              disabled={!isAnyChange || formIsSubmitting || refFormIsSubmitting}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};

export default SalesSettingsForm;
