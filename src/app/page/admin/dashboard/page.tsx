'use client';

import PopularService from "@/components/PopularService";
import SaleMonth from "@/components/SaleMonth";
import TotalSales from "@/components/TotalSale";
import React from "react";

const AdminPage = () => {
  return (
    <main className="max-w-8xl mx-auto flex flex-col justify-center items-center mb-9">
      <div className="flex flex-col mb-3 items-center md:flex-row ">
        <div className="flex flex-col bg-white items-center mr-1 p-2 max-w-5xl rounded-lg"
          style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <TotalSales />
        </div>
      </div>
      <div className="flex flex-col mb-3 items-center md:flex-row ">
        <div className="flex flex-col bg-white items-center mr-1 p-2 max-w-5xl rounded-lg"
          style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <SaleMonth />
        </div>
      </div>
      <div className="flex flex-col mb-3 items-center md:flex-row ">
        <div className="flex flex-col bg-white items-center mr-1 p-2 max-w-5xl rounded-lg"
          style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <PopularService />
        </div>
      </div>
    </main>
  );
};

export default AdminPage;