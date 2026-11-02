import { useForm } from "react-hook-form";
import { useGetConversionFactorById } from "../hooks";
import { IConversionFactor } from "../types/IConversionFactor";
import EditConversionFactorForm from "../components/EditConversionFactor";
type Props = {
  visible: boolean;
  onClose: () => void;
  ConversionFactorId: string;
  currentPageIndex: number;
  //   masterId: number;
};
const EditConversionFactor = ({
  visible,
  onClose,
  ConversionFactorId,
  currentPageIndex,
}: Props) => {
  const { data: ConversionFactorData } =
    useGetConversionFactorById(ConversionFactorId);
  const form = useForm<IConversionFactor>({
    values: {
      name: ConversionFactorData?.name ?? "",
      id: ConversionFactorData?.id ?? "",
      fromUnit: ConversionFactorData?.fromUnit ?? "",
      toUnit: ConversionFactorData?.toUnit ?? "",
      conversionFactor: ConversionFactorData?.conversionFactor ?? 0,
    },
  });

  if (!visible) return null;
  return (
    <EditConversionFactorForm
      form={form}
      ConversionFactorId={ConversionFactorId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditConversionFactor;
