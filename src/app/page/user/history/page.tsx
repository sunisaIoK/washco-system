'use client';

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

//รูปแบบข้อมูล
interface Order {
    id: string;
    name: string;
    phone: number;
    totalPrice: number;
    hotelName: string;
    roomNumber: string;
    additionalDetails: string;
    pickupDate: string;
    deliveryDate: string;
    createdAt: string;
    // สมมติว่ามีฟิลด์บริการมาเป็น Object ด้วย
    services: { nameService: string; price: number; description: string } | null;
    details: { fieldValue: string; price: number }[]; // หรือ Array
    delivery: { Delivery: number; descriptionDelivery: string; description: string } | null;
    isActive: boolean;
    paymentStatus: 'pending' | 'paid'; // เพิ่มส่วนนี้
}

const History = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]); // เก็บข้อมูลคำสั่งจอง
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const itemsPerPage = 5; // จำนวนรายการต่อหน้า
    const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันสำหรับตาราง "กำลังซักรีด"

    // ฟังก์ชันดึงข้อมูลคำสั่งจอง

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const customerId = session?.user?.id || 'default-customer-id';
                if (!session?.user?.id) return; // ยังไม่ได้ล็อกอิน ไม่ต้อง fetch
                setLoading(true);
                const response = await fetch(`/api/data/order?customerId=${customerId}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลได้');
                }
                const data = await response.json();
                setOrders(data.Orders || []); // เซ็ตข้อมูลคำสั่งจอง
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึงรายละเอียด:', error);
            } finally {
                setLoading(false);
            }
        };

        // ดึงข้อมูลเมื่อหน้าโหลด
        fetchAllData();

        // ตรวจสอบสถานะอัปเดต
        const statusUpdated = localStorage.getItem('statusUpdated');
        if (statusUpdated === 'true') {
            fetchAllData(); // ดึงข้อมูลใหม่
            localStorage.removeItem('statusUpdated'); // ลบสถานะเพื่อป้องกัน re-fetch
        }
    }, [session]);

    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(sortedOrders);

    const formatToThaiTime = (dateString: string) => {
        if (!dateString || isNaN(Date.parse(dateString))) {
            return 'Invalid Date'; // คืนข้อความแสดงข้อผิดพลาดแทน
        }

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Intl.DateTimeFormat('th-TH', options).format(new Date(dateString));
    };

    const openViewModal = (order: Order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };
    const closeModal = () => {
        setIsViewModalOpen(false);
    };
    const activeServices = orders.filter(() => orders);
    // ฟังก์ชันคำนวณหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    // เปลี่ยนหน้า
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="p-7 ">
            <h1 className="text-2xl font-bold mb-4 text-center">รายการคำสั่งจอง</h1>
            {loading ? (
                // Skeleton for loading
                <div className="flex justify-center space-y-4 animate-pulse items-center">
                    <div className=' border border-gray-200 p-4 shadow-sm rounded-md'>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">ชื่อผู้จอง</th>
                                    <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                                    <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                                    <th className="border border-gray-300 p-2">วันที่จอง</th>
                                    <th className="border border-gray-300 p-2">สถานะการชำระเงิน</th>
                                    <th className="border border-gray-300 p-2">การดำเนินงาน</th>
                                    <th className="border border-gray-300 p-2">ดูข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center animate-pulse">
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">
                                        <div
                                            className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                        >
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 md:flex-row">
                                        <div
                                            className="flex items-center justify-center space-x-6 "
                                        >
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6 ml-32 mr-32">
                    {currentOrders.length > 0 && (
                        <span className="text-blue-800 text-sm" >
                            พบประวัติการจองทั้งหมด: {activeServices.length} รายการ
                        </span>
                    )}
                    <table className="border-collapse text-center border border-gray-400 w-full mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">ชื่อผู้จอง</th>
                                <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                                <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                                <th className="border border-gray-300 p-2">วันที่จอง</th>
                                <th className="border border-gray-300 p-2">สถานะการชำระเงิน</th>
                                <th className="border border-gray-300 p-2">การดำเนินงาน</th>
                                <th className="border border-gray-300 p-2">ดูข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-100 even:bg-gray-50 border border-gray-300">
                                    <td className="border border-gray-300 p-2">{order.name ? order.name : "ไม่มีชื่อ"}</td>
                                    <td className="border border-gray-300 p-2">{order.services ? order.services.nameService : "ไม่มีบริการ"}</td>
                                    <td className="border border-gray-300 p-2">{order.delivery ? order.delivery.Delivery : "ไม่มีวิธีการรับ-ส่งคืน"}</td>
                                    <td className="border border-gray-300 p-2">{formatToThaiTime(order.createdAt)}</td>
                                    <td className="border border-gray-300 p-2">
                                        <span
                                            className={`px-2 py-1 rounded 
                                                ${order.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => (order.id, order.isActive)}
                                            className={`px-4 py-1 rounded ${order.isActive ? 'text-green-800' : 'text-red-800'}`}
                                        >
                                            {order.isActive ? 'กำลังซักรีด' : 'จัดส่งแล้ว'}
                                        </button>
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <button
                                            onClick={() => openViewModal(order)}
                                            className="bg-blue-200 text-blue-500 px-3 py-1 rounded hover:bg-blue-300 hover:text-blue-600"
                                        >
                                            ดูข้อมูล
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-blue-500 border-blue-500"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )
            }
            {isViewModalOpen && selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded w-full max-w-7xl min-h-sm">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex flex-col ">
                                <h2 className="text-xl font-bold mb-4">รายละเอียดคำสั่งซื้อ</h2>
                            </div>
                            <div className="flex flex-col ">
                                <button
                                    onClick={closeModal}
                                    className=" bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row p-2 ">
                            <div className="grid grid-cols-1 text-center gap-4 w-10/12">
                                <div className="">
                                    <p className="font-semibold mb-1">ชื่อ :</p>
                                    <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.name}</p>
                                    <p className="font-semibold  mb-1 mt-1">เบอร์โทรศัพท์ :</p>
                                    <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.phone}</p>
                                    <p className="font-semibold mb-1 mt-1">บริการ :</p>
                                    <div className="grid grid-cols-2 gap-4 w-full mb-2">
                                        <p className="bg-gray-100 px-3 py-2 mb-1 rounded">{selectedOrder.services?.nameService}</p>
                                        <p className="bg-gray-100 px-3 py-2 mb-1 rounded">{selectedOrder.services?.price}</p>
                                    </div>
                                    <div className="">
                                        <p className="font-semibold mb-1 ">สถานะชำระ :</p>
                                        <p className={`px-3 py-2 rounded mb-1 ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {selectedOrder.paymentStatus === 'paid' ? 'ชำระเงินแล้ว' : 'ยังไม่ได้ชำระเงิน'}
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div className="grid grid-cols-1 text-center gap-4 w-7/12 ml-2 mr-2">
                                <div className="">
                                    <p className="font-semibold  mb-1 mt-1">รายการ :</p>
                                    {selectedOrder && selectedOrder.details?.map((detail, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 w-full mb-2">
                                            <p className="bg-gray-100 px-3 py-2 rounded">{detail.fieldValue}</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded">{detail.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 text-center gap-4 w-4/12">
                                <div className="">
                                    {/* <p className="font-semibold">ข้อมูลที่อยู่:</p> */}
                                    <div className="">
                                        <p className="font-semibold mb-1">ชื่อโรงแรม :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.hotelName}</p>
                                        <p className="font-semibold  mb-1 mt-1">หมายเลขห้อง :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.roomNumber}</p>
                                        <p className="font-semibold  mb-1 mt-1">รายละเอียดเพิ่มเติม :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.additionalDetails}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 text-center gap-4 w-6/12 ml-2">
                                <div className="">
                                    {/* <p className="font-semibold">วัน-เวลาการรับ-จัดส่ง:</p> */}
                                    <div>
                                        <p className="font-semibold  mb-1 ">วันที่รับผ้า  :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">
                                            {formatToThaiTime(selectedOrder.pickupDate)}
                                        </p>
                                        <p className="font-semibold  mb-1 mt-1">วันที่คืนผ้า :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">
                                            {formatToThaiTime(selectedOrder.deliveryDate)}
                                        </p>
                                        <p className="font-semibold  mb-1 mt-1">วันที่จอง :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">
                                            {formatToThaiTime(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default History;