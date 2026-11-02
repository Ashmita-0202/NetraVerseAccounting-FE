import TitleHeader from "@/components/common/TitleHeader";
import {
  IJournalReport,
  IPurchaseReport,
  ISalesReport,
} from "../types/IReport";
import { useForm } from "react-hook-form";
import PurchaseReportRegisterForm from "../component/purchaseReportRegister";
import SalesReportRegisterForm from "../component/SalesReportRegister";
import JournalReportRegisterForm from "../component/JournalReportRegister";

const AllAccountBook = () => {
  const Jform = useForm<IJournalReport>();
  const Pform = useForm<IPurchaseReport>();
  const Sform = useForm<ISalesReport>();

  return (
    <div>
      <TitleHeader title="All Report" />
      <PurchaseReportRegisterForm form={Pform} />
      <SalesReportRegisterForm form={Sform} />
      <JournalReportRegisterForm form={Jform} />
    </div>
  );
};

export default AllAccountBook;
