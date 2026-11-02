import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IUserResponse } from "../types/IUserResponse";
import { useEditUser, useGetAllUsers } from "../hooks";
import { InputElement } from "@/components/FormComponents/input";
import { ButtonElement } from "@/components/FormComponents/Button";
import { AxiosError } from "axios";
import { Toast } from "@/helper/getToast";
import { createTheme, ThemeProvider } from "@fluentui/react";
import { useRef, useState } from "react";
import close from "@/assets/xmark-solid.svg";
import image from "../../../../assets/add image.svg";

type Props = {
  form: UseFormReturn<IUserResponse>;
  userId: string;
  onClose: () => void;
  currentPageIndex: number;
};

const EditUserForm = ({ form, userId, onClose, currentPageIndex }: Props) => {
  const updateUser = useEditUser(userId);
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllUsers(query);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(image);
  const onSubmit: SubmitHandler<IUserResponse> = async (form) => {
    try {
      await updateUser.mutateAsync(form);
      Toast.success("Successfully updated User");
      onClose();
      refetch();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to add module" + error);
      }
    } finally {
      onClose();
    }
  };
  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

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
  return (
    <div
      id="container"
      className=" fixed  inset-0 flex justify-center items-center border-rounded-lg bg-opacity-30 backdrop-blur-sm"
    >
      <div className="max-h-screen w-[30rem]">
        <div className=" rounded-lg ">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="bg-white p-6  drop-shadow-md ">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg  font-semibold">Edit User</h1>
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
                    placeholder="Enter your Password"
                  />
                </div>

                <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={profileImage}
                    alt="add profile"
                    className="object-cover w-18 h-14  cursor-pointer pr-6"
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

              <div className="flex mt-4 justify-center">
                <ThemeProvider theme={customTheme} className="mr-3">
                  <ButtonElement
                    style={{
                      backgroundColor: customTheme.palette.themePrimary,
                      padding: "4px 0 5px 0",
                      borderRadius: "6px",
                    }}
                    type="submit"
                    className="hover:bg-teal-700 transition-all !text-xm font-bold !bg-teal-500"
                    text={"Submit"}
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

export default EditUserForm;
