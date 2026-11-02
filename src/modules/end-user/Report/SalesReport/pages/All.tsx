import TitleHeader from "@/components/common/TitleHeader";
import { ISalesFilter } from "../types/ISalesReport";
import { useForm } from "react-hook-form";
import SalesReportForm from "../component/SalesReportForm";

const AllSalesReport = () => {
  const SForm = useForm<ISalesFilter>();

  return (
    <div>
      <TitleHeader title="Sales Report" />
      <SalesReportForm form={SForm} />
    </div>
  );
};

export default AllSalesReport;
