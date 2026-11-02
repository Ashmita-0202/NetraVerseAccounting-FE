import { useGetSubModuleByRoleId } from "../../rolesmodules/subModules/hooks";
import { ISubModules } from "../../rolesmodules/subModules/types/ISubModules";
import { useEffect, useState } from "react";
import { useAssignSubModule } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignSubModule } from "../assignrole/types/IAssign";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { MouseEvent } from "react";
import { useGetModuleByRoleId } from "../../rolesmodules/modules/hooks";
import SubModuleList from "../assignrole/components/SubModuleList";
interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}
const AssignSubModuleForm = ({
  roleId,
  refetchRoles,
  visible,
  onClose,
}: Props) => {
  const { handleSubmit } = useForm<IAssignSubModule>();
  // const { data: assignedModule } = useGetModuleByRoleId(roleId);
  const [selectedSubModules, setSelectedSubModules] = useState<string[]>([]);
  const { data: assignedSubModule, refetch } = useGetSubModuleByRoleId(roleId);

  useEffect(() => {
    if (assignedSubModule) {
      const assignedSubModuleIds = assignedSubModule.map(
        (subModule: ISubModules) => subModule.id
      );
      setSelectedSubModules(assignedSubModuleIds);
    }
  }, [assignedSubModule]);

  const assignSubModule = useAssignSubModule();
  const { data: ModuleData, isLoading } = useGetModuleByRoleId(roleId);
  const handleCheckboxChange = (subModuleId: string) => {
    setSelectedSubModules((prevSelected) =>
      prevSelected.includes(subModuleId)
        ? prevSelected.filter((id) => id !== subModuleId)
        : [...prevSelected, subModuleId]
    );
  };
  const onSubmit: SubmitHandler<IAssignSubModule> = async () => {
    if (selectedSubModules.length === 0) {
      console.log("No subModules selected");
      return;
    }
    try {
      await assignSubModule.mutateAsync({
        roleId,
        subModulesId: selectedSubModules,
        isActive: true,
        isAssign: true,
      });
      console.log("Assigned subModules");
      refetch();
      refetchRoles();
    } catch (error) {
      console.log("Failed to assign subModules", error);
    } finally {
      onClose();
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });
  const handleSelectAllChange = (allSubModIds: string[]) => {
    setSelectedSubModules((prevSelected) => {
      const areAllSelected = allSubModIds.every((id) =>
        prevSelected.includes(id)
      );
      return areAllSelected
        ? prevSelected.filter((id) => !allSubModIds.includes(id)) // Unselect all
        : [...prevSelected, ...allSubModIds]; // Select all
    });
  };
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
      <h1 className="text-xl font-semibold mb">Assign SubModule</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col h-fit drop-shadow-md p-2 space-y-1 w-fit py-1 rounded-sm relative">
          <div className="absolute left-1 top-4 bottom-4 w-0.5 border-l-2 border-dotted border-black" />
          {ModuleData && ModuleData.length > 0 ? (
            ModuleData.map((mod) => (
              <div key={mod.Id} className="">
                <div className="flex items-center h-fit drop-shadow-md  space w-fit py-1  rounded-sm">
                  <div className="text-base font-semibold ml-2">{mod.Name}</div>
                </div>
                <div>
                  <SubModuleList
                    moduleId={mod.Id}
                    selectedSubModules={selectedSubModules}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSelectAllChange={handleSelectAllChange}
                  />
                </div>
              </div>
            ))
          ) : !isLoading ? (
            <p className="text-gray-600 text-base font-semibold ml-2">
              No modules found
            </p>
          ) : null}
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
export default AssignSubModuleForm;
