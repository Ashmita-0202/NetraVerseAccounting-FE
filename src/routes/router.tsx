import AdminLayout from "@/Layout/AdminLayout";
import AllDashboard from "@/modules/end-user/dashboard/pages/All";
import RoleRoutes from "@/modules/admin/rolesdepartment/routes";
import AllModules from "@/modules/admin/rolesmodules/modules/pages/All";
import { AllUsers } from "@/modules/admin/userdepartment/pages/All";
import Login from "@/modules/auth/login/pages/login";
import ErrorPage from "@/pages/ErrorPages";
import { createBrowserRouter, Outlet } from "react-router-dom";
import UserRoutes from "@/modules/admin/userdepartment/routes";
import SubmodulesRoutes from "@/modules/admin/rolesmodules/subModules/routes/indes";
import ModuleRoutes from "@/modules/admin/rolesmodules/modules/routes";
import InitializationRoutes from "@/modules/developerUser/routes";

import MenuRoutes from "@/modules/admin/rolesmodules/menu/routes";
import EndUserLayout from "@/modules/end-user/layouts/EndUserLayout";
import InstitutionRoutes from "@/modules/admin/Institution/routes";
import JournalRoutes from "@/modules/end-user/account/Journal/routes";
import CompanyRoutes from "@/modules/admin/Company/routes";
import LedgerGroupRoute from "@/modules/end-user/account/ledgerGroup/routes";
import LedgerRoute from "@/modules/end-user/account/ledger/routes";
import UnitsRoute from "@/modules/end-user/Inventory/Units/routes";
import ConversionFactorRoute from "@/modules/end-user/Inventory/ConversionFactor/routes";
import RolePermissionRoute from "@/modules/admin/RolePermission/Routes";
import ItemGroupRoute from "@/modules/end-user/Inventory/ItemGroup/routes";
import ItemRoute from "@/modules/end-user/Inventory/Item/routes";
import DashboardRoutes from "@/modules/end-user/dashboard/routes";
import PurchaseRoute from "@/modules/end-user/PurchaseComp/purchase/routes";
import SalesRoute from "@/modules/end-user/SalesComp/sales/routes";
import SettingsRoute from "@/modules/admin/Settings/routes";
import ReportRoute from "@/modules/end-user/Report/Account Book/routes";
import LedgerBalanceRoute from "@/modules/end-user/Report/BalanceReport/routes";
import InventoryRoute from "@/modules/end-user/Inventory/InventoryLedger/routes";
import SalesReturnRoute from "@/modules/end-user/SalesComp/salesReturn/routes";
import PurchaseReturnRoute from "@/modules/end-user/PurchaseComp/purchaseReturn/routes";
import TrialBalanceRoute from "@/modules/end-user/Report/TrialBalance/routes/TrialBalanceRoutes";
import VatDetailsRoute from "@/modules/end-user/Report/VatDetails/routes/VatDetailsRoutes";
import BalanceSheetRoute from "@/modules/end-user/Report/BalanceSheet/routes/BalanceSheetRoutes";
import IncomeRoute from "@/modules/end-user/Transaction/Income/routes";
import ExpensesRoute from "@/modules/end-user/Transaction/Expenses/routes";
import PartiesRoute from "@/modules/end-user/account/parties/routes";
import PaymentRoute from "@/modules/end-user/Payments/PaymentMethod/routes";
import ReceiptRoutes from "@/modules/end-user/Payments/Receipt/routes";
import PaymentModeRoutes from "@/modules/end-user/Payments/PaymentMode/routes";
import SalesReportRoute from "@/modules/end-user/Report/SalesReport/routes";
import PurchaseReportRoute from "@/modules/end-user/Report/PurchaseReport/routes";
import TradingReportRoute from "@/modules/end-user/Report/TradingReport/routes/TradingReportRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/allmodules",
    element: <AllModules />,
  },
  {
    path: "/allusers",
    element: <AllUsers />,
  },

  {
    path: "admin",
    // loader: RouteValidation,
    element: <AdminLayout />,
    errorElement: "error found",
    children: [
      {
        path: "",
        element: <AllDashboard />,
      },
      {
        path: "user",
        element: <Outlet />,
        children: UserRoutes,
      },
      {
        path: "role",
        element: <Outlet />,
        children: RoleRoutes,
      },
      {
        path: "role-permission",
        element: <Outlet />,
        children: RolePermissionRoute,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "modules",
        element: <Outlet />,
        children: ModuleRoutes,
      },

      {
        path: "submodules",
        element: <Outlet />,
        children: SubmodulesRoutes,
      },
      {
        path: "menus",
        element: <Outlet />,
        children: MenuRoutes,
      },
      {
        path: "institutions",
        element: <Outlet />,
        children: InstitutionRoutes,
      },
      {
        path: "company",
        element: <Outlet />,
        children: CompanyRoutes,
      },
    ],
  },
  {
    path: "developer",
    // loader: RouteValidation,
    element: <AdminLayout />,
    errorElement: "error found",
    children: [
      {
        path: "initialize",
        element: <Outlet />,
        children: InitializationRoutes,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "end-user",
    // loader: RouteValidation,
    element: <EndUserLayout />,
    errorElement: "error found",
    children: [
      {
        path: "",
        element: <AllDashboard />,
        children: DashboardRoutes,
      },
      {
        path: "purchase",
        element: <Outlet />,
        children: PurchaseRoute,
      },
      {
        path: "journal",
        element: <Outlet />,
        children: JournalRoutes,
      },
      {
        path: "ledger",
        element: <Outlet />,
        children: LedgerRoute,
      },
      {
        path: "parties",
        element: <Outlet />,
        children: PartiesRoute,
      },
      {
        path: "ledgerGroup",
        element: <Outlet />,
        children: LedgerGroupRoute,
      },
      {
        path: "unit",
        element: <Outlet />,
        children: UnitsRoute,
      },
      {
        path: "payment",
        element: <Outlet />,
        children: PaymentRoute,
      },
      {
        path: "conversionFactor",
        element: <Outlet />,
        children: ConversionFactorRoute,
      },
      {
        path: "itemGroup",
        element: <Outlet />,
        children: ItemGroupRoute,
      },
      {
        path: "trialBalance",
        element: <Outlet />,
        children: TrialBalanceRoute,
      },
      {
        path: "vatDetails",
        element: <Outlet />,
        children: VatDetailsRoute,
      },
      {
        path: "tradingReport",
        element: <Outlet />,
        children: TradingReportRoute,
      },
      {
        path: "balanceSheet",
        element: <Outlet />,
        children: BalanceSheetRoute,
      },
      {
        path: "income",
        element: <Outlet />,
        children: IncomeRoute,
      },
      {
        path: "expense",
        element: <Outlet />,
        children: ExpensesRoute,
      },
      {
        path: "item",
        element: <Outlet />,
        children: ItemRoute,
      },
      {
        path: "initialize",
        element: <Outlet />,
        children: InitializationRoutes,
      },

      {
        path: "role",
        element: <Outlet />,
        children: RoleRoutes,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "user",
        element: <Outlet />,
        children: UserRoutes,
      },
      {
        path: "role-permission",
        element: <Outlet />,
        children: RolePermissionRoute,
      },
      {
        path: "company",
        element: <Outlet />,
        children: CompanyRoutes,
      },
      {
        path: "settings",
        element: <Outlet />,
        children: SettingsRoute,
      },
      {
        path: "sales",
        element: <Outlet />,
        children: SalesRoute,
      },
      {
        path: "receipt",
        element: <Outlet />,
        children: ReceiptRoutes,
      },
      {
        path: "payment",
        element: <Outlet />,
        children: PaymentModeRoutes,
      },
      {
        path: "accountBook",
        element: <Outlet />,
        children: ReportRoute,
      },
      {
        path: "balanceReport",
        element: <Outlet />,
        children: LedgerBalanceRoute,
      },
      {
        path: "salesReport",
        element: <Outlet />,
        children: SalesReportRoute,
      },
      {
        path: "purchaseReport",
        element: <Outlet />,
        children: PurchaseReportRoute,
      },
      {
        path: "inventory",
        element: <Outlet />,
        children: InventoryRoute,
      },
      {
        path: "salesReturn",
        element: <Outlet />,
        children: SalesReturnRoute,
      },
      {
        path: "purchaseReturn",
        element: <Outlet />,
        children: PurchaseReturnRoute,
      },
    ],
  },
]);
