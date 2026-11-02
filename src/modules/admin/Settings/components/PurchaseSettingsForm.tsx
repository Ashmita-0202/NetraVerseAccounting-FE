import { ThemeProvider, createTheme } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { SelectElement } from "@/components/FormComponents/SelectElement";
import { UseFormReturn } from "react-hook-form";
import {
  IBillNumberGeneration,
  IReferenceGenerationForPurchase,
  ITaxForPurchase,
} from "@modules/end-user/PurchaseComp/purchase/types/Ipurchase";
import { Toast } from "@/helper/getToast";
import {
  useEditBillNumberGenerationForPurchase,
  useEditReferenceNumberForPurchase,
  useEditTaxForPurchase,
  useGetBillNumberGeneration,
  useGetReferenceNumberForPurchase,
  useGetTaxForPurchase,
} from "@/modules/end-user/PurchaseComp/purchase/hooks";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";

type Props = {
  form: UseFormReturn<IBillNumberGeneration>;
  RefForm: UseFormReturn<IReferenceGenerationForPurchase>;
  TaxForm: UseFormReturn<ITaxForPurchase>;
};

const PurchaseSettingsForm = ({ form, RefForm, TaxForm }: Props) => {
  const { isSubmitting: formIsSubmitting } = form.formState;
  const { isSubmitting: refFormIsSubmitting } = RefForm.formState;

  const companyId = localStorage.getItem("companyId");

  const editBillNumberStatusForPurchase =
    useEditBillNumberGenerationForPurchase();
  const editTaxForPurchase = useEditTaxForPurchase();
  const editReferenceNumberStatusForPurchase =
    useEditReferenceNumberForPurchase();

  const { data: billData, refetch } = useGetBillNumberGeneration(companyId);
  const { data: purchaseRefShow, refetch: refetchRef } =
    useGetReferenceNumberForPurchase(companyId);
  const { data: purchaseTaxShow, refetch: refetchTax } =
    useGetTaxForPurchase(companyId);

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
    useState<IBillNumberGeneration | null>(null);
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
    if (purchaseRefShow) {
      setInitialShowRef(purchaseRefShow.showReferenceNumberForPurchase);
      setShowRef(purchaseRefShow.showReferenceNumberForPurchase);
    }
  }, [purchaseRefShow]);

  useEffect(() => {
    if (purchaseTaxShow) {
      setInitialShowTax(purchaseTaxShow.showTaxInPurchase);
      setShowTax(purchaseTaxShow.showTaxInPurchase);
    }
  }, [purchaseTaxShow]);

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

  const onSubmit: SubmitHandler<IBillNumberGeneration> = async (formData) => {
    try {
      await editBillNumberStatusForPurchase.mutateAsync({
        id: companyId,
        data: formData,
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitRef: SubmitHandler<
    IReferenceGenerationForPurchase
  > = async () => {
    try {
      await editReferenceNumberStatusForPurchase.mutateAsync({
        id: companyId,
        data: {
          id: "",
          showReferenceNumberForPurchase: showRef,
        },
      });
      refetchRef();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitTax: SubmitHandler<ITaxForPurchase> = async () => {
    try {
      await editTaxForPurchase.mutateAsync({
        id: companyId,
        data: {
          companyId: "",
          showTaxInPurchase: showTax,
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
          Purchase Settings
        </h1>

        <div className="my-4 flex w-[51.5%] justify-between mt-10">
          <label className="text-sm text-gray-600 block mb-1">
            Bill Type For Purchase
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
            Show Reference Number in Purchase
          </label>
          <input
            type="checkbox"
            checked={showRef}
            className="w-4 h-4 accent-teal-500"
            onChange={handleToggleShowRef}
          />
        </div>

        <div className="flex py-2 items-center justify-between w-[51.5%]">
          <label className="text-gray-700">Show Tax in Purchase</label>
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

export default PurchaseSettingsForm;
