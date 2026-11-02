/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import plus from "../assets/plus.png";
import minus from "../assets/minus.png";
import circle from "@/assets/circle.svg";
import Dashboardicon from "@/assets/module.png";
import moduleicon from "@/assets/module.png";
import Setupicon from "@/assets/setup.png";
import Navigationicon from "@/assets/Navigation.png";
import AccessControlicon from "@/assets/AccessControl.png";
import InstitutionSetupicon from "@/assets/InstitutionSetup.png";
import logo from "@/assets/LOGOO.png";
import { ISidebar } from "./types/ISidebar";
import defaultIcon from "@/assets/account.png";
import setting from "@/assets/setting.svg";
import logout from "@/assets/logout.svg";
import garima from "@/assets/garim.jpg";
import usericon from "@/assets/users.svg";
import { usePermissions } from "@/context/auth/PermissionContext";

type Props = {
  sideBarItems: ISidebar;
  isOpen: boolean;
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
    transition: "width 0.3s ease",
  },
});

const Sidebar: React.FC<Props> = ({ isOpen, sideBarItems }: Props) => {
  const { setMenuStatus } = usePermissions();
  const styles = useStyles();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("Guest");
  const [gmail, setGmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "superadmin" || role === "developeruser") {
      setMenuStatus([
        {
          menuName: "add",
          isActive: true,
          submoduleId: "",
          icon: "",
          targetUrl: "",
          role: "",
          rank: 0,
        },
        {
          menuName: "edit",
          isActive: true,
          submoduleId: "",
          icon: "",
          targetUrl: "",
          role: "",
          rank: 0,
        },
        {
          menuName: "delete",
          isActive: true,
          submoduleId: "",
          icon: "",
          targetUrl: "",
          role: "",
          rank: 0,
        },
        {
          menuName: "assign",
          isActive: true,
          submoduleId: "",
          icon: "",
          targetUrl: "",
          role: "",
          rank: 0,
        },
      ]);
    }
  }, [role, setMenuStatus]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      try {
        const parsedDetails = JSON.parse(storedUserDetails);
        setProfileName(parsedDetails.username || "Guest");
        setGmail(localStorage.email || "xyz@gmail.com");
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }
  }, []);

  const toggleLogoutVisibility = () => {
    setShowDropdown((prev) => !prev);
  };

  const staticIcons: { [key: string]: string } = {
    Dashboard: Dashboardicon,
    Setup: Setupicon,
    Navigation: Navigationicon,
    "Access Control": AccessControlicon,
    "Institution Setup": InstitutionSetupicon,
  };

  const sortByRank = (a: any, b: any) => (a.rank ?? 999) - (b.rank ?? 999);

  const sortedModules = [...sideBarItems.module]
    .sort(sortByRank)
    .map((item) => ({
      ...item,
      subModulesResponse: item.subModulesResponse
        ? [...item.subModulesResponse].sort(sortByRank)
        : [],
    }));

  const navLinks = sortedModules.map((item) => ({
    name: item.name,
    url: item.targetUrl,
    key: item.targetUrl,
    icon: staticIcons[item.name] || defaultIcon,
    subItems: item.subModulesResponse
      ? [...item.subModulesResponse].sort(sortByRank)
      : [],
    allowedRoles: item.role,
  }));
  const handleSelectSubModule = (subModuleId: string | null) => {
    setActiveSubModule(subModuleId);
  };

  const handleSectionClick = (section: string) => {
    if (activeSection !== section) {
      setActiveSubModule(null);
    }
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`${styles.root} ${
        isOpen ? "w-16" : "w-16"
      } sm:w-12 md:w-60  flex flex-col transition-all duration-300 min-w-[60px]`}
    >
      <div className="p-4 flex flex-col">
        <div className="flex justify-center">
          <Link to="/Admin">
            <img src={logo} alt="logo" className="h-10 w-10 md:h-16 md:w-16" />
          </Link>
        </div>
        <div>
          <button
            className="flex justify-center md:justify-start items-center text-base mt-3 w-full rounded-md transition-all duration-200"
            onClick={() => {
              navigate("/Admin");
            }}
          >
            <img src={moduleicon} alt="Dashboard Icon" className="h-5" />
            <span className="ml-2 hidden md:inline">Dashboard</span>
          </button>
          <div>
            {navLinks
              .filter((item) =>
                (item.allowedRoles ?? []).includes(
                  localStorage.getItem("role")?.toLowerCase() || ""
                )
              )
              .map((targetUrl) => (
                <React.Fragment key={targetUrl.key}>
                  <button
                    className="flex justify-center md:justify-start items-center text-base cursor-pointer mt-6 w-full"
                    onClick={() => handleSectionClick(targetUrl.key)}
                  >
                    <img
                      src={targetUrl.icon}
                      alt={targetUrl.name}
                      className="h-4"
                    />
                    <span className="ml-2 hidden md:inline">
                      {targetUrl.name}
                    </span>
                    <img
                      src={activeSection === targetUrl.key ? minus : plus}
                      alt="toggle"
                      className="h-4 ml-auto hidden md:inline"
                    />
                  </button>

                  {activeSection === targetUrl.key && targetUrl.subItems && (
                    <div className="ml-3 pl-5 relative">
                      <div className="absolute left-0 top-0 bottom-0 border-l hidden md:block border-gray-400 "></div>
                      {targetUrl.subItems.map((subItem, index) => (
                        <div
                          key={
                            subItem.subModulesId ||
                            `${subItem.targetUrl}-${index}`
                          }
                          className="relative"
                        >
                          {activeSubModule === subItem.subModulesId && (
                            <img
                              src={circle}
                              className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-2 h-3 z-10"
                              alt="selected"
                            />
                          )}

                          <NavLink
                            onClick={() =>
                              handleSelectSubModule(subItem.subModulesId!)
                            }
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
                              {subItem.name}
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
      <div className="absolute bottom-2 left-2 md:left-4 lg:left-16 w-full lg:w-auto">
        <img
          src={garima}
          alt="User"
          className="w-8 h-9 rounded-full object-cover cursor-pointer"
          onClick={toggleLogoutVisibility}
        />
        {showDropdown && (
          <div className="absolute left-0 bottom-full mb-2 min-w-[150px] sm:min-w-[170px] w-auto max-w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 flex items-center">
              <img src={garima} className="w-7 h-8 rounded-full" alt="User" />
              <p className="font-semibold text-gray-900 ml-3">{profileName}</p>
            </div>
            <p className=" text-gray-900 ml-14 ">{gmail}</p>

            <div className="border-b border-gray-300" />
            <ul className="py-2">
              <li className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <img src={usericon} alt="profile" className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
              </li>
              <li className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <img src={setting} alt="setting" className="w-5 h-5" />
                <span className="hidden md:inline">Setting</span>
              </li>
              <li
                className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={handleLogout}
              >
                <img src={logout} alt="logout" className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
