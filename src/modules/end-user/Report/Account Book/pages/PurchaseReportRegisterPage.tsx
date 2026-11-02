import TitleHeader from "@/components/common/TitleHeader";
import { IPurchaseReport } from "../types/IReport";
import { useForm } from "react-hook-form";
import PurchaseReportForm from "../component/purchaseReportRegister";

const PurchaseReportRegisterPage = () => {
  const PForm = useForm<IPurchaseReport>();

  return (
    <div>
      <TitleHeader title="Purchase Report" />
      <PurchaseReportForm form={PForm} />
    </div>
  );
};

export default PurchaseReportRegisterPage;
