'use client';
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables as registered } from 'chart.js';
import { useRouter } from "next/navigation";

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

const MonthSales = () => {
    const [sales, setSales] = useState<Orders[]>([]);
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
                const salesData = await response.json();
                setSales(salesData.Orders || []);
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        };
        fetchAllData();
    }, [router]);

    const countSalesByMonth = (sales: Orders[]) => {
        const saleByMonth: { [key: string]: { total: number; count: number } } = {};
        sales.forEach(sale => {
            const orderDate = new Date(sale.createdAt);
            const month = orderDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            const totalSale = sale.totalPrice;
            if (!saleByMonth[month]) {
                saleByMonth[month] = { total: 0, count: 0 };
            }
            saleByMonth[month].total += totalSale;
            saleByMonth[month].count += 1;
        });
        return saleByMonth;
    };

    const filteredOrders = sales.filter((sale) => {
        const orderDate = new Date(sale.createdAt);
        return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    const saleByMonth = countSalesByMonth(filteredOrders);

    const labels = Object.keys(saleByMonth);
    const totalSalesData = labels.map(month => saleByMonth[month]?.total || 0);
    const orderCountData = labels.map(month => saleByMonth[month]?.count || 0);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'รายได้ต่อเดือน',
                data: totalSalesData,
                backgroundColor: [
                    'rgb(0, 170, 255)',
                    'rgb(0, 45, 144)',
                    'rgb(96, 0, 222)',
                    'rgb(22, 167, 167)',
                    'rgb(54, 162, 235)',
                    'rgb(102, 148, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderColor: [
                    'rgb(3, 179, 255)',
                    'rgb(17, 72, 166)',
                    'rgb(162, 13, 212)',
                    'rgb(22, 167, 167)',
                    'rgb(54, 162, 235)',
                    'rgb(102, 148, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1,
            },
            {
                label: 'ยอดคำสั่งซื้อต่อเดือน',
                data: orderCountData,
                backgroundColor: [
                    'rgba(232, 48, 88, 0.95)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(232, 54, 92)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            },
        ],
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: { beginAtZero: true },
                x: { stacked: false },
            },
            plugins: {
                title: {
                    display: false,
                    text: 'รายได้และยอดคำสั่งซื้อต่อเดือน'
                }
            }
        },
    };

    return (
        <main className="max-w-9xl mx-auto flex flex-col justify-center pl-8 pr-8 pt-1 items-center">
            <h1 className="text-2xl mb-9 font-bold text-center mt-4">คำสั่งซื้อแต่ละเดือน</h1>
            <div>
                <div className="flex flex-col justify-between md:flex-row pl-5 pr-5 text-center">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        showMonthYearPicker
                        placeholderText="เลือกวันเริ่มต้น"
                        className="w-9/12 p-1 rounded text-center "
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        showMonthYearPicker
                        placeholderText="เลือกวันสิ้นสุด"
                        className="w-9/12 p-1 rounded text-center"
                    />
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg pl-6 pr-6">
                    {Object.values(saleByMonth).length > 0 ? (
                        <main className="flex">
                            <div>
                                {labels.map((label, index) => (
                                    <div key={index} className="flex items-center mb-4 mr-9">
                                        <div
                                            className="w-3.5 h-3.5 rounded-full mr-4"
                                            style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                                        >
                                        </div>
                                        <p className="text-lg font-semibold">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <Bar data={data} options={config.options} style={{ width: '155px', height: '300px' }} />
                        </main>
                    ) : (
                        <div className="text-gray-500 mx-9 my-9 w-56 text-center">
                            <p className="text-gray-500 h-24">ไม่มีข้อมูลคำสั่งซื้อในช่วงเวลานี้</p>
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

export default MonthSales;
