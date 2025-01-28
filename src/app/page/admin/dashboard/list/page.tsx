'use client';

import React, { useEffect, useState } from 'react';

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
    services: { nameService: string; price: number; description: string; hour: number } | null;
    details: { fieldValue: string; price: number }[]; // หรือ Array
    delivery: { Delivery: number; descriptionDelivery: string; description: string } | null;
    isActive: boolean;
}

const List = () => {
    const [orders, setOrders] = useState<Order[]>([]); // เก็บข้อมูลคำสั่งจอง
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [currentPageActive, setCurrentPageActive] = useState(1); // หน้าปัจจุบันสำหรับตาราง "กำลังซักรีด"
    const [currentPageInactive, setCurrentPageInactive] = useState(1); // หน้าปัจจุบันสำหรับตาราง "จัดส่งแล้ว"
    const itemsPerPage = 5; // จำนวนรายการต่อหน้า

    // ฟังก์ชันดึงข้อมูลคำสั่งจอง
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data/order', { method: 'GET' });
            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลได้');
            }
            const data = await response.json();
            console.log('API Response:', data); // เพิ่ม log เพื่อตรวจสอบข้อมูล
            setOrders(data.Orders || []); // ตรวจสอบว่า `data.Orders` มีข้อมูลหรือไม่
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงรายละเอียด:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllData(); // เรียกใช้ฟังก์ชันที่นี่
    }, []);

    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            setLoading(true);
            const response = await fetch('/api/data/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !isActive }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            localStorage.setItem('statusUpdated', 'true');
            await fetchAllData(); // Reload data after updating status
            alert('เปลี่ยนสถานะเรียบร้อย');
        } catch (err) {
            console.error('Error toggling status:', err);
            alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
        } finally {
            setLoading(false);
        }
    };

    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(sortedOrders);

    const formatToThaiTime = (dateString: string) => {
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

    // const formatTime = (seconds: number, nanoseconds: number) => {
    //     const min = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
    //     const date = new Date(min);
    //     const options: Intl.DateTimeFormatOptions = {
    //         timeZone: 'Asia/Bangkok',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit'
    //     }
    //     return new Intl.DateTimeFormat('th-TH', options).format(date);
    // }

    const openViewModal = (order: Order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };
    const closeModal = () => {
        setIsViewModalOpen(false);
    };
    const activeServices = orders.filter(() => orders);
    // แยกข้อมูลตามสถานะ
    const activeOrders = orders.filter((order) => order.isActive); // กำลังซักรีด
    const inactiveOrders = orders.filter((order) => !order.isActive); // จัดส่งแล้ว
    // Pagination Logic
    // const paginate = (pageNumber: number, setPage: React.Dispatch<React.SetStateAction<number>>) =>
    //     setPage(pageNumber);
    const renderTable = (
        orders: Order[],
        title: string,
        currentPage: number,
        setPage: React.Dispatch<React.SetStateAction<number>>
    ) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(orders.length / itemsPerPage);

        return (
            <>
                <h2 className="text-lg font-semibold mt-6">{title}</h2>
                <main className=" ">
                    {loading ? (
                        // Skeleton for loading
                        <div className="flex justify-center space-y-2 animate-pulse items-center">
                            <div className=' border border-gray-200 p-4 shadow-sm rounded-md'>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 p-2">ชื่อผู้จอง</th>
                                            <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                                            <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                                            <th className="border border-gray-300 p-2">วันที่จอง</th>
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
                        <>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-blue-700 text-sm">
                                    พบทั้งหมด: {orders.length} รายการ
                                </span>
                                {currentOrders.length > 0 && (
                                    <span className="text-blue-700 text-sm">
                                        รายการในหน้านี้: {currentOrders.length} รายการ
                                    </span>
                                )}
                            </div>
                            <div className="overflow-x-auto mt-2">
                                <table className="border-collapse text-center border border-gray-400 w-full">
                                    <thead>
                                        <tr className="bg-gray-300">
                                            <th className="border border-gray-500 p-2">ชื่อจอง</th>
                                            <th className="border border-gray-500 p-2">บริการที่เลือก</th>
                                            <th className="border border-gray-500 p-2">วิธีการรับ-ส่งคืน</th>
                                            <th className="border border-gray-500 p-2">วันที่จอง</th>
                                            <th className="border border-gray-500 p-2">การดำเนินการ</th>
                                            <th className="border border-gray-500 p-2">ดูข้อมูล</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-100 even:bg-gray-50 bg-white border border-gray-300"
                                            >
                                                <td className="border border-gray-400 p-2">{order.name}</td>
                                                <td className="border border-gray-400 p-2">
                                                    {order.services?.nameService || "ไม่มีบริการ"}
                                                </td>
                                                <td className="border border-gray-400 p-2">
                                                    {order.delivery?.Delivery || "ไม่มีวิธีการรับ-ส่งคืน"}
                                                </td>
                                                <td className="border border-gray-400 p-2">
                                                    {formatToThaiTime(order.createdAt)}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-2 w-2/12">
                                                    <button
                                                        onClick={() => toggleStatus(order.id, order.isActive)}
                                                        className={`px-4 py-1 rounded ${order.isActive
                                                            ? "hover:bg-green-600 hover:text-white text-green-700 bg-green-200"
                                                            : "hover:bg-red-600 hover:text-white text-red-700 bg-red-100"
                                                            }`}
                                                    >
                                                        {order.isActive ? "กำลังซักรีด" : "จัดส่งแล้ว"}
                                                    </button>
                                                </td>
                                                <td className="border border-gray-400 p-2">
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
                            </div>
                            <div className="flex justify-center mt-4">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setPage(index + 1)}
                                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-blue-500 border-blue-500"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    {isViewModalOpen && selectedOrder && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black p-9 bg-opacity-50">
                            <div className="bg-white p-2 rounded ml-20 w-full max-w-7xl min-h-xl">
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
                                    <div className="grid grid-cols-1 text-center gap-4 w-8/12">
                                        <div className="">
                                            <p className="font-semibold mb-1">ชื่อผู้จอง :</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.name}</p>
                                            <p className="font-semibold mb-1 mt-1">เบอร์โทรศัพท์ :</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.phone}</p>
                                            <p className="font-semibold mb-1 mt-1">บริการ :</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded">{selectedOrder.services?.nameService} {selectedOrder.services?.description} {selectedOrder.services?.hour} ชม. {selectedOrder.services?.price} บาท</p>
                                            <p className="font-semibold mb-1 mt-1">สถานะชำระ :</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded mb-1">สถานะชำระ</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 text-center gap-4 w-7/12 ml-2 mr-2">
                                        <div className="">
                                            {/* <p className="font-semibold">ข้อมุลติดต่อ:</p> */}
                                            <div className="">
                                                <p className="font-semibold mb-1">รายการ :</p>
                                                {selectedOrder && selectedOrder.details?.map((detail, index) => (
                                                    <div key={index} className="grid grid-cols-2 gap-4 w-full mb-2">
                                                        <p className="bg-gray-100 px-3 py-2 rounded">{detail.fieldValue}</p>
                                                        <p className="bg-gray-100 px-3 py-2 rounded">{detail.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="font-semibold mb-1 mt-1">วิธีการรับ-ส่งคืน :</p>
                                            <p className="bg-gray-100 px-3 py-2 rounded">
                                                {selectedOrder.delivery?.Delivery} <br />
                                                {selectedOrder.delivery?.descriptionDelivery}</p>
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
            </>
        )
    };
    return (
        <main className="p-12">
            <h1 className="text-2xl font-bold">รายการคำสั่งจอง</h1>
            {activeServices.length > 0 && (
                <span className="text-blue-700 font-bold text-sm" >
                    คำสั่งซื้อทั้งหมด: {activeServices.length} คำสั่งซื้อ
                </span>
            )}
            {loading ? (
                <div className="flex justify-center mt-20 space-y-2 animate-pulse items-center">
                    <div>
                        <div className=' border border-gray-200 p-4 animate-pulse shadow-sm rounded-md'>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-2">ชื่อผู้จอง</th>
                                        <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                                        <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                                        <th className="border border-gray-300 p-2">วันที่จอง</th>
                                        <th className="border border-gray-300 p-2">การดำเนินงาน</th>
                                        <th className="border border-gray-300 p-2">ดูข้อมูล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center animate-pulse">
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 ">
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className=' border border-gray-200 p-4 shadow-sm rounded-md'>
                            <table className="w-full border-collapse border animate-pulse border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-2">ชื่อผู้จอง</th>
                                        <th className="border border-gray-300 p-2">บริการที่เลือก</th>
                                        <th className="border border-gray-300 p-2">วิธีการรับ-ส่งคืน</th>
                                        <th className="border border-gray-300 p-2">วันที่จอง</th>
                                        <th className="border border-gray-300 p-2">การดำเนินงาน</th>
                                        <th className="border border-gray-300 p-2">ดูข้อมูล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center animate-pulse">
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">&nbsp;</td>
                                        <td className="border px-4 py-2 ">
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 ">
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        {renderTable(activeOrders, "รายการคำสั่งจอง - กำลังซักรีด", currentPageActive, setCurrentPageActive)}
                    </div>
                    <div>
                        {renderTable(inactiveOrders, "รายการคำสั่งจอง - จัดส่งแล้ว", currentPageInactive, setCurrentPageInactive)}
                    </div>
                </>
            )}
        </main>
    );
};

export default List;