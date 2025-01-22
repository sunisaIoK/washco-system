'use client';

import React, { useEffect, useState } from 'react';

interface Service {
    id: string;
    nameService: string;
    description: string;
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

    return (
        <main className=" min-w-screen mb-2">
            {/* Title */}
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">อัตราค่าบริการ</h1>
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
                            <p className="text-gray-700 text-sm " style={{marginLeft: "-55%"}}>
                                พบรายการทั้งหมด: {activeServices.length} รายการ
                            </p>
                            {activeServices.map((service) => (
                                <div
                                    key={service.id}
                                    className="border border-gray-200 p-4 rounded-md flex flex-col justify-center shadow-sm w-9/12"
                                >
                                    <div className="flex flex-col justify-center p-2">
                                        <h2 className="text-lg font-bold mb-5">{service.nameService}</h2>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-gray-600 mb-2">{service.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-semibold">
                                                    {service.price} บาท
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </main>
    );
};

export default RatePage;