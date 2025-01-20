'use client';

import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables as registered } from 'chart.js';
// import CountUser from "src/components/admin/graph/CountUser";
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
    totalPrice: number;
    pickupDate: string | null;
    deliveryDate: string | null;
    createdAt: string;
}

const TotalSales = () => {
    const [orders, setOrders] = useState<Orders[]>([]);
    // const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch('/api/data/order', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลได้');
                }
                const data = await response.json();
                setOrders(data.Orders || []);
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        };
        fetchAllData();
    }, [router]);
    // if (error) return <p className="text-red-500">{error}</p>;

    // ฟังก์ชันนับคำสั่งซื้อแยกตามเดือน
    const countOrdersByMonth = (orders: Orders[]) => {
        const ordersByMonth: { [key: string]: number } = {};
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const month = orderDate.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }); // รูปแบบ "มกราคม 2023"

            if (ordersByMonth[month]) {
                ordersByMonth[month] += 1;
            } else {
                ordersByMonth[month] = 1;
            }
        });

        return ordersByMonth;
    };

    // ฟิลเตอร์คำสั่งซื้อ
    const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    // คำนวณจำนวนคำสั่งซื้อโดยแยกตามเดือน
    const ordersByMonth = countOrdersByMonth(filteredOrders);

    const labels = Object.keys(ordersByMonth);
    const data = {
        labels: labels,
        datasets: [{
            label: 'ยอดขายทั้งหมด',
            data: Object.values(ordersByMonth),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
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
                    beginAtZero: true
                }
            }
        },
    };

    return (
        <main className="max-w-4xl mx-auto flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-9 text-center  mt-4">ยอดคำสั่งซื้อ</h1>
            <div>
                <div className="flex flex-col items-center justify-between md:flex-row pl-5 pr-5 text-center ">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormatCalendar='D MMMM yyyy'
                        placeholderText="เลือกวันเริ่มต้น"
                        className="w-9/12 p-1 rounded  text-center"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        dateFormatCalendar='D MMMM yyyy'
                        placeholderText="เลือกวันสิ้นสุด"
                        className="w-9/12 p-1 rounded  text-center"
                    />
                </div>
                <div className="flex  flex-col items-center pl-9 pr-9 pt-5 pb-5 p-1 rounded-lg">
                    {data.datasets[0].data.length > 0 ? (
                        <Bar data={data} options={config.options} />
                    ) : (
                        <div className="text-gray-500 mx-9 my-9 w-56  text-center ">
                            <p className="text-gray-500 h-20">ไม่มีข้อมูลคำสั่งซื้อในช่วงเวลานี้</p>
                        </div>
                    )}
                    <p className="mt-5 text-sm text-gray-500 text-center">
                        พบ {filteredOrders.length} คำสั่งซื้อในช่วงเวลาที่เลือก
                    </p>
                </div>
            </div>
        </main>
    );
};

export default TotalSales;