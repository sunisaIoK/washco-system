'use client';

import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

interface DeliveryData {
    id: string;
    Delivery: string;
    descriptionDelivery: string;
    isActive: boolean;
}

interface DeliverySelectionProps {
    selectedDelivery: DeliveryData | null;
    onSelectDelivery: (delivery: DeliveryData) => void;
}

const DeliverySelection: React.FC<DeliverySelectionProps> = ({
    selectedDelivery,
    onSelectDelivery,
}) => {
    const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

    // ดึงข้อมูลบริการจาก API
    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/data/booking', { method: 'GET' });
                if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
                const { deliveryData } = await response.json();
                setDeliveries(deliveryData || []);
            } catch (err) {
                console.error(err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, []);

    // เลือกวิธีการรับ/ส่ง
    const handleDeliverySelection = (delivery: DeliveryData) => {
        onSelectDelivery(delivery); // ส่งข้อมูลไปยังฟังก์ชันพาเรนต์
    };

    // คำนวณวันที่ส่งคืนผ้า
    useEffect(() => {
        if (pickupDate) {
            const returnDate = new Date(pickupDate.getTime());
            returnDate.setHours(returnDate.getHours() + 48); // เพิ่ม 48 ชั่วโมงสำหรับการจัดส่ง
            setDeliveryDate(returnDate);
        } else {
            setDeliveryDate(null);
        }
    }, [pickupDate]);

    const activeDeliveries = deliveries.filter((delivery) => delivery.isActive);

    return (
        <div className="p-6 w-full bg-white rounded-3xl shadow-xl mt-3 mb-5">
            {/* <h2 className="text-xl font-semibold mb-4 text-blue-700">เลือกวิธีรับ-ส่งคืนผ้า</h2> */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
                    <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
                    <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : activeDeliveries.length === 0 ? (
                <p className="text-center text-gray-500">ไม่มีบริการรับส่งที่พร้อมใช้งาน</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {activeDeliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            onClick={() => handleDeliverySelection(delivery)}
                            className={`p-2 border-b-2 cursor-pointer text-lg  shadow mt-3 transition-all duration-300 ${selectedDelivery?.id === delivery.id
                                ? 'border-blue-500 border hover:text-white rounded hover:shadow-lg'
                                : 'border-blue-100 hover:border-blue-700 rounded hover:shadow-lg'
                                }`}
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 50 50">
                                    <g fill="none" >
                                        <path stroke="#0f0f0f" d="M31.25 12.5v22.917H20.833a4.167 4.167 0 0 0-8.333 0H8.333a2.083 2.083 0 0 1-2.083-2.084V12.5a2.083 2.083 0 0 1 2.083-2.083h20.834A2.083 2.083 0 0 1 31.25 12.5m12.146 9.896l-3.188-4.792a2.08 2.08 0 0 0-1.75-.937H31.25v18.75h2.083a4.167 4.167 0 0 1 8.334 0h2.083V23.542a2.1 2.1 0 0 0-.354-1.146" />
                                        <path stroke="#000" d="M20.833 35.417a4.166 4.166 0 1 1-8.331 0a4.166 4.166 0 0 1 8.331 0M37.5 31.25a4.167 4.167 0 1 0 0 8.334a4.167 4.167 0 0 0 0-8.334" />
                                    </g>
                                </svg>
                                <div className="ml-3 flex flex-col md:flex-row justify-between items-center">
                                    <div className="flex flex-col mr-9">
                                        <p className="font-semibold flex text-blue-800">
                                            {delivery.Delivery}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-gray-600 flex">
                                            {delivery.descriptionDelivery}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default DeliverySelection;
