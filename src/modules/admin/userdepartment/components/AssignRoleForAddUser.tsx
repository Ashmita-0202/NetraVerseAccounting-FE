import { useEffect } from "react";

import { useGetAllRoles } from "../../rolesdepartment/hooks";
import { useGetRolesForOtherRole } from "../../RolePermission/hooks";
import AssignedRoleForOther from "@/modules/admin/userdepartment/components/AssignedRolesForOther";

interface Props {
  userId: string;
  selectedRole: string | undefined;
  setSelectedRole: React.Dispatch<React.SetStateAction<string | undefined>>;
  setRoleName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AssignRoleForAddUser = ({
  selectedRole,
  setSelectedRole,
  setRoleName,
}: Props) => {
  const role = localStorage.getItem("role");
  const { data: otherRoles, refetch } = useGetRolesForOtherRole();
  const { data: superAdminRoles, isLoading } = useGetAllRoles();

  const handleCheckboxChange = (
    roleId: string | undefined,
    roleName: string | undefined
  ) => {
    setSelectedRole((prevSelected) =>
      prevSelected === roleId ? undefined : roleId
    );
    setRoleName((prevSelected) =>
      prevSelected === roleName ? undefined : roleName
    );
  };
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="bg-white p-4 rounded-lg h-[15rem]">
      <h1 className="text-xl font-semibold mb-2">Assign Roles</h1>
      <div>
        {role === "superadmin"
          ? superAdminRoles?.Items && superAdminRoles.Items.length > 0
            ? superAdminRoles.Items.map((role) => {
                return (
                  <div key={role.Id} className="">
                    <div className="flex items-center h-fit drop-shadow-md p-2 space w-fit py-1 rounded-sm">
                      <input
                        type="checkbox"
                        checked={selectedRole === role.Id}
                        onChange={() =>
                          handleCheckboxChange(role.Id, role.Name)
                        }
                      />
                      <div className="text-md font-medium ml-2">
                        {role.Name}
                      </div>
                    </div>
                  </div>
                );
              })
            : !isLoading && <p className="text-sm ml-8">No Roles found</p>
          : otherRoles && otherRoles.length > 0
          ? otherRoles.map((role) => {
              return (
                <AssignedRoleForOther
                  roleId={role.roleId}
                  selectedRole={selectedRole}
                  handleCheckboxChange={handleCheckboxChange}
                />
              );
            })
          : !isLoading && (
              <p className="text-sm ml-8">No Roles found of other role</p>
            )}
      </div>
    </div>
  );
};

export default AssignRoleForAddUser;
