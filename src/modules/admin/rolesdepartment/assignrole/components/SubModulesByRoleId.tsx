import { useEffect, useState } from "react";
import { useGetSubModuleByRoleId } from "../../../rolesmodules/subModules/hooks";
import { useGetSubModulesByModuleId } from "@/modules/admin/rolesmodules/subModules/hooks";
import play from "../../../../../assets/black.svg";
import MenuByRoleId from "./MenuByRoleId";
import { useUpdateAssignSubModules } from "../hooks";

interface Props {
  roleId: string;
  moduleId: string;
}

const SubModulesByRoleId = ({ roleId, moduleId }: Props) => {
  const editSubModule = useUpdateAssignSubModules();
  const { data, isLoading, refetch } = useGetSubModuleByRoleId(roleId);
  const { data: subModule } = useGetSubModulesByModuleId(moduleId);
  const [subModuleStatuses, setSubModuleStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      const normalizedData = Array.isArray(data) ? data : [data];
      const statusMap = normalizedData.reduce((acc, subMod) => {
        acc[subMod.id] = subMod.isActive;
        return acc;
      }, {} as { [key: string]: boolean });

      setSubModuleStatuses(statusMap);
    }
  }, [data]);

  const handleToggle = async (subModuleId: string) => {
    const currentStatus = subModuleStatuses[subModuleId] ?? true;
    const newStatus = !currentStatus;
    setSubModuleStatuses((prevStatuses) => ({
      ...prevStatuses,
      [subModuleId]: newStatus,
    }));

    try {
      await editSubModule.mutateAsync({
        subModuleId,
        roleId,
        isActive: newStatus,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update submodule:", error);
      setSubModuleStatuses((prevStatuses) => ({
        ...prevStatuses,
        [subModuleId]: currentStatus,
      }));
    }
  };

  return (
    <div className="ml-4">
      {data && subModule && data.length && subModule.length > 0 ? (
        subModule
          .filter((mod) => data.some((roleMod) => roleMod.id === mod.id))
          .map((subMod) => (
            <div key={subMod.id} className="">
              <div className="flex items-center drop-shadow-md p-2 py-1 rounded-sm">
                <input
                  type="checkbox"
                  checked={subModuleStatuses[subMod.id] ?? true}
                  onChange={() => handleToggle(subMod.id)}
                  className="text-blue-500"
                />
                <input type="checkbox" className="relative -left-10 w-3" />
                <img
                  src={play}
                  className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-5 h-3 z-10"
                  alt="play"
                />
                <h3
                  className="flex items-center space-x-2 py-2  text-sm hover:text-blue-300 relative before:content-[''] 
                          before:absolute before:-left-10 before:w-4 before:border-t-2 before:border-dotted before:border-black"
                >
                  {subMod.name}
                </h3>
              </div>
              <div className="ml-3  border-l-2 border-dotted border-black">
                {subModuleStatuses[subMod.id] && (
                  <MenuByRoleId subModuleId={subMod.id} roleId={roleId} />
                )}
              </div>
            </div>
          ))
      ) : !isLoading ? (
        <p className="text-gray-600 text-base font-normal ml-2">
          No sub modules found
        </p>
      ) : null}
    </div>
  );
};

export default SubModulesByRoleId;
