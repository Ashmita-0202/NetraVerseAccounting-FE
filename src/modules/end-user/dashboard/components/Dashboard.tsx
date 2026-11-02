import React, { useEffect, useState } from "react";
import moduleicon from "@/assets/module.png";
import roleicon from "@/assets/roles.png";
import usericon from "@/assets/users.svg";
import organizationicon from "@/assets/organization.png";
import expand from "@/assets/expand.png";
import { XAxis, YAxis, BarChart, Bar, ResponsiveContainer } from "recharts";
import { useGetAllPurchase } from "../../PurchaseComp/purchase/hooks";
import { useGetAllSales } from "../../SalesComp/sales/hooks";
import { useGetAllSalesReturn } from "../../SalesComp/salesReturn/hooks";
import { useGetAllPurchaseReturn } from "../../PurchaseComp/purchaseReturn/hooks";
import { useGetAllLedgers } from "../../account/ledger/hooks";
import { useTranslation } from "react-i18next";
import garima from "@/assets/garim.jpg";
import { useGetAllItem } from "../../Inventory/Item/hooks";
import { useGetAllItemGroup } from "../../Inventory/ItemGroup/hooks";
import { useGetAllUnits } from "../../Inventory/Units/hooks";
import { useGetAllInventory } from "../../Inventory/InventoryLedger/hooks";
import { useGetAllConversionFactor } from "../../Inventory/ConversionFactor/hooks";
import i18n from "@/components/translate/i18n";
import { ButtonElement } from "@/components/FormComponents/Button";
import { BellDot, Globe } from "lucide-react";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState("Guest");
  const [profileRole, setProfileRole] = useState("Unknown Role");
  const [totalpurchase, setTotalpurchase] = useState(0);
  const [totalsales, setTotalsales] = useState(0);
  const [totalpurchaseReturn, setTotalPurchaseReturn] = useState(0);
  const [totalsalesReturn, setTotalSalesReturn] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalData, setModalData] = useState<string[]>([]);

  const {
    data: purchase,
    isLoading: isLoadingpurchase,
    refetch: refetchPurchase,
  } = useGetAllPurchase();

  const {
    data: sales,
    isLoading: isLoadingsales,
    refetch: refetchSales,
  } = useGetAllSales();
  const { refetch: refetchItems } = useGetAllItem();
  const { refetch: refetchItemGroup } = useGetAllItemGroup();
  const { refetch: refetchUnits } = useGetAllUnits();
  const { refetch: refetchInventory } = useGetAllInventory();
  const { refetch: refetchConversion } = useGetAllConversionFactor();
  const {
    data: PurchaseReturn,
    isLoading: isLoadingPurchaseReturn,
    refetch: refetchPurchaseReturn,
  } = useGetAllPurchaseReturn();
  const { refetch: refetchLedgers } = useGetAllLedgers();
  const {
    data: SalesReturn,
    isLoading: isLoadingSalesReturn,
    refetch: refetchSalesReturn,
  } = useGetAllSalesReturn();

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      setProfileName(parsedDetails.username || "Guest");
      setProfileRole(parsedDetails.role || "Unknown Role");
    }
  }, []);

  useEffect(() => {
    refetchItems();
    refetchUnits();
    refetchInventory();
    refetchItemGroup();
    refetchPurchase();
    refetchPurchaseReturn();
    refetchSales();
    refetchSalesReturn();
    refetchLedgers();
    refetchConversion();
  }, []);

  useEffect(() => {
    setTotalpurchase(
      Array.isArray(purchase?.Items) ? purchase.Items.length : 0
    );
    setTotalsales(Array.isArray(sales?.Items) ? sales.Items.length : 0);
    setTotalPurchaseReturn(
      Array.isArray(PurchaseReturn?.Items) ? PurchaseReturn.Items.length : 0
    );
    setTotalSalesReturn(
      Array.isArray(SalesReturn?.Items) ? SalesReturn.Items.length : 0
    );
  }, [purchase, sales, PurchaseReturn, SalesReturn]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnlargeClick = (category: string, data: any[]) => {
    setSelectedCategory(category);

    let extractedData: string[] = [];
    if (category === "Purchase") {
      extractedData = data
        .map((item) => item?.id || "Unknown Purchase")
        .filter(Boolean);
    } else if (category === "sales") {
      extractedData = data
        .map((item) => item?.id || "Unknownsales")
        .filter(Boolean);
    } else if (category === "Purchase Return") {
      extractedData = data
        .map((item) => item?.id || "Unknown PurchaseReturn")
        .filter(Boolean);
    } else if (category === "Sales Return") {
      extractedData = data
        .map((item) => item?.id || "Unknown salesReturn")
        .filter(Boolean);
    }

    setModalData(extractedData);
    setIsModalOpen(true);
  };

  const chartData = [
    { name: `${t("Purchase")}`, value: totalpurchase },
    { name: `${t("Sales")}`, value: totalsales },
    { name: `${t("Purchase Return")}`, value: totalpurchaseReturn },
    { name: `${t("Sales Return")}`, value: totalsalesReturn },
  ];
  const lang = localStorage.getItem("language");
  const [showTranslation, setShowTranslation] = useState(false);
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  const handleNepaliTranslate = () => {
    localStorage.setItem("language", "नेपाली");
    i18n.changeLanguage("ne");
    toggleTranslation();
  };
  const handleEnglishTranslate = () => {
    localStorage.setItem("language", "English");
    i18n.changeLanguage("en");
    toggleTranslation();
  };
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen ml-2 mt-2">
      <header className="flex justify-between items-center bg-white p-3 rounded-md shadow">
        <h1 className="text-xl font-bold ml-5 mb-2">{t("Dashboard")}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 h-full cursor-pointer">
            <div
              className="flex items-center gap-2 h-full"
              onClick={() => {
                toggleTranslation();
              }}
            >
              {lang}
              <ButtonElement
                icon={<Globe size={45} className="text-black" />}
                type="button"
                text=""
                className="!bg-white"
              />
            </div>

            {showTranslation && (
              <div className="absolute top-[4.5rem] right-[7rem] transform -translate-x-1/2 -translate-y-2 min-w-[150px] sm:min-w-[170px] w-auto max-w-[320px] bg-white border border-gray-200 rounded-sm shadow-lg z-50">
                <div
                  onClick={handleEnglishTranslate}
                  className="hover:bg-gray-100 cursor-pointer px-2 py-1"
                >
                  English
                </div>
                <div
                  onClick={handleNepaliTranslate}
                  className="hover:bg-gray-100 cursor-pointer px-2 py-1"
                >
                  नेपाली
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center h-full">
            <ButtonElement
              icon={<BellDot size={45} className="text-black" />}
              type="button"
              text=""
              className="!bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <h1 className="font-bold text-lg">{t(`${profileName}`)}</h1>
              <span className="text-gray-500 text-sm">
                {t(`${profileRole}`)}
              </span>
            </div>
            <img
              src={garima}
              className="w-10 h-10 rounded-full"
              alt="User Profile"
            />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 ">
        {[
          {
            icon: moduleicon,
            title: `${t("Purchase")}`,
            count: totalpurchase,
            isLoading: isLoadingpurchase,
            data: purchase?.Items || [],
          },

          {
            icon: roleicon,
            title: `${t("Sales")}`,
            count: totalsales,
            isLoading: isLoadingsales,
            data: sales?.Items || [],
          },
          {
            icon: usericon,
            title: `${t("Purchase Return")}`,
            count: totalpurchaseReturn,
            isLoading: isLoadingPurchaseReturn,
            data: PurchaseReturn?.Items || [],
          },
          {
            icon: organizationicon,
            title: `${t("Sales Return")}`,
            count: totalsalesReturn,
            isLoading: isLoadingSalesReturn,
            data: SalesReturn?.Items || [],
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
            <h2 className="text-lg font-semibold ml-8">{t(`${item.title}`)}</h2>
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
          <h2 className="text-2xl font-bold mb-4">{t("Overview")}</h2>
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
            {t("Recent Activities")}
          </h2>

          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-blue-500 text-lg">📌</span>
              <p className="text-sm text-gray-700">
                {t("New module added")}:
                <b className="text-md text-black"> {t("Dashboard")}</b>
              </p>
            </li>
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-sm text-gray-700">
                {t("User")} <b className="text-md text-black">{t("Admin")}</b>{" "}
                {t("updated permissions")}
              </p>
            </li>
            <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md shadow-sm">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-sm text-red-400">
                {t("Unauthorized login attempt")}
              </p>
            </li>
          </ul>

          <div className="mt-4 text-center">
            <button className="px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-md hover:bg-teal-500 transition">
              {t("View More")}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">{t("Transaction Details")}</h2>

        <ul className="mt-4 space-y-3">
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-lg">💰</span>
              <p className="text-sm text-gray-700">
                {t("Payment")} {t("Received")} -{" "}
                <span className="text-green-400">$100</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-lg">📉</span>
              <p className="text-sm text-gray-700">
                {t("Payment")} {t("Sent")}-{" "}
                <span className="text-red-400">$75</span>{" "}
              </p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-lg">🔄</span>
              <p className="text-sm text-gray-700">
                {t("Refund Processed")} -{" "}
                <span className="text-blue-400">$50</span>
              </p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </li>
        </ul>

        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-md hover:bg-teal-600 transition">
            {t("View More")}
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

export default Dashboard;
