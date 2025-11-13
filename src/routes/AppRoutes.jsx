import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import History from "../pages/user/History";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layouts from "../layouts/Layouts";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Category from "../pages/admin/Category";
import Product from "../pages/admin/Product";
import Manage from "../pages/admin/Manage";
import LayoutUser from "../layouts/LayoutUser";
import HomeUser from "../pages/user/HomeUser";
import ProtectRouteUser from "./ProtectRouteUser";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import EditProduct from "../pages/admin/EditProduct";
import Playment from "../pages/user/Playment";
import ManageOders from "../pages/admin/ManageOders";
import AdminTickets from "../components/admin/AdminTickets";
import UserTickets from "../components/ticket/UserTickets";
import Coupon from "../pages/admin/Coupon";
import ProtectRouteSuperAdmin from "./ProtectRouteSuperAdmin";
import AdminLogs from "../pages/admin/AdminLogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "category", element: <Category /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <EditProduct /> },
      { path: "manage", element: <Manage /> },
      { path: "orders", element: <ManageOders /> },
      { path: "tickets", element: <AdminTickets /> },
      { path: "coupon", element: <Coupon /> },
  { path: "logs", element: <ProtectRouteSuperAdmin element={<AdminLogs />} /> },
    ],
  },
  {
    path: "/user",
    // element: <LayoutUser />,
    element: <ProtectRouteUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <HomeUser /> },
      { path: "payment", element: <Playment /> },
      { path: "history", element: <History /> },
      { path: "support", element: <UserTickets /> },
    ],
  },
]);

export const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
