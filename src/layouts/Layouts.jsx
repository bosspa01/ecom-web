import React from "react";
import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";

const Layouts = () => {
  return (
    <div>
      <MainNav />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layouts;
