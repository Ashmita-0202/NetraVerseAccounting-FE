import { useGetMenuByRoleId } from "../../rolesmodules/menu/hooks";
import { IMenu } from "../../rolesmodules/menu/types/IMenu";
import { useEffect, useState } from "react";
import { useAssignMenu } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignMenu } from "../assignrole/types/IAssign";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { MouseEvent } from "react";
import { useGetSubModuleByRoleId } from "../../rolesmodules/subModules/hooks";
import MenuList from "../assignrole/components/MenuList";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}
const AssignMenuForm = ({ roleId, refetchRoles, visible, onClose }: Props) => {
  const { handleSubmit } = useForm<IAssignMenu>();
  const { data: subModuleData, isLoading } = useGetSubModuleByRoleId(roleId);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const { data: assignedData, refetch } = useGetMenuByRoleId(roleId);

  useEffect(() => {
    if (assignedData) {
      const assignedMenu = assignedData.map((menu: IMenu) => menu.id);
      setSelectedMenu(assignedMenu);
    }
  }, [assignedData]);
  const assignMenu = useAssignMenu();

  const handleCheckboxChange = (menuId: string) => {
    setSelectedMenu((prevSelected) =>
      prevSelected.includes(menuId)
        ? prevSelected.filter((id) => id !== menuId)
        : [...prevSelected, menuId]
    );
  };

  const handleSelectAllChange = (allMenuIds: string[]) => {
    setSelectedMenu((prevSelected) => {
      const areAllSelected = allMenuIds.every((id) =>
        prevSelected.includes(id)
      );
      return areAllSelected
        ? prevSelected.filter((id) => !allMenuIds.includes(id)) // Unselect all
        : [...prevSelected, ...allMenuIds]; // Select all
    });
  };
  const onSubmit: SubmitHandler<IAssignMenu> = async () => {
    if (selectedMenu.length === 0) {
      console.log("No menu selected");
      return;
    }

    try {
      await assignMenu.mutateAsync({
        roleId,
        menusId: selectedMenu,
        isActive: true,
        isAssign: true,
      });
      refetch();
      refetchRoles();
    } catch (error) {
      console.log("Failed to assign menus", error);
    } finally {
      onClose();
    }
  };

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
      <h1 className="text-xl font-semibold mb-2">Assign Menu</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col h-fit drop-shadow-md p-2 space-y-1 w-fit py-1 rounded-sm relative">
          <div className="absolute left-1 top-4 bottom-4 w-0.5 border-l-2 border-dotted border-black" />
          {subModuleData && subModuleData.length > 0
            ? subModuleData.map((subMod) => (
                <div key={subMod.id} className="">
                  <div className="flex items-center h-fit drop-shadow-md  space w-fit py-1  rounded-sm">
                    <div className="text-md font-semibold ml-2">
                      {subMod.name}
                    </div>
                  </div>
                  <MenuList
                    subModuleId={subMod.id}
                    selectedMenu={selectedMenu}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSelectAllChange={handleSelectAllChange}
                  />
                </div>
              ))
            : !isLoading && <p className="text-sm ml-8">No SubModules found</p>}
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
export default AssignMenuForm;
