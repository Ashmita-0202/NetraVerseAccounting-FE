import TitleHeader from "@/components/common/TitleHeader";
import { IJournalReport } from "../types/IReport";
import { useForm } from "react-hook-form";
import JournalReportForm from "../component/JournalReportRegister";

const JournalReportRegisterPage = () => {
  const JForm = useForm<IJournalReport>();

  return (
    <div>
      <TitleHeader title="Journal Report" />
      <JournalReportForm form={JForm} />
    </div>
  );
};

export default JournalReportRegisterPage;
