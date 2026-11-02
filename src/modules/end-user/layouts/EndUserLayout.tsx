import useRoleWiseSidebarMenu from "@/modules/admin/rolesmodules/hooks/useRoleWiseSidebarMenu";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserSideBar from "./UserSideBar";
import { useHotkeys } from "react-hotkeys-hook";
const EndUserLayout = () => {
  const [isOpen] = useState(true);
  const [, setShowScrollButton] = useState(false);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );
  useHotkeys(
    "alt+f8",
    () => {
      navigate("/end-user/expense/AddExpense");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f7",
    () => {
      navigate("/end-user/income/AddIncome");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f6",
    () => {
      navigate("/end-user/payment/AddPaymentMode");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f5",
    () => {
      navigate("/end-user/receipt/AddReceipt");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f4",
    () => {
      navigate("/end-user/journal/AddJournal");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f3",
    () => {
      navigate("/end-user/sales/addSales");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "alt+f2",
    () => {
      navigate("/end-user/purchase/AddPurchase");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  useHotkeys(
    "ctrl+shift+s",
    () => {
      navigate("/end-user/settings/settings");
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    },
    { preventDefault: true }
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { isLoading, data: sideBarMenu } = useRoleWiseSidebarMenu(userId);

  useEffect(() => {
    if (
      sideBarMenu &&
      ((Array.isArray(sideBarMenu) && sideBarMenu.length === 0) ||
        (typeof sideBarMenu === "object" &&
          Object.keys(sideBarMenu).length === 0))
    ) {
      navigate("/");
    }
  }, [sideBarMenu, navigate]);

  if (!userId) {
    return <p>Fetching user data...</p>;
  }

  return (
    <div className="flex h-screen ">
      <div
        className={`flex-1 overflow-auto bg-gray-100 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-16" : "ml-16"
        } md:ml-60 lg:ml-60 sm:ml-16 bg-[rgb(244, 246, 249)]`}
      >
        <main className="bg-[#f4f6f9] p-1 h-full overflow-x-auto">
          <Outlet />
        </main>
      </div>
      {isLoading ? (
        <p>Loading sidebar...</p>
      ) : (
        <UserSideBar
          isOpen={isOpen}
          sideBarItems={Array.isArray(sideBarMenu) ? sideBarMenu : []}
        />
      )}
    </div>
  );
};

export default EndUserLayout;
