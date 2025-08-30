import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Toaster } from "../ui/toaster";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#151619]">
      <Sidebar />
      <main className="ml-[200px] min-h-screen rounded-tl-3xl bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
