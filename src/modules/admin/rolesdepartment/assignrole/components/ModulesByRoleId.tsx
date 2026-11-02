import { useEffect, useState } from "react";
import { useGetModuleByRoleId } from "../../../rolesmodules/modules/hooks";
import { useUpdateAssignModules } from "../hooks";
import { MouseEvent } from "react";
import SubModulesByRoleId from "./SubModulesByRoleId";

interface Props {
  roleId: string;
  visible: boolean;
  onClose: () => void;
}

const ModuleByRoleId = ({ roleId, visible, onClose }: Props) => {
  const editModule = useUpdateAssignModules();
  const { data, isLoading, refetch } = useGetModuleByRoleId(roleId);
  const [moduleStatuses, setModuleStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setModuleStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses }; // Preserve previous states
        data.forEach((mod) => {
          if (!(mod.Id in newStatuses)) {
            newStatuses[mod.Id] = mod.IsActive; // Set only new submodules
          }
        });
        return newStatuses;
      });
    }
  }, [data]);

  const handleToggle = async (moduleId: string) => {
    setModuleStatuses((prevStatuses) => ({
      ...prevStatuses,
      [moduleId]: !prevStatuses[moduleId],
    }));
    try {
      await editModule.mutateAsync({
        moduleId,
        roleId,
        isActive: !moduleStatuses[moduleId],
      });
      refetch();
    } catch (error) {
      console.error("Failed to update module:", error);
      setModuleStatuses((prevStatuses) => ({
        ...prevStatuses,
        [moduleId]: !prevStatuses[moduleId],
      }));
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === roleId) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg h-[20rem] overflow-auto w-[16rem] max-w-md mx-auto"
      id={roleId}
      onClick={handleOnClose}
    >
      {data && data.length > 0 ? (
        data.map((mod) => (
          <div key={mod.Id} className="relative">
            <div className="flex items-center drop-shadow-md p-2 py-1 rounded-sm">
              <input
                type="checkbox"
                checked={moduleStatuses[mod.Id]} // Ensure default behavior
                onChange={() => handleToggle(mod.Id)}
                className="text-blue-500"
              />
              <h3 className="text-base font-medium ml-2">{mod.Name}</h3>
            </div>
            {/* Show submodules only when the module is checked */}
            {moduleStatuses[mod.Id] && (
              <div className="ml-3 border-l-2 border-dotted border-black">
                <SubModulesByRoleId roleId={roleId} moduleId={mod.Id} />
              </div>
            )}
          </div>
        ))
      ) : !isLoading ? (
        <p className="text-gray-600 ml-2">No modules found</p>
      ) : null}
    </div>
  );
};

export default ModuleByRoleId;
