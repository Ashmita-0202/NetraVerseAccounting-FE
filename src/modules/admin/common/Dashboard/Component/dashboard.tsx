import React, { useEffect, useState } from "react";
import moduleicon from "@/assets/module.png";
import roleicon from "@/assets/roles.png";
import usericon from "@/assets/users.svg";
import organizationicon from "@/assets/organization.png";
import expand from "@/assets/expand.png";
import { XAxis, YAxis, BarChart, Bar, ResponsiveContainer } from "recharts";
import { useGetAllModules } from "@/modules/admin/rolesmodules/modules/hooks";
import { useGetAllRoles } from "@/modules/admin/rolesdepartment/hooks";
import { useGetAllUsers } from "@/modules/admin/userdepartment/hooks";
import { useGetAllOrganization } from "@/tempdata/hooks";

const AdminDashboard: React.FC = () => {
  const [profileName, setProfileName] = useState("Guest");
  const [profileRole, setProfileRole] = useState("Unknown Role");
  const [totalModules, setTotalModules] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalData, setModalData] = useState<string[]>([]);

  const { data: modules, isLoading: isLoadingModules } = useGetAllModules();
  const { data: roles, isLoading: isLoadingRoles } = useGetAllRoles();
  const { data: users, isLoading: isLoadingUsers } = useGetAllUsers();
  const { data: organizations, isLoading: isLoadingOrganizations } =
    useGetAllOrganization();

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      setProfileName(parsedDetails.username || "Guest");
      setProfileRole(parsedDetails.role || "Unknown Role");
    }
  }, []);

  useEffect(() => {
    setTotalModules(Array.isArray(modules?.Items) ? modules.Items.length : 0);
    setTotalRoles(Array.isArray(roles?.Items) ? roles.Items.length : 0);
    setTotalUsers(Array.isArray(users?.Items) ? users.Items.length : 0);
    setTotalOrganizations(
      Array.isArray(organizations?.Items) ? organizations.Items.length : 0
    );
  }, [modules, roles, users, organizations]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnlargeClick = (category: string, data: any[]) => {
    setSelectedCategory(category);

    let extractedData: string[] = [];
    if (category === "Modules") {
      extractedData = data
        .map((item) => item?.moduleName || item?.Name || "Unknown Module")
        .filter(Boolean);
    } else if (category === "Roles") {
      extractedData = data
        .map((item) => item?.roleName || item?.Name || "end-user")
        .filter(Boolean);
    } else if (category === "Users") {
      extractedData = data
        .map((item) => item?.UserName || "Unknown User")
        .filter(Boolean);
    } else if (category === "Organizations") {
      extractedData = data
        .map((item) => item?.name || "Unknown Organization")
        .filter(Boolean);
    }

    setModalData(extractedData);
    setIsModalOpen(true);
  };

  const chartData = [
    { name: "Modules", value: totalModules },
    { name: "Roles", value: totalRoles },
    { name: "Users", value: totalUsers },
    { name: "Organizations", value: totalOrganizations },
  ];

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen ml-2 mt-2">
      <header className="flex justify-between items-center bg-white p-3 rounded-md shadow">
        <h1 className="text-xl font-bold ml-5 mb-2">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <h1 className="font-bold text-lg">{profileName}</h1>
            <span className="text-gray-500 text-sm">{profileRole}</span>
          </div>
          <img
            src={usericon}
            className="w-10 h-10 rounded-full"
            alt="User Profile"
          />
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 ">
        {[
          {
            icon: moduleicon,
            title: "Modules",
            count: totalModules,
            isLoading: isLoadingModules,
            data: modules?.Items || [],
          },
          {
            icon: roleicon,
            title: "Roles",
            count: totalRoles,
            isLoading: isLoadingRoles,
            data: roles?.Items || [],
          },
          {
            icon: usericon,
            title: "Users",
            count: totalUsers,
            isLoading: isLoadingUsers,
            data: users?.Items || [],
          },
          {
            icon: organizationicon,
            title: "Organizations",
            count: totalOrganizations,
            isLoading: isLoadingOrganizations,
            data: organizations?.Items || [],
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white text-black p-3  rounded-lg shadow-md relative"
          >
            <img
              src={item.icon}
              alt="Dashboard"
              className=" h-5 mb-2 absolute "
            />
            <h2 className="text-lg font-semibold ml-8">{item.title}</h2>
            <img
              src={expand}
              alt="Expand"
              className="h-5 absolute top-2 right-2 cursor-pointer"
              onClick={() => handleEnlargeClick(item.title, item.data)}
            />
            {item.isLoading ? (
              <div className="animate-pulse h-6 w-10 bg-gray-300 rounded"></div>
            ) : (
              <p className="ml-9 text-2xl font-bold ">{item.count}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={60}>
                <XAxis dataKey="name" stroke="#000000" fontSize={12} />
                <YAxis stroke="#4B5563" fontSize={12} />
                <Bar
                  dataKey="value"
                  fill="#14b8a6"
                  strokeWidth={2}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:w-1/3 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-start mb-4">
            Recent Activities
          </h2>

          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-blue-500 text-lg">📌</span>
              <p className="text-sm text-gray-700">
                New module added:
                <b className="text-md text-black"> Dashboard</b>
              </p>
            </li>
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-sm text-gray-700">
                User <b className="text-md text-black">Admin</b> updated
                permissions
              </p>
            </li>
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-sm text-red-400">Unauthorized login attempt</p>
            </li>
          </ul>

          <div className="mt-4 text-center">
            <button className="px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-md hover:bg-teal-500 transition">
              View More
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Transaction Details</h2>

        <ul className="mt-4 space-y-3">
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-lg">💰</span>
              <p className="text-sm text-gray-700">
                Payment Received - <span className="text-green-400">$100</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-lg">📉</span>
              <p className="text-sm text-gray-700">
                Payment Sent - <span className="text-red-400">$75</span>{" "}
              </p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-lg">🔄</span>
              <p className="text-sm text-gray-700">
                Refund Processed - <span className="text-blue-400">$50</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </li>
        </ul>

        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-md hover:bg-teal-600 transition">
            View More
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="container"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={(e) => {
            if ((e.target as HTMLDivElement).id === "container") {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
            <ul className="max-h-60 overflow-y-auto list-disc pl-5">
              {modalData.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
