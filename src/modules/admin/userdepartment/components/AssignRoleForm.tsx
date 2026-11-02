import { useEffect, useState } from "react";
import { useAssignRole } from "../hooks";
import { MouseEvent } from "react";
import { useGetAllRoles } from "../../rolesdepartment/hooks";
import { useGetRolesByUserId } from "../../rolesdepartment/hooks";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { ButtonElement } from "@/components/FormComponents/Button";
import { IAssign } from "../types/IUserResponse";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

const AssignRoleForm = ({ userId, visible, onClose }: Props) => {
  const { handleSubmit } = useForm<IAssign>();
  const { data: roles, isLoading, refetch } = useGetAllRoles();
  const { data: assignedData } = useGetRolesByUserId(userId);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const assignRole = useAssignRole();
  const assignedRoleIds = assignedData
    ? assignedData.map((role: { Id: string }) => role.Id)
    : [];

  useEffect(() => {
    if (assignedData && assignedData.length > 0) {
      setSelectedRole(assignedRoleIds[0]);
    }
  }, [assignedData]);

  const handleCheckboxChange = (roleId: string, isAssigned: boolean) => {
    if (!isAssigned) {
      setSelectedRole((prevSelected) =>
        prevSelected === roleId ? null : roleId
      );
    }
  };

  const onSubmit: SubmitHandler<IAssign> = async () => {
    if (!selectedRole) {
      console.log("No menu selected");
      return;
    }

    try {
      await assignRole.mutateAsync({
        userId,
        rolesId: [selectedRole],
      });
      refetch();
    } catch (error) {
      console.log("Failed to assign roles", error);
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
    if ((e.target as HTMLDivElement).id === userId) onClose();
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleOnClose}
      id={userId}
      className="w-[13rem] fixed right-[10rem] bg-white p-4 rounded-lg shadow-lg mt-10 z-[5]"
    >
      <h1 className="text-xl font-semibold mb-2">Assign Roles</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {roles && roles.Items.length > 0
          ? roles.Items.map((role) => {
              const isAssigned = assignedRoleIds.includes(role.Id);
              return (
                <div key={role.Id} className="">
                  <div className="flex items-center h-fit drop-shadow-md p-2 space w-fit py-1 rounded-sm">
                    <input
                      type="checkbox"
                      checked={selectedRole === role.Id || isAssigned}
                      onChange={() => handleCheckboxChange(role.Id, isAssigned)}
                      disabled={
                        selectedRole !== null && selectedRole !== role.Id
                      }
                    />
                    <div className="text-md font-medium ml-2">{role.Name}</div>
                  </div>
                </div>
              );
            })
          : !isLoading && <p className="text-sm ml-8">No Roles found</p>}

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

export default AssignRoleForm;
