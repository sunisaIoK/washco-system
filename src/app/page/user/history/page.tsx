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
}

const History = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]); // เก็บข้อมูลคำสั่งจอง
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // ฟังก์ชันดึงข้อมูลคำสั่งจอง

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (!session?.user?.id) return; // ยังไม่ได้ล็อกอิน ไม่ต้อง fetch
                setLoading(true);
                const response = await fetch(`/api/data/order?customerId=${session.user.id}`, {
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


    // const toggleStatus = async (id: string, isActive: boolean) => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch(`/api/data/order`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ id, isActive: !isActive }),
    //         });

    //         if (!response.ok) throw new Error('Failed to update status');

    //         // รีโหลดข้อมูลหลังจากอัปเดตสถานะสำเร็จ
    //         const updatedOrders = orders.map((order) =>
    //             order.id === id ? { ...order, isActive: !isActive } : order
    //         );
    //         setOrders(updatedOrders);

    //         alert('เปลี่ยนสถานะเรียบร้อย');
    //     } catch (err) {
    //         console.error('Error toggling status:', err);
    //         alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const openViewModal = (order: Order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };
    const closeModal = () => {
        setIsViewModalOpen(false);
    };

    return (
        <main className="p-7">
            <div className="mb-4 flex items-center">
                <h1 className="text-2xl font-bold mb-4">รายการคำสั่งจอง</h1>
            </div>
            {loading && <p className="text-center">กําลังโหลดข้อมูล...</p>}
            {/* แสดงข้อมูลคำสั่งจอง */}
            {orders.length > 0 ? (
                <table className="border-collapse text-center border border-gray-400 w-full mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">ชื่อ</th>
                            <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                            <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                            <th className="border border-gray-300 p-2">วันที่จอง</th>
                            <th className="border border-gray-300 p-2">การดำเนินงาน</th>
                            <th className="border border-gray-300 p-2">ดูข้อมูล</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{order.name ? order.name : "ไม่มีชื่อ"}</td>
                                <td className="border border-gray-300 p-2">{order.services ? order.services.nameService : "ไม่มีบริการ"}</td>
                                <td className="border border-gray-300 p-2">{order.delivery ? order.delivery.Delivery : "ไม่มีวิธีการรับ-ส่งคืน"}</td>
                                <td className="border border-gray-300 p-2">{order.createdAt ? order.createdAt : "ไม่มีวิธีการรับ-ส่งคืน"}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => (order.id, order.isActive)}
                                        className={`px-4 py-1 rounded ${order.isActive ? 'bg-green-300 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {order.isActive ? 'ดำเนินการ' : 'เสร็จสิ้น'}
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
            ) : (
                <p className="text-center text-gray-500">ยังไม่มีคำสั่งจอง</p>
            )}
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
                                        <p className="bg-gray-100 px-3 py-2 rounded mb-1">สถานะชำระ</p>
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
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.pickupDate}</p>
                                        <p className="font-semibold  mb-1 mt-1">วันที่คืนผ้า :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.deliveryDate}</p>
                                        <p className="font-semibold  mb-1 mt-1">วันที่จอง :</p>
                                        <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.createdAt}</p>
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