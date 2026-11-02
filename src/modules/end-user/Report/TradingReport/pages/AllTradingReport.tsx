import { useForm } from "react-hook-form";
import AllTradingReportForm from "../components/AllTradingReport";
import { IFilterTradingReport } from "../types/ITradingReport";

const AllTradingReport = () => {
  const TradingReportForm = useForm<IFilterTradingReport>();
  return (
    <div>
      <AllTradingReportForm form={TradingReportForm} />
    </div>
  );
};
export default AllTradingReport;
