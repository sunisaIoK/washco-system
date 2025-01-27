'use client';
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables as registered } from 'chart.js';
import { useRouter } from "next/navigation";

// ลงทะเบียน ArcElement และ Tooltip
Chart.register(...registered);

interface ServiceData {
    id: string;
    nameService: string;
    description: string;
    price: number;
    isActive: boolean;
}
interface DeliveryData {
    id: string;
    Delivery: string;
    descriptionDelivery: string;
    isActive: boolean;
}
interface DetailField {
    fieldName: string;
    fieldValue: string;
    price?: number;
}
// ชนิดข้อมูลสำหรับข้อมูลที่ดึงมา
interface Orders {
    id: string;
    services: ServiceData | null;
    details: DetailField[];
    delivery: DeliveryData | null;
    pickupDate: string | null;
    deliveryDate: string | null;
    createdAt: string;
}

const PopularService = () => {
    const [sales, setSales] = useState<Orders[]>([]);
    const router = useRouter();
    const [startMonth, setStartMonth] = useState<Date | null>(null);
    const [endDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch('/api/data/order', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลได้');
                }
                const data = await response.json();
                setSales(data.Orders || []);
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        };

        fetchAllData();
    }, [router]);

    // ฟังก์ชันนับบริการยอดนิยม
    const countPopularServices = (sales: Orders[]) => {
        const serviceCount: { [key: string]: number } = {};

        sales.forEach(sale => {
            const service = sale.services?.nameService; // สันนิษฐานว่าชื่อบริการอยู่ใน serviceData
            if (service) {
                serviceCount[service] = (serviceCount[service] || 0) + 1; // Increment count
            }
        });

        return serviceCount;
    };

    // ฟิลเตอร์คำสั่งซื้อ
    const filteredOrders = sales.filter((sale) => {
        const orderDate = new Date(sale.createdAt);
        return (!startMonth || orderDate >= startMonth) && (!endDate || orderDate <= endDate);
    });

    // นับจำนวนบริการที่นิยมที่สุด
    const popularServices = countPopularServices(filteredOrders);

    const labels = Object.keys(popularServices);
    const serviceData = Object.values(popularServices);

    const data = {
        labels: labels,
        datasets: [{
            label: 'บริการที่ได้รับความนิยม',
            data: serviceData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(2, 154, 255, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(220, 110, 0)',
                'rgb(75, 192, 192)',
                'rgb(0, 153, 255)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        },
    };

    return (
        <main className="max-w-8xl mx-auto flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-9 font-bold text-center mt-4">บริการยอดนิยม</h1>
            <div>
                <div className="flex flex-col ml-24 items-center mb-5 p-1 rounded-lg">
                    <DatePicker
                        selected={startMonth}
                        onChange={(month) => setStartMonth(month)}
                        selectsStart
                        startDate={startMonth}
                        showMonthYearPicker
                        showMonthDropdown
                        placeholderText="เลือกเดือน"
                        className="w-6/12 p-1 rounded "
                    />
                </div>
                <div className="flex  flex-col items-center pl-9 pr-9 pt-5 pb-5 p-1 rounded-lg">
                    {serviceData.length > 0 ? (
                        <main className="flex">
                            <div>
                                {labels.map((label, index) => (
                                    <div key={index} className="flex items-center mb-4 mr-9">
                                        <div
                                            className="w-6 h-6 rounded-full mr-4"
                                            style={{ backgroundColor: config.data.datasets[0].backgroundColor[index] }}
                                        >
                                            
                                        </div>
                                        <p className="text-lg font-semibold">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <Bar data={data} options={config.options} style={{ width: '100px', height: '300px' }} />
                        </main>
                    ) : (
                        <p className="text-gray-500">ไม่มีบริการที่ได้รับความนิยมในช่วงเวลานี้</p>
                    )}
                    <p className="mt-5 text-sm text-gray-500">
                        พบ {filteredOrders.length} คำสั่งซื้อในช่วงเวลาที่เลือก
                    </p>
                </div>
            </div>
        </main>
    );
};

export default PopularService;