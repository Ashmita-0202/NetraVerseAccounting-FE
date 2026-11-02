import { useGetModulesById } from "../hooks";
import { useForm } from "react-hook-form";
import EditModuleForm from "../components/EditModuleForm";
import { IModules } from "../types/IModules";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ModuleValidator } from "../validators";

interface Props {
  visible: boolean;
  modulesId: string;
  onClose: () => void;
  currentPageIndex: number;
}

const EditModule = ({
  visible,
  modulesId,
  onClose,
  currentPageIndex,
}: Props) => {
  const { data: module } = useGetModulesById(modulesId);

  const form = useForm<IModules>({
    values: {
      Id: module?.Id ?? "",
      Name: module?.Name ?? "",
      TargetUrl: module?.TargetUrl ?? "",
      IsActive: module?.isActive ?? false,
      IconUrl: module?.IconUrl ?? "",
      Rank: module?.Rank ?? "",
      createdAt: module?.createdAt,
    },

    // resolver: yupResolver(ModuleValidator),
  });

  if (!visible) return null;
  return (
    <EditModuleForm
      form={form}
      currentPageIndex={currentPageIndex}
      moduleId={modulesId}
      onClose={() => onClose()}
    />
  );
};

export default EditModule;
