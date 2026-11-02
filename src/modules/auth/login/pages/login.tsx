import { ButtonElement } from "@/components/FormComponents/Button";
import { InputElement } from "@/components/FormComponents/input";
import { NormalizeStringCase } from "@/helper/normalizeStringCase";
import {
  ILoginType,
  ITokenPayload,
  ITokenPayloadObject,
} from "@/modules/auth/login/types/loginResponse";

import { apiRoutes } from "@/utils/apiRoutes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth/AuthContext";
import { Toast } from "@/helper/getToast";
import { IUserRole } from "@modules/auth/login/types/userRoles";
import { api } from "@/utils/instance";
import { createTheme, ThemeProvider } from "@fluentui/react";
import logo from "@/assets/LOGOO.png";
import { LoginValidator } from "../validators/LoginValidator";
import { useTranslation } from "react-i18next";

// import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateUserDetails } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  localStorage.setItem("language", "English");
  const form = useForm<ILoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginValidator),
  });
  const handleSubmit = async (values: ILoginType) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(`${apiRoutes.login}`, values);

      const token = response.data.token?.toString();

      const tokenPayload: ITokenPayload = jwtDecode<ITokenPayload>(token);

      const userDetails: ITokenPayloadObject = {
        username:
          tokenPayload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
        role: NormalizeStringCase(
          tokenPayload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          false
        ) as IUserRole,
        email:
          tokenPayload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        id: tokenPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
        companyId: tokenPayload["CompanyId"],
      };

      // Store credentials securely
      localStorage.setItem("token", token);
      localStorage.setItem("userId", tokenPayload.sub);
      localStorage.setItem(
        "role",
        NormalizeStringCase(userDetails.role, false)
      );
      localStorage.setItem("email", tokenPayload.sub);

      localStorage.setItem("companyId", tokenPayload.CompanyId);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      updateUserDetails(userDetails);

      const roleToDashboardMap: Partial<Record<IUserRole, string>> = {
        superadmin: "/Admin",
        developeruser: "/developer",
      };

      const dashboardRoute =
        roleToDashboardMap[userDetails.role] || "/end-user";

      setTimeout(() => navigate(dashboardRoute), 200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "Failed to login.";
      if (error.response?.data) {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customTheme = createTheme({
    palette: {
      themePrimary: "#14b8a6",
    },
  });

  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex flex-col justify-center items-center bg-orange-300 p-6 md:px-10">
          <div className="bg-white h-full w-full max-w-md md:max-w-none md:h-[97%] md:w-[100%] rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center h-full p-6">
              <img
                src={logo}
                alt="System Logo"
                className="w-32 md:w-[21%] mb-2 rounded-lg transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center bg-teal-500 p-6 md:px-10">
          <div className="bg-white h-full w-full max-w-md md:max-w-none md:h-[97%] md:w-[100%] rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center h-full p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-6">
                {t("login")}
              </h2>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="bg-[#f6f6fa] lg:min-w-[500px] sm:min-w-[200px] p-10 rounded-lg pb-7 "
              >
                <div className="mb-3">
                  <InputElement
                    form={form}
                    label={t("Email")}
                    name="email"
                    preview={false}
                    placeholder="प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्"
                    size="large"
                    value={form.watch("email") || ""}
                    className="mb-2"
                    inputType="text"
                  />
                </div>

                <div className="mb-3 relative">
                  <InputElement
                    label={t("password")}
                    form={form}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    preview={false}
                    placeholder="पासवर्ड प्रविष्ट गर्नुहोस्"
                    size="large"
                    value={form.watch("password") || ""}
                    className="mb-2 pr-16"
                  />

                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center text-teal-600 text-sm gap-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span>
                      {showPassword ? `${t("Hide")}` : `${t("Show")}`}
                    </span>
                  </button>
                </div>

                <div className="flex items-center mt-4 flex-col">
                  <ThemeProvider theme={customTheme}>
                    <ButtonElement
                      style={{
                        backgroundColor: customTheme.palette.themePrimary,
                      }}
                      className="hover:bg-teal-50 transition-all duration-200 ease-in-out"
                      isLoading={isSubmitting}
                      type="submit"
                      text={t("login")}
                    />
                  </ThemeProvider>
                  <p className="text-center mt-4">
                    {t("No Account")}?
                    <Link to="/register" className="text-teal-400">
                      {" "}
                      {t("Register Here")}
                    </Link>
                  </p>
                  <p className="text-red-500 hover:underline transition-all duration-200 ease-in-out">
                    {t("Forgot Password")}?
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
