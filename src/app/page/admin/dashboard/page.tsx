'use client';

import PopularService from "@/components/PopularService";
import SaleMonth from "@/components/SaleMonth";
import TotalSales from "@/components/TotalSale";
import React from "react";

const AdminPage = () => {
  return (
    <main className="max-w-8xl mx-auto flex flex-col justify-center mb-9">
      <div className="flex flex-col mb-3 items-center md:flex-row justify-between">
        <div className="flex flex-col ml-20 items-center p-2 max-w-5xl rounded-lg" style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <TotalSales />
        </div>
        <div className="flex flex-col mr-28 items-center p-2 rounded-lg" style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <SaleMonth />
        </div>
      </div>
      <div className="flex flex-col justify-center max-w-8xl items-center mt-3 ">
        <div className="flex flex-col items-center p-2 w-10/12 mr-9 rounded-lg" style={{ boxShadow: '1px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
          <PopularService /> 
        </div>
      </div>
    </main>
  );
};

export default AdminPage;