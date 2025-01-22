'use client';

import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface ServiceData {
    id: string;
    nameService: string;
    description: string;
    hour: number;
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

interface DetailData {
    id: string;
    nameDetail: string;
    fields: DetailField[];
    price: string;
    isActive: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const BookingPage = () => {
    const { data: session, status } = useSession();

    const [services, setServices] = useState<ServiceData[]>([]);
    const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
    const [details, setDetails] = useState<DetailData[]>([]);
    const [selectedFields, setSelectedFields] = useState<{
        [key: string]: string;
    }>({});
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [confirmationTime, setConfirmationTime] = useState<Date | null>(null);
    const [pickupTime, setPickupTime] = useState<Date | null>(null);
    const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
    const [selectedServices, setSelectedServices] = useState<ServiceData | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<DetailField[]>([]);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0); // ราคารวม
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [formData, setFormData] = useState({
        hotelName: '',
        roomNumber: '',
        additionalDetails: '',
        name: '',
        phone: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data/booking', { method: 'GET' });
            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลได้');
            }
            const { serviceData, detailData, deliveryData } = await response.json();
            setServices(serviceData || []);
            setDetails(detailData || []);
            setDeliveries(deliveryData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // ฟังก์ชันคำนวณวันที่ส่งคืน
    const calculateDeliveryDate = () => {
        if (pickupDate && selectedServices?.hour) {
            const pickupTime = new Date(pickupDate); // สำเนาของ pickupDate
            pickupTime.setHours(pickupTime.getHours() + selectedServices.hour); // เพิ่มจำนวนชั่วโมงที่เลือกจากบริการ
            setDeliveryDate(pickupTime); // อัปเดต deliveryDate
        } else {
            setDeliveryDate(null); // รีเซ็ต deliveryDate ถ้าไม่มีข้อมูล
        }
    };

    // เรียกฟังก์ชันคำนวณวันที่ส่งคืนทุกครั้งที่ pickupDate หรือ selectedServices เปลี่ยนแปลง
    useEffect(() => {
        calculateDeliveryDate();
    }, [pickupDate, selectedServices]);

    // เพิ่มบริการที่เลือก
    const handleServiceSelection = (services: ServiceData) => {
        setSelectedServices(services); // เก็บ Object ของ Service เดียว
    };
    // เลือกรายละเอียด
    const handleDetailSelection = (detailId: string, field: DetailField) => {
        const selectedDetail = details.find((detail) => detail.id === detailId);

        if (selectedDetail) {
            // อัปเดต selectedFields
            setSelectedFields((prev) => ({
                ...prev,
                [detailId]: field.fieldName, // กำหนดชื่อฟิลด์ (Key) สำหรับ Detail ที่เลือก
            }));

            // เพิ่ม/อัปเดต selectedDetails
            setSelectedDetails((prev) => {
                const updatedDetails = prev.filter((d) => d.fieldName !== field.fieldName); // ลบรายการที่ซ้ำ
                return [...updatedDetails, { ...field, price: parseFloat(selectedDetail.price) }]; // รวมราคาในรายการที่เลือก
            });
        }
    };

    // เลือกวิธีการรับ/ส่ง
    const handleDeliverySelection = (delivery: DeliveryData) => {
        setSelectedDelivery(delivery); // กำหนดค่าเป็น Object เดียว
    };

    // วัน และสรุปวันรับ-ส่ง
    const handleConfirmation = async () => {
        try {
            // ตรวจสอบว่าชำระเงินสำเร็จแล้วหรือไม่
            // if (!paymentSuccess) {
            //     alert('กรุณาชำระเงินก่อนยืนยันคำสั่งซื้อ');
            //     return;
            // }

            // จัดเตรียมข้อมูลสำหรับบันทึก
            const confirmedData = {
                services: selectedServices,
                details: selectedDetails,
                delivery: selectedDelivery,
                totalPrice,
                ...formData, // ข้อมูลติดต่อ (ที่อยู่, ชื่อ, อีเมล, เบอร์โทร)
                pickupDate: pickupDate?.toISOString() || null,
                deliveryDate: deliveryDate?.toISOString() || null,
                customerId: session?.user?.id || null,
            };

            if (!confirmedData.customerId) {
                alert("กรุณาล็อกอินก่อนทำรายการ");
                return;
            }

            // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
            if (
                !confirmedData.services ||
                confirmedData.details.length === 0 ||
                !confirmedData.delivery ||
                !confirmedData.pickupDate ||
                !confirmedData.deliveryDate ||
                !confirmedData.name ||
                !confirmedData.phone
            ) {
                alert('กรุณาเลือก/กรอกข้อมูลให้ครบถ้วนก่อนยืนยันคำสั่งซื้อ');
                return;
            }

            // ส่งข้อมูลไปยัง API
            const response = await fetch('/api/data/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(confirmedData),
            });

            if (!response.ok) {
                throw new Error('การบันทึกคำสั่งซื้อไม่สำเร็จ');
            }

            console.log('Order saved successfully.');
            alert('ข้อมูลคำสั่งซื้อถูกบันทึกเรียบร้อยแล้ว!');
        } catch (error) {
            console.error('Error saving order to database:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล');
        }
    };

    //ราคารวม กับตราแต่ละรายการที่เลือก
    const handleTotalPrice = () => {
        let total = 0;

        // ราคาจากบริการ
        if (selectedServices) {
            total += selectedServices.price || 0;
        }

        // ราคาจากรายละเอียด (หลายรายการ)
        selectedDetails.forEach((detail) => {
            total += detail.price || 0; // รวมราคาของแต่ละ detail
        });

        // ราคาจากการจัดส่ง
        if (selectedDelivery && selectedDelivery.isActive) {
            total += parseFloat(selectedDelivery.descriptionDelivery) || 0;
        }

        setTotalPrice(total); // อัปเดตราคารวม
    };

    useEffect(() => {
        handleTotalPrice(); // คำนวณราคาทุกครั้งที่มีการเปลี่ยนแปลง
    }, [selectedServices, selectedDetails, selectedDelivery]);


    //การจ่าย
    // ฟังก์ชัน handlePayment
    const handlePayment = async () => {
        const stripe = await stripePromise;

        if (!stripe) {
            console.error("Stripe.js failed to load.");
            return;
        }

        try {
            const items = [];

            // สร้างรายการสินค้า (Services, Details, Delivery)
            if (selectedServices) {
                items.push({
                    name: selectedServices.nameService,
                    price: (selectedServices.price || 0) * 100,
                    quantity: 1,
                });
            }

            selectedDetails.forEach((detail) => {
                if (detail.price !== undefined) {
                    items.push({
                        name: detail.fieldValue || "ไม่มีชื่อ",
                        price: (detail.price || 0) * 100,
                        quantity: 1,
                    });
                }
            });

            if (selectedDelivery) {
                items.push({
                    name: selectedDelivery.Delivery,
                    price: parseFloat(selectedDelivery.descriptionDelivery || "0") * 100,
                    quantity: 1,
                });
            }

            console.log("Items sent to Stripe:", items);

            const response = await fetch("/api/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                throw new Error("Failed to create Stripe Checkout Session");
            }

            const { id } = await response.json();

            // Redirect ไป Stripe Checkout
            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (error) {
                console.error("Stripe Checkout Error:", error);
            } else {
                setPaymentSuccess(true); // อัปเดตสถานะการชำระเงินสำเร็จ
                alert("ชำระเงินสำเร็จแล้ว!");
            }
        } catch (error) {
            console.error("Error handling payment:", error);
        }
    };

    // กรองข้อมูลที่เปิดใช้งาน
    const activeDetails = details.filter((detail) => detail.isActive);
    const activeServices = services.filter((service) => service.isActive);
    const activeDeliveries = deliveries.filter((delivery) => delivery.isActive);

    return (
        <div className="min-w-screen flex flex-col items-center justify-center mb-9">
            <div className="w-full max-w-screen-lg px-4">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">ให้เราดูแลเสื้อผ้าของคุณอย่างครบวงจร</h1>
                    <h2 className="text-lg">ด้วยบริการ ซัก อบ รีด ด้วยความพิถีพิถัน ใส่ใจในทุกขั้นตอน</h2>
                </div>

                <form action="">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">เลือกวันที่รับ-ส่งคืนผ้า</h2>
                        {loading ? (
                            <p className="text-gray-500">กำลังโหลดข้อมูลบริการ...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : activeServices.length === 0 ? (
                            <p className="text-center text-gray-500">ไม่มีบริการที่พร้อมใช้งาน</p>
                        ) : (
                            <div className="w-full max-w-screen-lg px-4">
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-bold mb-2">สร้างคำสั่งจอง</h1>
                                </div>
                                {/* ส่วนแสดง Loading/Error และข้อมูล Services */}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">เลือกบริการ</h2>
                                    {loading ? (
                                        <p>กำลังโหลดข้อมูล...</p>
                                    ) : error ? (
                                        <p className="text-red-500">{error}</p>
                                    ) : services.length === 0 ? (
                                        <p className="text-center text-gray-500">ไม่มีบริการที่พร้อมใช้งาน</p>
                                    ) : (
                                        services.map((service) => (
                                            <div
                                                key={service.id}
                                                onClick={() => handleServiceSelection(service)}
                                                className={`p-4 border rounded cursor-pointer m-3 ${selectedServices?.id === service.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold">{service.nameService}</p>
                                                <p>{service.description}</p>
                                                <p>เวลา: {service.hour} ชั่วโมง</p>
                                                <p>ราคา: {service.price} บาท</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ส่วนแสดง Loading/Error และข้อมูล Details */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">เลือกรายละเอียด</h2>
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </div>) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : activeDetails.length === 0 ? (
                                <p className="text-center text-gray-500">ไม่มีรายละเอียดในขณะนี้</p>
                            ) : (
                            activeDetails.map((detail) => (
                                <div
                                    key={detail.id}
                                    className="rounded-lg border border-blue-900 bg-white p-3 mb-3"
                                >
                                    <p className="font-semibold">{detail.nameDetail}</p>
                                    <p>ราคา: {detail.price} บาท</p>
                                    <p>รายละเอียดเพิ่มเติม:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3">
                                        {detail.fields.map((field, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-2 rounded-lg shadow-sm"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`detail-${detail.id}`}
                                                    className="form-radio h-4 w-4 text-blue-500"
                                                    checked={selectedFields[detail.id] === field.fieldName}
                                                    onChange={() => handleDetailSelection(detail.id, field)} // เรียกใช้ handleDetailSelection
                                                />
                                                <label className="text-md text-gray-600">{field.fieldValue}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ส่วนแสดง Loading/Error และข้อมูล Deliveries */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">เลือกวิธีรับ-ส่งคืนผ้า</h2>
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </div>) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : activeDeliveries.length === 0 ? (
                                <p className="text-center text-gray-500">ไม่มีบริการรับส่งที่พร้อมใช้งาน</p>
                            ) : (
                            activeDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    onClick={() => handleDeliverySelection(delivery)}
                                    className={`p-4 border rounded cursor-pointer ${selectedDelivery?.id === delivery.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <p className="font-semibold">{delivery.Delivery}</p>
                                    <p>รายละเอียด: {delivery.descriptionDelivery}</p>
                                </div>
                            ))
                        )}
                    </div>
                      {/* เลือกวันที่ */}
                      <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">เลือกวันที่รับผ้า</h2>
                                    <DatePicker
                                        selected={pickupDate}
                                        onChange={(date) => setPickupDate(date)}
                                        minDate={new Date()}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        className="border rounded p-2"
                                        placeholderText="เลือกวันที่รับผ้า"
                                    />
                                </div>

                                {/* วันที่ส่งคืนผ้าคำนวณอัตโนมัติ */}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">วันที่ส่งคืน (คำนวณอัตโนมัติ)</h2>
                                    {deliveryDate ? (
                                        <p className="bg-gray-100 px-3 py-2 rounded">{deliveryDate.toLocaleString()}</p>
                                    ) : (
                                        <p className="text-gray-500">ยังไม่ได้เลือกวันที่รับผ้า</p>
                                    )}
                                </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">ที่อยู่และข้อมูลติดต่อ</h2>
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </div>) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : activeDeliveries.length === 0 ? (
                                <p className="text-center text-gray-500">ไม่มีบริการรับส่งที่พร้อมใช้งาน</p>
                            ) : (
                            <div>
                                <div>
                                    <h3 className="text-md font-semibold mb-3">ข้อมูลที่อยู่</h3>
                                    <div className="mb-4">
                                        <label htmlFor="hotelName" className="block font-medium mb-1">
                                            ชื่อโรงแรมหรือที่อยู่:
                                        </label>
                                        <input
                                            type="text"
                                            id="hotelName"
                                            name="hotelName"
                                            value={formData.hotelName}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-2"
                                            placeholder="เช่น โรงแรม ABC"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="roomNumber" className="block font-medium mb-1">
                                            หมายเลขห้อง:
                                        </label>
                                        <input
                                            type="text"
                                            id="roomNumber"
                                            name="roomNumber"
                                            value={formData.roomNumber}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-2"
                                            placeholder="เช่น 101"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="additionalDetails" className="block font-medium mb-1">
                                            รายละเอียดเพิ่มเติม:
                                        </label>
                                        <textarea
                                            id="additionalDetails"
                                            name="additionalDetails"
                                            value={formData.additionalDetails}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-2"
                                            placeholder="เพิ่มรายละเอียดที่เกี่ยวกับที่อยู่"
                                        ></textarea>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold mb-3">ข้อมูลติดต่อ</h3>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block font-medium mb-1">
                                            ชื่อผู้ติดต่อ:
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-2"
                                            placeholder="ระบุชื่อผู้ติดต่อ"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block font-medium mb-1">
                                            เบอร์โทรศัพท์:
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border rounded-md p-2"
                                            placeholder="เช่น 0812345678"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <div className="p-6 bg-gray-100 border rounded-md">
                    <h2 className="text-xl font-bold mb-4">สรุปรายการคำสั่งซื้อ</h2>
                    <ul>
                        <h3 className="text-md font-semibold">บริการ:</h3>
                        {selectedServices ? (
                            <p>- {selectedServices.nameService} : {selectedServices.description} : {selectedServices.hour} ชั่วโมง : ราคา {selectedServices.price} บาท</p>
                        ) : (
                            <p>ยังไม่ได้เลือกบริการ</p>
                        )}
                    </ul>
                    <ul>
                        <h3 className="text-md font-semibold">รายละเอียดที่เลือก:</h3>
                        {selectedDetails.length > 0 ? (
                            selectedDetails.map((detail, index) => (
                                <li key={index}>
                                    <p>- {detail.fieldValue}: {detail.price || 'ไม่มีราคา'} บาท</p>
                                </li>
                            ))
                        ) : (
                            <p>ยังไม่ได้เลือกรายละเอียด</p>
                        )}
                    </ul>
                    <ul>
                        <h3 className="text-md font-semibold">วิธีรับ/ส่งคืน:</h3>
                        {selectedDelivery ? (
                            <p>- {selectedDelivery.Delivery}</p>
                        ) : (
                            <p>ยังไม่ได้เลือกวิธีรับส่ง</p>
                        )}
                    </ul>
                    <ul>
                        <h3 className="text-md font-semibold">ที่อยู่:</h3>
                        {formData.hotelName || formData.roomNumber || formData.additionalDetails ? (
                            <>
                                <li>- ที่อยู่: {formData.hotelName || 'ไม่ได้ระบุ'}</li>
                                <li>- หมายเลขห้อง: {formData.roomNumber || 'ไม่ได้ระบุ'}</li>
                                <li>- รายละเอียดเพิ่มเติม: {formData.additionalDetails || 'ไม่ได้ระบุ'}</li>
                            </>
                        ) : (
                            <p>ยังไม่ได้กรอกที่อยู่</p>
                        )}
                    </ul>
                    <ul>
                        <h3 className="text-md font-semibold">ข้อมูลติดต่อ:</h3>
                        {formData.name || formData.phone ? (
                            <>
                                <li>- ชื่อ: {formData.name || 'ไม่ได้ระบุ'}</li>
                                <li>- เบอร์โทรศัพท์: {formData.phone || 'ไม่ได้ระบุ'}</li>
                            </>
                        ) : (
                            <p>ยังไม่ได้กรอกข้อมูลติดต่อ</p>
                        )}
                    </ul>
                    <p className="mt-4 font-bold">ราคารวม: {totalPrice} บาท</p>

                    {/* <button onClick={handlePayment}>ชำระ</button> */}

                    {/* แสดงเวลานัด */}
                    <div>
                        {/* สรุปคำสั่งซื้อ */}
                        {confirmedOrder && (
                            <div className="p-6 bg-gray-100 border rounded-md mt-6">
                                <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อของคุณ:</h2>
                                <ul>
                                    <li>บริการ: {confirmedOrder.services?.nameService} - {confirmedOrder.services?.price} บาท</li>
                                    <li>
                                        รายละเอียดเพิ่มเติม:
                                        {confirmedOrder.details.length > 0 ? (
                                            <ul>
                                                {confirmedOrder.details.map((detail: DetailField, index: number) => (
                                                    <li key={index}>
                                                        {detail.fieldValue} - {detail.price || 0} บาท
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span> ไม่มีรายละเอียดเลือก</span>
                                        )}
                                    </li>
                                    <li>วิธีการจัดส่ง: {confirmedOrder.delivery?.Delivery || "ไม่มีวิธีส่งที่เลือก"}</li>
                                    <li>รวมราคา: {confirmedOrder.totalPrice} บาท</li>
                                    <li>วันที่รับผ้า: {pickupDate?.toLocaleString()}</li>
                                    <li>วันที่คืนผ้า: {deliveryDate?.toLocaleString()}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button
                        onClick={handleConfirmation}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        ยืนยันคำสั่งซื้อ
                    </button>
                    <button
                        onClick={handlePayment}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        ชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;

