import { ButtonElement } from "@/components/FormComponents/Button";
import { InputElement } from "@/components/FormComponents/input";
import GridLayout from "@/Layout/GridLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterValidator } from "@/modules/auth/register/validators/RegisterValidator";
import { useTranslation } from "react-i18next";
import { api } from "@/utils/instance";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { Toast } from "@/helper/getToast";

export interface IRegisterType {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}
const Register = () => {
  //const navigate = useNavigate();
  const form = useForm<IRegisterType>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    resolver: yupResolver(RegisterValidator),
  });

  const handleRegister = async (values: IRegisterType) => {
    try {
      const res = await api.post("/api/Account/Register", values);

      console.log("Test", res);

      // Handle token storage if needed or other post-registration logic
      // if (res) {
      //   try {
      //     handleOtpAlert(values, navigate);
      //   } catch (error) {
      //     debugger;
      //   }
      // }
    } catch (error) {
      const err = error as AxiosError;
      const errmsg = err?.response?.data || "Failed to register";
      Toast.error(errmsg as string);
    }
  };

  const { t } = useTranslation();
  return (
    <>
      <div
        className="flex min-h-screen bg-cover"
        style={{
          backgroundImage:
            "url(https://events.3ds.com/sites/default/files/ls-deep-dive-webinar-applications-ai-machine-learning-lab-1600x900.jpg)",
        }}
      >
        <div className="w-1/2 bg-gray-200 p-4">
          <h2>Sidebar</h2>
          <p>Sidebar content goes here.</p>
        </div>

        <div className="w-1/2 bg-gray-100 p-4 flex min-h-screen items-center ">
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="bg-[#f6f6fa] lg:min-w-[800px] sm:min-w-100 p-5 rounded-lg pb-7"
          >
            <div>
              <GridLayout className="md:grid-cols-3 sm:grid-cols-2">
                <InputElement
                  form={form}
                  name="firstName"
                  label="First Name"
                  preview={false}
                  placeholder="First Name"
                  size="large"
                  type="text"
                />

                <InputElement
                  form={form}
                  name="middleName"
                  label="Middle Name"
                  preview={false}
                  placeholder="Middle Name"
                  size="large"
                  type="text"
                />

                <InputElement
                  form={form}
                  name="lastName"
                  label="Last Name"
                  preview={false}
                  placeholder="Last Name"
                  size="large"
                  type="text"
                />
              </GridLayout>
              <GridLayout className="md:grid-cols-3 sm:grid-cols-2 mt-2">
                <InputElement
                  form={form}
                  name="username"
                  label="username"
                  preview={false}
                  placeholder="Username"
                  size="large"
                  type="text"
                />
                <InputElement
                  form={form}
                  name="phoneNumber"
                  label="Phone Number"
                  preview={false}
                  placeholder="Phone Number"
                  size="large"
                  type="text"
                />

                <InputElement
                  form={form}
                  name="email"
                  label="Email"
                  preview={false}
                  placeholder="eg. test@example.com"
                  size="large"
                  type="email"
                />
                <InputElement
                  form={form}
                  name="role"
                  label="role"
                  preview={false}
                  placeholder="Role"
                  size="large"
                  type="text"
                />
              </GridLayout>
              <GridLayout className="grid-cols-2 mt-3">
                <InputElement
                  form={form}
                  name="password"
                  label="Password"
                  preview={false}
                  placeholder="Password"
                  size="large"
                  type="password"
                />
                <InputElement
                  form={form}
                  name="confirmPassword"
                  label="Confirm Password"
                  preview={false}
                  placeholder="Confirm Password"
                  size="large"
                  type="password"
                />
              </GridLayout>
            </div>

            <div className="flex items-end justify-end mt-4 flex-col">
              <ButtonElement
                isLoading={form.formState.isSubmitting}
                type="submit"
                text={t("Register")}
              />
              <p className="text-center mt-4">
                {t("Already Have Account")}?{" "}
                <Link to="/login" className="text-blue-500">
                  {t("Login Here")}
                </Link>
              </p>
            </div>

            <p className="text-center ">&copy;</p>
            {/* </motion.form> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
