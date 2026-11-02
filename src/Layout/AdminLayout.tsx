import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SuperAdminSidebar from "@/tempdata/SuperAdminNavItems.json";

const AdminLayout = () => {
  const [isOpen] = useState(true);
  const [, setShowScrollButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar sideBarItems={SuperAdminSidebar} isOpen={true} />

      <div
        className={`flex-1 overflow-auto bg-gray-100 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-16" : "ml-16"
        } md:ml-60 lg:ml-60 sm:ml-16 bg-[rgb(244, 246, 249)]`}
      >
        <main className="bg-[#f4f6f9] p-1 h-full overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
