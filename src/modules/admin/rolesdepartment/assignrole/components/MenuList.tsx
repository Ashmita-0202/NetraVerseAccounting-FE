import { useGetAllMenuBySubModulesId } from "@/modules/admin/rolesmodules/menu/hooks";
import { useEffect } from "react";
// import play from "../../../../../assets/black.svg";

interface Props {
  subModuleId: string;
  selectedMenu: string[];
  handleCheckboxChange: (menuId: string) => void;
  handleSelectAllChange: (allMenuIds: string[]) => void;
}

const MenuList = ({
  subModuleId,
  selectedMenu,
  handleCheckboxChange,
  handleSelectAllChange,
}: Props) => {
  const { data: menus, refetch } = useGetAllMenuBySubModulesId(subModuleId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const allMenuIds = menus?.map((menu) => menu.id) || [];
  const isAllSelected =
    allMenuIds.length > 0 &&
    allMenuIds.every((id) => selectedMenu.includes(id));

  return (
    <div>
      {menus && menus.length > 0 ? (
        <>
          <div className="flex items-center space-x-2 ml-4 mb-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => handleSelectAllChange(allMenuIds)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold">Select All</span>
          </div>

          {/* Individual Menus */}
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="flex items-center h-fit drop-shadow-md space-x-2 w-fit py-1 rounded-sm ml-4"
            >
              <input
                type="checkbox"
                checked={selectedMenu.includes(menu.id)}
                onChange={() => handleCheckboxChange(menu.id)}
                className="text-blue-500"
              />
              <div>{menu.name}</div>
            </div>
          ))}
        </>
      ) : (
        <div className="ml-4 text-gray-500">Menus Not Found</div>
      )}
    </div>
  );
};

export default MenuList;
