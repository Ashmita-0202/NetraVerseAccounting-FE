import { useForm } from "react-hook-form";
import { IPaymentMethod } from "../types/IPaymentMethod";

// import { yupResolver } from "@hookform/resolvers/yup";
// import { PaymentMethodValidator } from "../validators/index";
import AddPaymentMethodForm from "../components/AddPaymentMethodForm";
interface Props {
  visible: boolean;
  inset?: boolean;
  onClose?: () => void;
  onUnitAdded: () => void;
}
const AddPaymentMethod = ({ visible, onClose, inset, onUnitAdded }: Props) => {
  const form = useForm<IPaymentMethod>({
    defaultValues: {
      id: "",
      name: "",
      type: 1,
      ledgerGroupId: "",
    },

    // resolver: yupResolver(PaymentMethodValidator),
  });
  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        inset
          ? "bg-white bg-opacity-80 ml-[12.9%]"
          : "bg-white bg-opacity-80 ml-[12.7%]"
      }`}
    >
      <div
        className={`transition-all duration-300 ease-in-out
    w-[60.4%] h-[70%]
    flex flex-col`}
      >
        <AddPaymentMethodForm
          form={form}
          onClose={handleFormClose}
          onUnitAdded={onUnitAdded}
        />
      </div>
    </div>
  );
};
export default AddPaymentMethod;
