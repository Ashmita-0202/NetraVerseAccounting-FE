import React, { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import circle from "@/assets/circle.svg";
import logo from "@/assets/LOGOO.png";
import setting from "@/assets/setting.svg";
import logout from "@/assets/logout.svg";
import garima from "@/assets/garim.jpg";
import moduleicon from "@/assets/module.png";
import { ModuleGetDTO } from "@/modules/admin/rolesmodules/types/ModuleGetDTOs";
import { useGetMenuStatus } from "@/modules/admin/rolesmodules/menu/hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import inventoryIcon from "@/assets/inventory.png";
import salesIcon from "@/assets/sales.png";
import accountIcon from "@/assets/account.png";
import usericon from "@/assets/users.svg";
import adminIcon from "@/assets/users.svg";
import purchaseIcon from "@/assets/purchaseIcon.png";
import defaultIcon from "@/assets/FILEE.svg";
import ReceiptIcon from "@/assets/ReceiptPayment.png";
import voucher from "@/assets/voucher.png";
import IncomeExpenses from "@/assets/income and expenses.png";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
import { useTranslation } from "react-i18next";

type Props = {
  sideBarItems?: ModuleGetDTO[];
  isOpen?: boolean;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    position: "fixed",
    zIndex: 30,
    left: 0,
    fontFamily: "!Poppins",
    fontStyle: "bold",
    backgroundColor: "white",
    overflowY: "auto",
    transition: "width 0.3s ease",
  },
});

