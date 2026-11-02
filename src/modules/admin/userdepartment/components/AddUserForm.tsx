import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IUserResponse } from "../types/IUserResponse";
import { useAddUser, useGetAllUsers } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { Toast } from "@/helper/getToast";
import { AxiosError } from "axios";
import { useState, useRef, useEffect } from "react";
import image from "../../../../assets/add image.svg";
import close from "@/assets/xmark-solid.svg";
import AssignRoleForAddUser from "@/modules/admin/userdepartment/components/AssignRoleForAddUser";
import InstitutionFormForAddUser from "@/modules/admin/userdepartment/components/InstitutionFormForAddUser";
import CompanyFormForAddUser from "@/modules/admin/userdepartment/components/CompanyFormForAddUser";

type Props = {
  form: UseFormReturn<IUserResponse>;
  onClose: () => void;
};

const AddUserForm = ({ form, onClose }: Props) => {
  const addUser = useAddUser();
  const { refetch } = useGetAllUsers();
  const [selectedRole, setSelectedRole] = useState<string | undefined>("");
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(
    null
  );
  const [roleName, setRoleName] = useState<string | undefined>("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>("");
  useEffect(() => {
    localStorage.setItem("companyId", selectedCompany ?? "");
  }, [selectedCompany]);
  const [activeTab, setActiveTab] = useState("Assign roles");
  const [profileImage, setProfileImage] = useState(image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [companyName, setCompanyName] = useState<string | null>("");
  const [institutionName, setInstitutionName] = useState<string | null>("");
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (selectedRole) {
      form.setValue("rolesId", [selectedRole], {
        shouldValidate: true,
      });
    }
    if (selectedInstitution) {
      form.setValue("InstitutionId", selectedInstitution, {
        shouldValidate: true,
      });
    }
    if (selectedCompany) {
      form.setValue("companyIds", [selectedCompany], {
        shouldValidate: true,
      });
    }
  }, [selectedCompany, selectedInstitution, selectedRole, form]);

  const onSubmit: SubmitHandler<IUserResponse> = async (data) => {
    try {
      await addUser.mutateAsync(data);
      Toast.success("Successfully added User");
      onClose();
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data
          : `Failed to add user: ${error}`;
      Toast.error(errorMessage);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  return (
    <div
      id="container"
      className="fixed inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className="max-h-screen w-[30rem]">
        <div className="rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="bg-white p-6 border-solid border-gray-200 border shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg  font-semibold">Add User</h1>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-400 text-2xl hover:text-red-500 "
                >
                  <img src={close} alt="close" className="w-8 h-7" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="grid grid-rows-2 gap-4 flex-1">
                  <InputElement
                    label="User Name"
                    form={form}
                    layout="row"
                    name="UserName"
                    placeholder="Enter your name here"
                  />
                  <InputElement
                    label="Email"
                    form={form}
                    layout="row"
                    name="Email"
                    placeholder="Enter your email here"
                  />
                  <InputElement
                    label="Password"
                    form={form}
                    layout="row"
                    name="Password"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={profileImage}
                    alt="add profile"
                    className="object-cover w-18 h-14 cursor-pointer pr-6"
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="border-b-4 border-teal-500 mb-6 rounded-t-md">
                <div className="flex">
                  {(role === "superadmin"
                    ? ["Assign roles", "Institution"]
                    : ["Assign roles", "Company"]
                  ).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`py-2 px-4 rounded-t-md transition-all ${
                        activeTab === tab ? "bg-teal-500 text-white" : ""
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "Assign roles" ? (
                <div>
                  <InputElement
                    label="Role"
                    form={form}
                    name="rolesId"
                    value={roleName || ""}
                  />
                  <AssignRoleForAddUser
                    setRoleName={setRoleName}
                    userId=""
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                  />
                </div>
              ) : role === "superadmin" && activeTab === "Institution" ? (
                <div>
                  <InputElement
                    label="Institution"
                    form={form}
                    name="InstitutionId"
                    value={institutionName || ""}
                  />
                  <InstitutionFormForAddUser
                    setInstitutionName={setInstitutionName}
                    userId=""
                    selectedInstitution={selectedInstitution}
                    setSelectedInstitution={setSelectedInstitution}
                  />
                </div>
              ) : role !== "superadmin" && activeTab === "Company" ? (
                <div>
                  <InputElement
                    label="Company"
                    form={form}
                    name="companyIds"
                    value={companyName || ""}
                  />
                  <CompanyFormForAddUser
                    userId=""
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                    setCompanyName={setCompanyName}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="flex mt-4 justify-center space-x-2">
                <ThemeProvider theme={customTheme}>
                  <ButtonElement
                    style={{
                      backgroundColor: customTheme.palette.themePrimary,
                      padding: "4px 0 5px 0",
                      borderRadius: "6px",
                    }}
                    type="submit"
                    className="hover:bg-teal-700 transition-all !text-xm font-bold !bg-teal-500"
                    text="Submit"
                  />
                </ThemeProvider>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
