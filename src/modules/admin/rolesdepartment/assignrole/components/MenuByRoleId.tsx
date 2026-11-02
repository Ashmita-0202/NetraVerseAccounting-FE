import { useEffect, useState } from "react";
import { useUpdateAssignMenu } from "../hooks";
import { useGetMenuByRoleId } from "../../../rolesmodules/menu/hooks";
import { useGetAllMenuBySubModulesId } from "../../../rolesmodules/menu/hooks";
import play from "../../../../../assets/black.svg";
interface Props {
  subModuleId: string;
  roleId: string;
}

const MenuByRoleId = ({ roleId, subModuleId }: Props) => {
  const { data, isLoading, refetch } = useGetMenuByRoleId(roleId);
  const { data: menu } = useGetAllMenuBySubModulesId(subModuleId);
  const editMenu = useUpdateAssignMenu();
  const [menuStatuses, setMenuStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setMenuStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses }; // Preserve previous states
        data.forEach((mod) => {
          if (!(mod.id in newStatuses)) {
            newStatuses[mod.id] = mod.isActive; // Set only new submodules
          }
        });
        return newStatuses;
      });
    }
  }, [data]);

  const handleToggle = async (menuId: string) => {
    setMenuStatuses((prevStatuses) => ({
      ...prevStatuses,
      [menuId]: !prevStatuses[menuId], // Toggle only the clicked submodule
    }));
    try {
      await editMenu.mutateAsync({
        menuId: menuId,
        data: {
          roleId: roleId,
          isActive: !menuStatuses[menuId],
        },
      });
      refetch();
    } catch (error) {
      console.log("error occur", error);

      setMenuStatuses((prevStatuses) => ({
        ...prevStatuses,
        [menuId]: !prevStatuses[menuId], // Revert state on failure
      }));
    }
  };

  return (
    <div className="ml-4">
      {data && data.length && menu && menu.length > 0 ? (
        menu
          .filter((subMod) => data.some((roleMod) => roleMod.id === subMod.id))
          .map((menu) => (
            <div key={menu.id} className="">
              <div className="flex items-center drop-shadow-md p-2 py-1 rounded-sm">
                <input
                  type="checkbox"
                  checked={menuStatuses[menu.id] ?? true}
                  onChange={() => handleToggle(menu.id)}
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
                  {menu.name}
                </h3>
              </div>
            </div>
          ))
      ) : !isLoading ? (
        <p className="text-gray-600 text-sm font-light ml-2">No Menu found</p>
      ) : null}
    </div>
  );
};

export default MenuByRoleId;
