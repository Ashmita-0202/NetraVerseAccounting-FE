import {
  useGetAllModules,
  useGetModuleByRoleId,
} from "../../rolesmodules/modules/hooks";
import { IModules } from "../../rolesmodules/modules/types/IModules";
import { useEffect, useState } from "react";
import { useAssignModule } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignModule } from "../assignrole/types/IAssign";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { MouseEvent } from "react";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}
const AssignModuleForm = ({
  roleId,
  refetchRoles,
  visible,
  onClose,
}: Props) => {
  const { handleSubmit } = useForm<IAssignModule>();
  const [state, setState] = useState({
    loading: true,
    modules: [] as IModules[],
    errorMessage: "",
  });
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const { data: assignedData } = useGetModuleByRoleId(roleId);

  useEffect(() => {
    if (assignedData) {
      const assignedModuleIds = assignedData.map(
        (module: IModules) => module.Id
      );
      setSelectedModules(assignedModuleIds);
    }
  }, [assignedData]);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  const { data, error, refetch } = useGetAllModules();
  const assignModule = useAssignModule();

  const handleCheckboxChange = (moduleId: string) => {
    setSelectedModules((prevSelected) =>
      prevSelected.includes(moduleId)
        ? prevSelected.filter((id) => id !== moduleId)
        : [...prevSelected, moduleId]
    );
  };
  const onSubmit: SubmitHandler<IAssignModule> = async () => {
    if (selectedModules.length === 0) {
      console.log("No modules selected");
      return;
    }

    try {
      await assignModule.mutateAsync({
        roleId,
        modulesId: selectedModules,
        isActive: true,
        isAssign: true,
      });
      console.log("Assigned modules");
      refetch();
      refetchRoles();
    } catch (error) {
      console.log("Failed to assign modules", error);
    } finally {
      onClose();
    }
  };
  useEffect(() => {
    if (data?.Items) {
      updateState({
        loading: false,
        modules: data.Items,
        errorMessage: "",
      });
    } else if (error) {
      updateState({
        loading: false,
        modules: [],
        errorMessage: "Failed to fetch modules",
      });
    }
  }, [data, error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === roleId) onClose();
  };
  if (!visible) return null;

  return (
    <div
      onClick={handleOnClose}
      id={roleId}
      className="w-[20rem] fixed bg-white p-4 rounded-lg shadow-lg h-[20rem] overflow-auto z-[5]"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold mb-2">Assign Module</h1>
        <div className="flex flex-col h-fit drop-shadow-md p-2 space-y-1 w-fit py-1 rounded-sm relative">
          <div className="absolute left-2 top-3 bottom-3 w-0.5 border-l-2 border-dotted border-black" />

          {state.modules.length > 0 ? (
            state.modules.map((module: IModules) => (
              <div
                key={module.Id}
                className="flex items-center space-x-2 relative"
              >
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(module.Id)}
                  checked={selectedModules.includes(module.Id)}
                  className="absolute left-[-6px] z-10 bg-white"
                />
                <div className="pl-2">{module.Name}</div>
              </div>
            ))
          ) : (
            <div>Modules Not Found</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <ThemeProvider theme={customTheme}>
            <ButtonElement
              style={{
                backgroundColor: customTheme.palette.themePrimary,
                padding: "4px 0",
                borderRadius: "8px",
              }}
              type="submit"
              className="hover:bg-teal-700 transition-all"
              text={"Submit"}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
};
export default AssignModuleForm;
