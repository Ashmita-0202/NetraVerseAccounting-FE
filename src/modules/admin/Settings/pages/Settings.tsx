import {
  IBillNumberGeneration,
  IReferenceGenerationForPurchase,
  ITaxForPurchase,
} from "@modules/end-user/PurchaseComp/purchase/types/Ipurchase";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InventorySettingsForm from "../components/InventorySettingsForm";
import {
  useGetBillNumberGeneration,
  useGetReferenceNumberForPurchase,
  useGetTaxForPurchase,
} from "@/modules/end-user/PurchaseComp/purchase/hooks";
// import TitleHeader from "@/components/common/TitleHeader";
import AccountSettingsForm from "../components/AccountSettingsForm";
import PaymentSettingsForm from "../components/PaymentSettingsForm";
import SalesSettingsForm from "../components/SalesSettings";
import PurchaseSettingsForm from "../components/PurchaseSettingsForm";
import {
  IInventoryStatus,
  IItemStatus,
  IJournalStatus,
} from "../types/ISettings";
import {
  useGetInventoryStatusByCompany,
  useGetItemStatusByCompany,
  useGetJournalRefByCompany,
} from "../hooks";
import {
  IBillNumberGenerationForSales,
  IReferenceGenerationForSales,
  ITaxForSales,
} from "@/modules/end-user/SalesComp/sales/types/ISales";
import {
  useGetBillNumberGenerationForSales,
  useGetReferenceNumberForSales,
  useGetTaxForSales,
} from "@/modules/end-user/SalesComp/sales/hooks";
import GeneralSettings from "../components/GeneralSettingsForm";
import { useTranslation } from "react-i18next";
const Settings = () => {
  const [activeSection, setActiveSection] = useState<string>("General");
  const companyId = localStorage.getItem("companyId");
  const { data: billStatusForPurchase } = useGetBillNumberGeneration(companyId);
  const { data: taxForPurchase } = useGetTaxForPurchase(companyId);
  const { data: refForPurchase } = useGetReferenceNumberForPurchase(companyId);
  const { data: refForSale } = useGetReferenceNumberForSales(companyId);
  const { data: billStatusForSales } =
    useGetBillNumberGenerationForSales(companyId);
  const { data: itemStatus } = useGetItemStatusByCompany(companyId);
  const { data: journalStatus } = useGetJournalRefByCompany(companyId);
  const { data: inventoryStatus } = useGetInventoryStatusByCompany(companyId);
  const { data: taxForSales } = useGetTaxForSales(companyId);
  const { t } = useTranslation();
  const purchaseForm = useForm<IBillNumberGeneration>({
    values: {
      id: billStatusForPurchase?.id ?? "",
      BillNumberGenerationType:
        billStatusForPurchase?.BillNumberGenerationType ?? 0,
    },
  });
  const purchaseTax = useForm<ITaxForPurchase>({
    values: {
      companyId: taxForPurchase?.companyId ?? "",
      showTaxInPurchase: taxForPurchase?.showTaxInPurchase ?? false,
    },
  });
  const salesTax = useForm<ITaxForSales>({
    values: {
      companyId: taxForSales?.companyId ?? "",
      showTaxInSales: taxForSales?.showTaxInPurchase ?? false,
    },
  });
  const salesReference = useForm<IReferenceGenerationForSales>({
    values: {
      id: refForSale?.id ?? "",
      showReferenceNumberForSales:
        refForSale?.showReferenceNumberForSales ?? true,
    },
  });
  const purchaseReference = useForm<IReferenceGenerationForPurchase>({
    values: {
      id: refForPurchase?.id ?? "",
      showReferenceNumberForPurchase:
        refForPurchase?.showReferenceNumberForPurchase ?? true,
    },
  });

  const salesForm = useForm<IBillNumberGenerationForSales>({
    values: {
      id: billStatusForSales?.id ?? "",
      BillNumberGenerationType:
        billStatusForSales?.BillNumberGenerationType ?? 0,
    },
  });
  const itemStatusForm = useForm<IItemStatus>({
    values: {
      id: itemStatus?.id ?? "",
      isExpiredDate: itemStatus?.isExpiredDate ?? false,
      isSerialNo: itemStatus?.isSerialNo ?? false,
    },
  });
  const inventoryStatusFrom = useForm<IInventoryStatus>({
    values: {
      companyId: inventoryStatus?.companyId ?? "",
      inventoryMethod: inventoryStatus?.inventoryMethod ?? 0,
    },
  });
  const accountForm = useForm<IJournalStatus>({
    values: {
      companyId: journalStatus?.companyId ?? "",
      journalReferences: journalStatus?.journalReferences ?? 0,
    },
  });

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };
  return (
    <div className="flex transition-all w-full duration-300 h-full">
      <div className="flex flex-col w-[20%] bg-white">
        <div className="font-bold text-xl mx-12 my-8">{t("settings")}</div>

        <div>
          {[
            { name: `${t("General")}` },
            { name: `${t("Inventory")}` },
            { name: `${t("Account")}` },
            { name: `${t("Payment")}` },
            { name: `${t("Sales")}` },
            { name: `${t("Purchase")}` },
          ].map((section) => (
            <button
              key={section.name}
              className={`flex justify-center md:justify-start items-center text-base p-4 w-full transition-all duration-200 hover:bg-slate-50 ${
                activeSection === section.name ? "bg-slate-100  " : ""
              }`}
              onClick={() => handleSectionClick(section.name)}
            >
              <span className="pl-2 hidden md:inline">{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 w-[80%]">
        {activeSection === "General" && <GeneralSettings />}
        {activeSection === "Inventory" && (
          <InventorySettingsForm
            formForStatus={itemStatusForm}
            formForLifoFifo={inventoryStatusFrom}
          />
        )}
        {activeSection === "Account" && (
          <AccountSettingsForm form={accountForm} />
        )}
        {activeSection === "Payment" && <PaymentSettingsForm />}
        {activeSection === "Sales" && (
          <SalesSettingsForm
            form={salesForm}
            RefForm={salesReference}
            TaxForm={salesTax}
          />
        )}
        {activeSection === "Purchase" && (
          <PurchaseSettingsForm
            TaxForm={purchaseTax}
            form={purchaseForm}
            RefForm={purchaseReference}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
