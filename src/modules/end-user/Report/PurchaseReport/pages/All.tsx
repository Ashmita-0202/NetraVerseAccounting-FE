import TitleHeader from "@/components/common/TitleHeader";
import { IPurchaseFilter } from "../types/IPurchaseReport";
import { useForm } from "react-hook-form";
import PurchaseReportForm from "../component/PurchaseReport";

const AllPurchaseReport = () => {
  const SForm = useForm<IPurchaseFilter>();

  return (
    <div>
      <TitleHeader title="Purchase Report" />
      <PurchaseReportForm form={SForm} />
    </div>
  );
};

export default AllPurchaseReport;
