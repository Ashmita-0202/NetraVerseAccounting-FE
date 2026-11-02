import { useGetSubModulesByModuleId } from "@/modules/admin/rolesmodules/subModules/hooks";
import { useEffect } from "react";
// import play from "../../../../../assets/black.svg";

interface Props {
  moduleId: string;
  selectedSubModules: string[];
  handleCheckboxChange: (subModuleId: string) => void;
  handleSelectAllChange: (allSubMods: string[]) => void;
}

const SubModuleList = ({
  moduleId,
  selectedSubModules,
  handleCheckboxChange,
  handleSelectAllChange,
}: Props) => {
  const { data, refetch } = useGetSubModulesByModuleId(moduleId);

  useEffect(() => {
    refetch();
  }, [refetch]);
  const allSubModIds = data?.map((menu) => menu.id) || [];
  const isAllSelected =
    allSubModIds.length > 0 &&
    allSubModIds.every((id) => selectedSubModules.includes(id));
  return (
    <div className="">
      {data && data.length > 0 ? (
        <>
          <div className="flex items-center space-x-2 ml-4 mb-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => handleSelectAllChange(allSubModIds)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold">Select All</span>
          </div>
          {data.map((subModule) => (
            <div
              key={subModule.id}
              className="flex items-center h-fit drop-shadow-md space-x-2 w-fit py-1 rounded-sm ml-4"
            >
              <input
                type="checkbox"
                checked={
                  Array.isArray(selectedSubModules) &&
                  selectedSubModules.includes(subModule.id)
                }
                onChange={() => handleCheckboxChange(subModule.id)}
                className="text-blue-500"
              />
              <div>{subModule.name}</div>
            </div>
          ))}
        </>
      ) : (
        <div className="pl-6 text-gray-500">SubModules Not Found</div>
      )}
    </div>
  );
};

export default SubModuleList;
