'use client';

import React, { useEffect, useState } from 'react';

interface Service {
    id: string;
    nameService: string;
    description: string;
    hour: number;
    price: number;
    isActive: boolean;
}

const RatePage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all services from the server
    const fetchServices = async () => {
        try {
            setLoading(true); // Start loading
            const response = await fetch('/api/data/service', { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            const { services: fetchedServices } = await response.json();
            setServices(fetchedServices || []);
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchServices(); // Load services when the component is mounted
    }, []);

    // กรองเฉพาะบริการที่เปิดการใช้งาน
    const activeServices = services.filter((service) => service.isActive);
    const sortedOrders = services.sort((a, b) => a.nameService.localeCompare(b.nameService, 'th'));
    console.log(sortedOrders);
    return (
        <main className=" min-w-screen mb-9 -mt-5 justify-center items-center ">
            {/* Title */}
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">อัตราค่าบริการของเรา</h1>
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 mb-4 flex justify-center">{error}</p>}
            {/* Loading State */}
            {loading ? (
                <div className="space-y-4 mt-9 animate-pulse min-w-screen flex justify-center items-center">
                    <div className="w-5/12 border border-gray-200 p-4 shadow-sm rounded-md">
                        <div className="bg-gray-300 rounded mb-4">&nbsp;</div>
                        <div className="bg-gray-300 rounded">&nbsp;</div>
                    </div>
                </div>
            ) : (
                <div className="min-w-screen flex flex-col justify-center items-center mt-9 space-y-4 p-3 ml-44 mr-44">
                    {/* เมื่อไม่มีข้อมูลที่เปิดการทำงาน */}
                    {activeServices.length === 0 ? (
                        <p className="text-gray-500">ไม่มีบริการที่เปิดใช้งานในขณะนี้</p>
                    ) : (
                        <>
                            {/* <p className="text-gray-700 text-sm " style={{marginLeft: "-55%"}}>
                                พบรายการทั้งหมด: {activeServices.length} รายการ
                            </p> */}
                            <div className="flex flex-wrap gap-5 justify-center">
                                {activeServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className="p-9 border-b-2 shadow-xl bg-white transition-all ml-2 mr-2 h-auto duration-300 rounded-lg"
                                    >
                                        <div className="flex flex-col text-center">
                                            <h3 className="text-sm font-bold text-yellow-500">{service.nameService}</h3>
                                            <div className="text-xl font-bold text-gray-800 mt-2 border-b-2">
                                                <div className="flex text-base font-medium text-gray-800 mt-2 justify-center">
                                                    <p className="text-xs -mt-1">
                                                        ฿
                                                    </p>
                                                    <p className='font-bold text-2xl'>
                                                        {service.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-7 flex ">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 21 21"
                                                    className="bg-blue-900 rounded-3xl mr-4"
                                                >
                                                    <g
                                                        fill="none"
                                                        stroke="#fff"
                                                    >
                                                        <path d="M14.857 3.79a8 8 0 1 0 2.852 3.24" />
                                                        <path d="m6.5 9.5l3 3l8-8" />
                                                    </g>
                                                </svg>
                                                {service.description} {service.hour} ชั่วโมง
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2 flex ">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 21 21"
                                                    className="bg-blue-900 rounded-3xl mr-4"
                                                > 
                                                    <g
                                                        fill="none"
                                                        stroke="#fff"
                                                    >
                                                        <path d="M14.857 3.79a8 8 0 1 0 2.852 3.24" />
                                                        <path d="m6.5 9.5l3 3l8-8" />
                                                    </g>
                                                </svg>
                                                บริการรับ-ส่งฟรี
                                            </p>
                                        </div>
                                        <button className='bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-6 ml-16'>
                                            <a href="/page/user/book">
                                                สั่งจองตอนนี้
                                            </a>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </main>
    );
};

export default RatePage;