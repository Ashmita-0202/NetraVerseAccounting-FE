import { useForm } from "react-hook-form";
import AllInventoryForm from "../components/AllInventoryForm";
import { IFilterInventoryLedgerByDate } from "../types/IInventory";

const All = () => {
  const InventoryForm = useForm<IFilterInventoryLedgerByDate>();
  return <AllInventoryForm form={InventoryForm} />;
};
export default All;
