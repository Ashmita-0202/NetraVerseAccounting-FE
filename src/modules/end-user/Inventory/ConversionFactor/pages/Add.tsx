import { useForm } from "react-hook-form";
import type { IConversionFactor } from "../types/IConversionFactor";
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
// import { ConversionFactorValidator } from "../validators/index";
import AddConversionFactorForm from "../components/AddConversionFactor";
interface Props {
  visible: boolean;
  onClose: () => void;
}
const Add = ({ visible, onClose }: Props) => {
  const form = useForm<IConversionFactor>({
    defaultValues: {
      id: "",
      name: "",
      conversionFactor: null,
      fromUnit: "",
      toUnit: "",
    },

    // resolver: yupResolver(ConversionFactorValidator),
  });
  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        name: "",
        conversionFactor: null,
        fromUnit: "",
        toUnit: "",
      });
    }
  }, [form, visible]);
  if (!visible) return null;

  return <AddConversionFactorForm form={form} onClose={() => onClose()} />;
};
export default Add;
