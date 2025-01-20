'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode"; // สำหรับการตรวจสอบสิทธิ์ผู้ใช้

interface Order {
  _id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  // สมมติว่ามีฟิลด์บริการมาเป็น Object ด้วย
  services: { nameService: string; price: number } | null;
}

const ordernow = () => {
  const [orders, setOrders] = useState<Order[]>([]); // เก็บข้อมูลคำสั่งจอง
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง JWT Token จาก LocalStorage
    if (!token) {
      router.replace("/"); // Redirect ไปหน้าแรกถ้าไม่มี Token
      return;
    }
    try {
      const decoded: any = jwtDecode(token); // ถอดรหัส JWT Token
      if (decoded?.role !== "admin") {
        router.replace("/"); // Redirect ถ้า Role ไม่ใช่ Admin
        return;
      }
      fetchAllData(); // ดึงข้อมูลคำสั่งจอง
      setLoading(false); // ปิดสถานะการโหลด
    } catch (err) {
      console.error("Error decoding JWT Token:", err);
      router.replace("/"); // Redirect ในกรณีที่มีปัญหา
    }
  }, [router]);

  // ฟังก์ชันดึงข้อมูลคำสั่งจอง
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/order', { method: 'GET' });
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลได้');
      }
      const data = await response.json();
      setOrders(data.Orders || []); // เซ็ตข้อมูลคำสั่งจอง
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>; // แสดงข้อความรอโหลด

  return (
    <main className="p-7">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">คำสั่งจองทั้งหมด</h1>
      </div>

      {/* แสดงข้อมูลคำสั่งจอง */}
      {orders.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ชื่อผู้ติดต่อ</th>
              <th className="border border-gray-300 p-2">อีเมล</th>
              <th className="border border-gray-300 p-2">บริการที่เลือก</th>
              <th className="border border-gray-300 p-2">วันที่</th>
              <th className="border border-gray-300 p-2">เวลา</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{order.name}</td>
                <td className="border border-gray-300 p-2">{order.email}</td>
                <td className="border border-gray-300 p-2">{order.services ? order.services.nameService : "ไม่มีบริการ"}</td>
                {/* <td className="border border-gray-300 p-2">{order.pickupDate || "ยังไม่ได้กำหนด"}</td>
                <td className="border border-gray-300 p-2">{order.deliveryDate || "ยังไม่ได้กำหนด"}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">ยังไม่มีคำสั่งจอง</p>
      )}
    </main>
  );
};

export default ordernow;