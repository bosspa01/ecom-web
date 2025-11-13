import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Home } from "lucide-react";
import { TableOfContents } from "lucide-react";
import { ChartBarStacked } from "lucide-react";
import { ShoppingBasket, LogOut, Ticket } from "lucide-react";
import { Package } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';
import { Logs } from 'lucide-react';
import useEcomStore from "../../store/ecom-store";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const actionLogout = useEcomStore((state) => state.actionLogout);

  const handleLogout = () => {
    actionLogout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 w-64 text-gray-100 flex flex-col h-screen">
      <div className="h-24 bg-gray-900 flex items-center justify-center text-2xl font-bold">
        Admin Panel
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <LayoutDashboard className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to={"manage"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <TableOfContents className="mr-2" />
          Manage
        </NavLink>

        <NavLink
          to={"category"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ChartBarStacked className="mr-2" />
          Category
        </NavLink>

        <NavLink
          to={"product"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Package className="mr-2" />
          Product
        </NavLink>

        <NavLink
          to={"orders"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ShoppingBasket className="mr-2" />
          Orders
        </NavLink>

        <NavLink
          to={"tickets"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <MessageSquareText className="mr-2" />
          Support Tickets
        </NavLink>

        <NavLink
          to={"coupon"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Ticket className="mr-2" />
          Coupons
        </NavLink>
        {/* Superadmin only logs link: simple role check via local user store */}
        {useEcomStore.getState().user?.role === 'superadmin' && (
          <NavLink
            to={"logs"}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded-md"
                : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
            }
          >
            <Logs className="mr-2" />
            Activity Logs
          </NavLink>
        )}
      </nav>

      <div className="p-4 space-y-2">
        <Link
          to={"/"}
          className="w-full text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
        >
          <Home className="mr-2" />
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
        >
          <LogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
