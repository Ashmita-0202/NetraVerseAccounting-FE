import { useForm } from "react-hook-form";
import { useGetCompanyById } from "../hooks";
import { ICompany } from "../types/ICompany";
import EditCompanyForm from "../components/EditCompanyForm";
type Props = {
  visible: boolean;
  onClose: () => void;
  CompanyId: string;
  currentPageIndex: number;
  institutionId: string;
};
enum Status {
  Manual = 0,
  Automatic = 1,
}
const EditCompany = ({
  visible,
  onClose,
  CompanyId,
  currentPageIndex,
  institutionId,
}: Props) => {
  const { data: CompanyData } = useGetCompanyById(CompanyId);
  const form = useForm<ICompany>({
    values: {
      id: CompanyData?.id ?? "",
      name: CompanyData?.name ?? "",
      address: CompanyData?.address ?? "",
      email: CompanyData?.email ?? "",
      shortName: CompanyData?.shortName ?? "",
      contactNumber: CompanyData?.contactNumber ?? "",
      contactPerson: CompanyData?.contactPerson ?? "",
      pan: CompanyData?.pan ?? "",
      imageUrl: CompanyData?.imageUrl ?? "",
      isEnable: CompanyData?.isEnable ?? "",
      isDeleted: CompanyData?.isDeleted ?? "",
      institutionId: CompanyData?.institutionId ?? "",
      billNumberGenerationTypeForPurchase:
        CompanyData?.billNumberGenerationTypeForPurchase ?? Status,
      billNumberGenerationTypeForSales:
        CompanyData?.billNumberGenerationTypeForSales ?? Status,
    },
  });

  if (!visible) return null;
  return (
    <EditCompanyForm
      form={form}
      CompanyId={CompanyId}
      institutionId={institutionId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditCompany;
