import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import useTranslation from "../hooks/useTranslation";
import { Search, ShoppingCart, History, User, LogOut, ChevronDown, LayoutDashboard, MessageSquare, Menu, X } from "lucide-react";
import SearchModal from "./SearchModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { toast } from "react-toastify";

const MainNav = () => {
  const t = useTranslation();
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const actionLogout = useEcomStore((state) => state.actionLogout);
  const hasNewOrder = useEcomStore((state) => state.hasNewOrder);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isUserDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    actionLogout();
    toast.success("Logged out successfully");
    navigate("/");
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo and Navigation */}
            <div className="flex items-center gap-6">
              <Link to={"/"} className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
                LOGO
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to={"/"} className="hover:text-green-400 transition-colors">{t.home}</Link>
                <Link to={"/shop"} className="hover:text-green-400 transition-colors">{t.shop}</Link>
              </div>
            </div>

            {/* Right Side - Search, Cart, History, User Dropdown, Login/Register */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title={t.search}
              >
                <Search size={20} />
              </button>
              
              <Link 
                to={"/cart"} 
                className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title={t.shopping_cart}
              >
                <ShoppingCart size={20} />
                {carts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {carts.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Desktop: Login/Register on right when not logged in */}
              {!user && (
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    to={"/login"} 
                    className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {t.login}
                  </Link>
                  <Link 
                    to={"/register"} 
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    {t.register}
                  </Link>
                </div>
              )}

              {/* Desktop: Show History + User Dropdown when logged in */}
              {user && (
                <div className="hidden md:flex items-center gap-4">
                  {/* History Button */}
                  <Link
                    to="/user/history"
                    className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title={t.history}
                  >
                    <History size={20} />
                    <span className="hidden sm:inline">{t.history}</span>
                    {hasNewOrder && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center animate-pulse"></span>
                    )}
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span className="hidden sm:inline max-w-[150px] truncate">
                        {user.email || user.name || "User"}
                      </span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm text-gray-400">Signed in as</p>
                          <p className="text-white font-medium truncate">
                            {user.email || user.name || "User"}
                          </p>
                        </div>
                        {(user.role === "admin" || user.role === "superadmin") && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors"
                          >
                            <LayoutDashboard size={18} />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        {user.role !== 'admin' && user.role !== 'superadmin' && (
                          <Link
                            to="/user/support"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors"
                          >
                            <MessageSquare size={18} />
                            <span>{t.support}</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-gray-700 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>{t.logout}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div ref={mobileMenuRef} className="md:hidden bg-gray-800 border-t border-gray-700 py-4 px-4 space-y-3">
              {/* Mobile Navigation Links */}
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block py-2 hover:text-green-400 transition-colors"
              >
                {t.home}
              </Link>
              <Link 
                to="/shop" 
                onClick={closeMobileMenu}
                className="block py-2 hover:text-green-400 transition-colors"
              >
                {t.shop}
              </Link>

              <hr className="border-gray-700 my-2" />

              {/* Mobile User Actions */}
              {!user ? (
                <>
                  <Link 
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block py-2 hover:text-green-400 transition-colors"
                  >
                    {t.login}
                  </Link>
                  <Link 
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block py-2 text-green-400 font-semibold hover:text-green-300 transition-colors"
                  >
                    {t.register}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/user/history"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 py-2 hover:text-green-400 transition-colors"
                  >
                    <History size={18} />
                    <span>{t.history}</span>
                    {hasNewOrder && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-3 h-3 animate-pulse"></span>
                    )}
                  </Link>
                  <Link
                    to="/user"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 py-2 hover:text-green-400 transition-colors"
                  >
                    <User size={18} />
                    <span className="truncate">{user.email || user.name || "User"}</span>
                  </Link>
                  {(user.role === "admin" || user.role === "superadmin") && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 py-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  {user.role !== 'admin' && user.role !== 'superadmin' && (
                    <Link
                      to="/user/support"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 py-2 hover:text-green-400 transition-colors"
                    >
                      <MessageSquare size={18} />
                      <span>{t.support}</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left flex items-center gap-2 py-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>{t.logout}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default MainNav;
