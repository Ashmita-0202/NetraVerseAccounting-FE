import { useForm } from "react-hook-form";
import AllLedgerBalanceForm from "../components/AllLedgerBalanceForm";
import { IFilterLedgerBalance } from "../types/ILedgerBalance";

const AllLedgerBalance = () => {
  const LedgerBalanceForm = useForm<IFilterLedgerBalance>();
  return (
    <div>
      <AllLedgerBalanceForm form={LedgerBalanceForm} />
    </div>
  );
};
export default AllLedgerBalance;
