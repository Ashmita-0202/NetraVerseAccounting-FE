import TitleHeader from "@/components/common/TitleHeader";
import { ISalesReport } from "../types/IReport";
import { useForm } from "react-hook-form";
import SalesReportForm from "../component/SalesReportRegister";

const SalesReportRegisterPage = () => {
  const SForm = useForm<ISalesReport>();

  return (
    <div>
      <TitleHeader title="Sales Report" />
      <SalesReportForm form={SForm} />
    </div>
  );
};

export default SalesReportRegisterPage;