const UserSideBar: React.FC<Props> = ({ isOpen, sideBarItems }: Props) => {
  const { t } = useTranslation();
  const { setMenuStatus } = usePermissions();
  const styles = useStyles();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSubModule, setActiveSubModule] = useState<string | undefined>(
    "subModule"
  );
  const [activeRole, setActiveRole] = useState<string | undefined>("role");
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("Guest");
  const [gmail, setGmail] = useState("xyz@gmail.com");

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      setProfileName(parsedDetails.username || "Guest");
      setGmail(parsedDetails.email || "xyz@gmail.com");
    }
  }, []);

  const handleSelectSubModule = (
    id: string | undefined,
    role: string | undefined
  ) => {
    setActiveSubModule(id);
    setActiveRole(role);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleSectionClick = (section: string) => {
    if (activeSection !== section) {
      setActiveSubModule("");
    }
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  const { data: menuStatus, refetch } = useGetMenuStatus(
    activeSubModule,
    activeRole
  );
  const toggleLogoutVisibility = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const storedMenuStatus = localStorage.getItem("menuStatus");
    if (storedMenuStatus) {
      setMenuStatus(JSON.parse(storedMenuStatus));
    }
  }, [setMenuStatus]);

  useEffect(() => {
    if (activeRole !== "role" && menuStatus) {
      setMenuStatus(menuStatus);
      localStorage.setItem("menuStatus", JSON.stringify(menuStatus));
    }
  }, [activeRole, menuStatus, setMenuStatus]);

  useEffect(() => {
    if (activeSubModule && activeRole) refetch();
  }, [refetch, activeRole, activeSubModule]);

  const staticIcons: { [key: string]: string } = {
    Inventory: inventoryIcon,
    Sales: salesIcon,
    Report: accountIcon,
    Account: accountIcon,
    Administration: adminIcon,
    Purchase: purchaseIcon,
    Voucher: voucher,
    "Income/ Expense": IncomeExpenses,
    "Receipt/ Payment ": ReceiptIcon,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortByRank = (a: any, b: any) => (a.rank ?? 999) - (b.rank ?? 999);

  const sortedSidebarItems = sideBarItems
    ? [...sideBarItems].sort(sortByRank).map((item) => ({
        ...item,
        subModulesResponse: item.subModulesResponse
          ? [...item.subModulesResponse].sort(sortByRank)
          : [],
      }))
    : [];
  const navlinks = sortedSidebarItems.map((item) => {
    return {
      name: item.name,
      url: item.targetUrl,
      key: item.targetUrl,
      icon: staticIcons[item.name] || defaultIcon,
      allowedRoles: item.role,
      isActive: item.isActive,
      SubModuleGetDTOs: item.subModulesResponse,
    };
  });

  return (
    <div
      className={`${styles.root} ${
        isOpen ? "w-16" : "w-16"
      } sm:w-12 md:w-60  flex flex-col transition-all duration-300 min-w-[60px]`}
    >
      <div className="p-4 flex flex-col">
        <div className="flex justify-center">
          <Link to="/end-user">
            <img src={logo} alt="logo" className="h-10 w-10 md:h-16 md:w-16" />
          </Link>
        </div>

        <div>
          <button
            className="flex justify-center md:justify-start items-center text-base mt-3 w-full rounded-md transition-all duration-200"
            onClick={() => navigate("/end-user")}
          >
            <img src={moduleicon} alt="Dashboard Icon" className="h-5" />
            <span className="ml-2 hidden md:inline">{t("Dashboard")}</span>
          </button>

          <div>
            {navlinks?.map((targetUrl) => (
              <React.Fragment key={targetUrl.key}>
                <button
                  className="flex justify-center md:justify-start items-center text-base cursor-pointer mt-6 w-full"
                  onClick={() => handleSectionClick(targetUrl.key)}
                >
                  <img
                    src={targetUrl.icon}
                    alt={targetUrl.name}
                    className="h-5"
                  />
                  <span className="ml-2 hidden md:inline">
                    {t(`${targetUrl.name}`)}
                  </span>
                  <img
                    src={activeSection === targetUrl.key ? minus : plus}
                    alt="toggle"
                    className="h-4 ml-auto hidden md:inline"
                  />
                </button>

                {activeSection === targetUrl.key &&
                  targetUrl.SubModuleGetDTOs && (
                    <div className="ml-3 pl-5 relative">
                      <div className="absolute left-0 top-0 bottom-0 border-l border-gray-400"></div>
                      {targetUrl.SubModuleGetDTOs.map((subItem) => (
                        <div
                          className="relative flex justify-center mt-1 text-gray-500 md:justify-start items-center focus:text-black hover:text-black"
                          key={subItem.targetUrl}
                        >
                          {activeSubModule === subItem.subModulesId && (
                            <img
                              src={circle}
                              className="absolute left-[-1.75rem] top-1/2 transform -translate-y-1/2 
                                         w-4 h-2 z-10 hidden md:block"
                              alt="selected"
                            />
                          )}
                          <NavLink
                            onClick={() => {
                              const role = Array.isArray(subItem.role)
                                ? subItem.role[0]
                                : subItem.role;

                              handleSelectSubModule(subItem.subModulesId, role);
                            }}
                            to={subItem.targetUrl}
                            className={`inline-block text-base/8 text-gray-500 hover:border-gray-500 hover:text-gray-500
                        sm:text-sm/6 dark:text-gray-600 dark:hover:border-black/25 dark:hover:text-black
                        aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-black-950 
                        dark:aria-[current]:border-black dark:aria-[current]:text-black ${
                          activeSubModule === subItem.subModulesId
                            ? "font-medium text-black"
                            : ""
                        }`}
                          >
                            <span className="hidden md:inline">
                              {t(`${subItem.name}`)}
                            </span>
                          </NavLink>
                        </div>
                      ))}
                    </div>
                  )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-2 sm:left-8 md:left-20 lg:left-20 w-auto flex flex-col items-start z-50">
        <img
          src={garima}
          alt="User"
          className="w-8 h-9 rounded-full object-cover cursor-pointer"
          onClick={toggleLogoutVisibility}
        />
        {showDropdown && (
          <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 min-w-[150px] sm:min-w-[170px] w-auto max-w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="px-4 flex items-center py-2">
              <img src={garima} className="w-7 h-8 rounded-full" alt="User" />
              <p className="font-semibold text-gray-900 ml-3 truncate">
                {t(`${profileName}`)}
              </p>
            </div>
            <p className="text-gray-900 ml-14 truncate text-sm">{gmail}</p>

            <div className="border-b border-gray-300 my-2" />

            <ul className="py-2">
              <li className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <img src={usericon} alt="profile" className="w-5 h-5" />
                <span> {t("Profile")}</span>
              </li>
              <li className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <img src={setting} alt="setting" className="w-5 h-5" />
                <span>{t("Settings")}</span>
              </li>
              <li
                className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={handleLogout}
              >
                <img src={logout} alt="logout" className="w-5 h-5" />
                <span>{t("Logout")}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSideBar;
