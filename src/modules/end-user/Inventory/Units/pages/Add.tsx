import { useForm } from "react-hook-form";
import { IUnits } from "@modules/end-user/Inventory/Units/types/IUnits";

// import { yupResolver } from "@hookform/resolvers/yup";
// import { UnitsValidator } from "../validators/index";
import AddUnitsForm from "@modules/end-user/Inventory/Units/components/AddUnitsForm";
interface Props {
  visible: boolean;
  inset?: boolean;
  onClose?: () => void;
  onUnitAdded: () => void;
}
const Add = ({ visible, onClose, inset, onUnitAdded }: Props) => {
  const form = useForm<IUnits>({
    defaultValues: {
      id: "",
      name: "",
      isEnabled: true,
    },

    // resolver: yupResolver(UnitsValidator),
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
          ? "bg-white bg-opacity-80 ml-[11.9%]"
          : "bg-white bg-opacity-80  ml-[10.7%]"
      }`}
    >
      <div
        className={`
        transition-all duration-300 ease-in-out
        w-[40.4%] h-[40%] overflow-y-auto
        flex flex-col`}
      >
        <AddUnitsForm
          form={form}
          onClose={handleFormClose}
          onUnitAdded={onUnitAdded}
        />
      </div>
    </div>
  );
};
export default Add;
