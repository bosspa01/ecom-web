import React from "react";
import useEcomStore from "../../store/ecom-store";

const HeaderAdmin = () => {
  const user = useEcomStore((state) => state.user);

  return (
    <header className="bg-gray-900 h-16 flex items-center justify-between px-6">
      <div className="text-white"></div>
      {user && (
        <div className="text-white flex items-center gap-2">
          <span className="text-gray-400">Logged in as:</span>
          <span>{user.email}</span>
        </div>
      )}
    </header>
  );
};

export default HeaderAdmin;
