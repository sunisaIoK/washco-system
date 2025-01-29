'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ServiceSelection from '@/components/ServiceSelection';
import DetailSelection from '@/components/DetailsSelection';
import DeliverySelection from '@/components/DeliverySelection';
import AddressSelection from '@/components/AddressSelection';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

interface ServiceData {
    id: string;
    nameService: string;
    description: string;
    hour: number;
    price: number;
    isActive: boolean;
}

interface DetailField {
    fieldName: string;
    fieldValue: string;
    price?: number;
}

interface DeliveryData {
    id: string;
    Delivery: string;
    descriptionDelivery: string;
    isActive: boolean;
}

interface ConfirmedOrder {
    services: ServiceData | null;
    details: DetailField[];
    delivery: DeliveryData | null;
    totalPrice: number;
    hotelName: string;
    roomNumber: string;
    additionalDetails: string;
    name: string;
    phone: string;
    customerId: string;
    paymentStatus: 'paid' | 'pending';
    pickupDate: string;
    deliveryDate: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const BookingPage = () => {
    const { data: session } = useSession();
    const [selectedDetail, setSelectedDetail] = useState<{ [key: string]: DetailField }>({});
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
    const [bookingId, setBookingId] = useState<string>('');
    const [formData, setFormData] = useState({
        hotelName: '',
        roomNumber: '',
        additionalDetails: '',
        name: '',
        phone: '',
    });
    const [pickupDate, setPickupDate] = useState<string>('');
    const [pickupTime, setPickupTime] = useState<string>('');
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [deliveryTime, setDeliveryTime] = useState<string>('');
    const serviceRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const deliveryRef = useRef<HTMLDivElement>(null);
    const addressRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);
    const totalRef = useRef<HTMLDivElement>(null);
    const [orderStatus, setOrderStatus] = useState<string>('pending'); // เริ่มต้นสถานะเป็น 'paid'
    const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false); // สถานะแสดงผลหน้าสรุป
    const [orderSummary, setOrderSummary] = useState<ConfirmedOrder | null>(null);

    useEffect(() => {
        if (pickupDate && pickupTime && selectedService) {
            const [hours, minutes] = pickupTime.split(':').map(Number);
            const pickupDateTime = new Date(pickupDate);
            pickupDateTime.setHours(hours, minutes, 0);

            const deliveryDateTime = new Date(pickupDateTime);
            deliveryDateTime.setHours(deliveryDateTime.getHours() + selectedService.hour);

            setDeliveryDate(deliveryDateTime.toISOString().split('T')[0]);
            setDeliveryTime(deliveryDateTime.toTimeString().split(' ')[0].slice(0, 5));
        }
    }, [pickupDate, pickupTime, selectedService]);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                if (!bookingId) return;

                const response = await fetch(`/api/data/order-status?bookingId=${bookingId}`);
                if (!response.ok) {
                    console.error('Failed to fetch order status');
                    return;
                }

                const result = await response.json();
console.log(orderStatus);

                // ตรวจสอบสถานะและอัปเดต
                const validStatuses = ['pending', 'confirmed', 'success', 'failed', 'canceled'];
                setOrderStatus(validStatuses.includes(result.status) ? result.status : 'paid');
            } catch (error) {
                console.error('Error fetching order status:', error);
            }
        };

        fetchOrderStatus();
    }, [bookingId]);

    const calculateTotalPrice = () => {
        let total = 0;
        if (selectedService) total += selectedService.price;
        Object.values(selectedDetail).forEach((detail) => {
            if (detail.price) total += detail.price;
        });
        return total;
    };

    const handleConfirmOrder = async () => {
        if (!selectedService || !pickupDate || !pickupTime || !formData.name || !formData.phone) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน!');
            return;
        }
        if (!selectedService) {
            toast.error('กรุณาเลือกบริการ!');
            return;
        }
        if (!pickupDate || !pickupTime) {
            toast.error('กรุณาเลือกวันที่และเวลารับ!');
            return;
        }
        if (!formData.name || !formData.phone) {
            toast.error('กรุณากรอกชื่อและเบอร์โทร!');
            return;
        }
        const totalPrice = calculateTotalPrice();

        const order: ConfirmedOrder = {
            services: selectedService,
            details: Object.values(selectedDetail),
            delivery: selectedDelivery,
            totalPrice,
            hotelName: formData.hotelName,
            roomNumber: formData.roomNumber,
            additionalDetails: formData.additionalDetails,
            name: formData.name,
            phone: formData.phone,
            customerId: session?.user?.id || '',
            paymentStatus:  'paid' ,
            pickupDate: `${pickupDate} ${pickupTime}`,
            deliveryDate: `${deliveryDate} ${deliveryTime}`,
        };

        try {
            const response = await fetch('/api/data/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถบันทึกข้อมูลการจองได้');
            }

            const result = await response.json();
            toast.success('ยืนยันข้อมูลการจองเรียบร้อย');

            // ตั้งค่า `bookingId` และข้อมูลสรุป
            setBookingId(result.bookingId);
            setOrderSummary(order);
            setIsOrderConfirmed(true); // อัปเดตสถานะเพื่อแสดงหน้าสรุป
        } catch (error) {
            console.error('Error:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง');
        }
    };
    const handlePaymentAndBooking = async () => {
        const stripe = await stripePromise;

        if (!stripe) {
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Stripe');
            return;
        }

        if (!selectedService || !pickupDate || !pickupTime || !formData.name || !formData.phone) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน!');
            return;
        }

        try {
            // เตรียมข้อมูลสำหรับ Stripe Session
            const items = [
                {
                    name: selectedService?.nameService || 'บริการ',
                    price: (selectedService?.price || 0) * 100,
                    quantity: 1,
                },
                ...Object.values(selectedDetail).map((detail) => ({
                    name: detail.fieldValue,
                    price: (detail.price || 0) * 100,
                    quantity: 1,
                })),
            ];

            // สร้าง Checkout Session
            const stripeSession = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    metadata: {
                        bookingId,
                        userId: session?.user?.id || '',
                    }, // ส่ง bookingId ไปยัง metadata
                }),
            });

            if (!stripeSession.ok) {
                throw new Error('ไม่สามารถสร้าง Checkout Session ได้');
            }

            const { id } = await stripeSession.json();

            // เรียก redirectToCheckout
            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (!error) {
                toast.success('กำลังดำเนินการชำระเงิน...');

                // อัปเดตสถานะการชำระเงินเมื่อชำระเงินสำเร็จ
                const paymentUpdateResponse = await fetch(`/api/order/${bookingId}/update-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId, paymentStatus: 'paid' }),
                });

                if (!paymentUpdateResponse.ok) {
                    throw new Error('ไม่สามารถอัปเดตสถานะการชำระเงินได้');
                }

                const updatedOrder = await paymentUpdateResponse.json();

                // อัปเดต `orderSummary`
                setOrderSummary((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        paymentStatus: updatedOrder?.paymentStatus || 'paid',
                    };
                });

                toast.success('การชำระเงินสำเร็จและอัปเดตสถานะเรียบร้อย');
            } else {
                toast.error('เกิดข้อผิดพลาดในการชำระเงิน');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('เกิดข้อผิดพลาดในการชำระเงิน');
        }
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, offset: number = 0) => {
        if (ref.current) {
            const targetPosition = ref.current.getBoundingClientRect().top + window.scrollY;
            const adjustedPosition = targetPosition - offset; // เลื่อนให้อยู่ในตำแหน่งที่เหมาะสม
            window.scrollTo({ top: adjustedPosition, behavior: 'smooth' });
        } else {
            console.warn('Ref is null. Ensure the element is rendered before calling scrollToSection.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <ToastContainer />
            <div className="text-center mb-6 -mt-3">
                <h1 className="text-2xl font-bold mb-2">ให้เราดูแลเสื้อผ้าของคุณอย่างครบวงจร</h1>
                <h2 className="text-md text-gray-500">ด้วยบริการ ซัก อบ รีด ด้วยความพิถีพิถัน ใส่ใจในทุกขั้นตอน</h2>
                <h2 className="text-md text-blue-800 mt-9 text-lg font-bold">เริ่มคำสั่งจอง</h2>
            </div>
            <div className="flex flex-col items-center md:flex-row fixed mt-12 -left-11 p-4" style={{ top: '50%', transform: 'translateY(-77%)' }}>
                <div className="flex flex-col space-x-4 justify-center">
                    <button
                        onClick={() => scrollToSection(serviceRef, 300)}
                        className="w-11/12 bg-white shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        บริการ
                    </button>
                    <button
                        onClick={() => scrollToSection(detailsRef, 120)}
                        className="bg-white w-11/12 shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        รายการ
                    </button>
                    <button
                        onClick={() => scrollToSection(deliveryRef, 200)}
                        className="bg-white w-11/12 shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        รับ/ส่ง
                    </button>
                    <button
                        onClick={() => scrollToSection(dateRef, 100)}
                        className="bg-white w-11/12 shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        วันที่
                    </button>
                    <button
                        onClick={() => scrollToSection(addressRef, 40)}
                        className="bg-white w-11/12 shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        ข้อมูล
                    </button>
                    <button
                        onClick={() => scrollToSection(totalRef, 40)}
                        className="bg-white w-11/12 shadow-gray-200 shadow-md ml-4 mb-2 text-blue-900 px-4 py-2 rounded-2xl hover:text-white hover:bg-blue-900"
                    >
                        สรุป
                    </button>
                </div>
            </div>
            <section className="w-7/12 max-w-4xl mb-4" ref={serviceRef}>
                <ServiceSelection
                    selectedService={selectedService}
                    onSelectService={(service) => setSelectedService(service)}
                />
            </section>
            <section className="w-7/12 max-w-4xl mb-4" ref={detailsRef}>
                <DetailSelection
                    selectedDetail={selectedDetail}
                    onSelectDetail={(details) => setSelectedDetail(details)}
                />
            </section>
            <section className="w-7/12 max-w-4xl mb-4" ref={deliveryRef}>
                <DeliverySelection
                    selectedDelivery={selectedDelivery}
                    onSelectDelivery={(delivery) => setSelectedDelivery(delivery)}
                />
            </section>
            <section className="w-7/12 max-w-4xl mb-4 flex bg-white p-6 rounded-3xl shadow-xl flex-col items-center">
                {/* วันที่รับ */}
                <section className="w-7/12 p-2 mt-2 max-w-4xl mb-4 mt-4" ref={dateRef}>
                    <label className="block text-blue-800 font-bold mb-2">วันที่รับ:</label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm border p-2"
                    />
                </section>
                {/* เวลาที่รับ */}
                <section className="w-7/12 max-w-4xl mb-4 p-2">
                    <label className="block text-blue-800 font-bold mb-2">เวลาที่รับ:</label>
                    <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="block w-full border-gray-300 p-2 rounded-md shadow-sm border"
                    />
                </section>
                {/* วันที่และเวลาที่ส่ง */}
                {deliveryDate && deliveryTime && (
                    <section className="w-7/12 max-w-4xl mb-4 p-2 rounded-md">
                        <label className="block text-blue-800 font-bold mb-2">วันที่ส่ง:</label>
                        <div className="block w-full border border-gray-600 rounded-md bg-gray-100 p-2">
                            {deliveryDate}
                        </div>
                        <label className="block text-blue-800 font-bold mb-2 mt-4">เวลาที่ส่ง:</label>
                        <div className="block w-full border border-gray-600 rounded-md bg-gray-100 p-2">
                            {deliveryTime}
                        </div>
                    </section>
                )}
            </section>
            <section className="w-7/12 max-w-4xl mb-4" ref={addressRef}>
                <AddressSelection formData={formData} onAddressChange={setFormData} />
            </section>
            {isOrderConfirmed ? (
                <section className="w-7/12 max-w-4xl mb-4 flex bg-white p-6 rounded-3xl shadow-xl flex-col items-center" ref={totalRef}>
                    <h2 className="text-blue-800 font-bold text-xl mb-4">สรุปคำสั่งซื้อ</h2>
                    <div className="w-full flex justify-between mb-2">
                        <span className="text-gray-600">บริการที่เลือก:</span>
                        <span className="text-blue-800">{orderSummary?.services?.nameService || 'ยังไม่ได้เลือกบริการ'}</span>
                    </div>
                    <div className="w-full flex justify-between mb-2">
                        <span className="text-gray-600">ค่าบริการ:</span>
                        <span className="text-blue-800">{orderSummary?.services?.price || 0} บาท</span>
                    </div>
                    {/* รายละเอียดเพิ่มเติม */}
                    {orderSummary?.details.map((detail, index) => (
                        <div key={index} className="w-full flex justify-between mb-2">
                            <span className="text-gray-600">{detail.fieldValue}:</span>
                            <span className="text-blue-800">{detail.price || 0} บาท</span>
                        </div>
                    ))}
                    {/* วันที่และเวลารับ/ส่ง */}
                    <div className="w-full flex justify-between mb-2">
                        <span className="text-gray-600">วันที่รับ:</span>
                        <span className="text-blue-800">{orderSummary?.pickupDate}</span>
                    </div>
                    <div className="w-full flex justify-between mb-2">
                        <span className="text-gray-600">วันที่ส่ง:</span>
                        <span className="text-blue-800">{orderSummary?.deliveryDate}</span>
                    </div>
                    <div className="w-full flex justify-between border-t mt-4 pt-2">
                        <span className="text-gray-800 font-bold">ยอดรวมทั้งหมด:</span>
                        <span className="text-blue-900 font-bold text-lg">{orderSummary?.totalPrice || 0} บาท</span>
                    </div>
                    {/* สถานะการชำระเงิน */}
                    <div className="w-full flex justify-between mb-2">
                        <span className="text-gray-600">สถานะการชำระเงิน:</span>
                        <span className={`text-lg font-bold ${orderSummary?.paymentStatus === 'paid' ? 'text-red-600' : 'text-green-600'}`}>
                            {orderSummary?.paymentStatus !== 'paid' ? 'จ่ายแล้ว' : 'ยังไม่ได้ชำระเงิน'}
                        </span>
                    </div>
                    {orderSummary?.paymentStatus === 'paid' && (
                        <button
                            onClick={handlePaymentAndBooking}
                            className="px-6 py-3 mb-9 rounded-lg bg-blue-900 text-white text-lg font-bold hover:bg-blue-600"
                        >
                            ชำระเงิน
                        </button>
                    )}
                </section>
            ) : (
                <button
                    onClick={handleConfirmOrder}
                    className="px-6 py-3 mb-4 rounded-lg bg-green-600 text-white text-lg font-bold hover:bg-green-500"
                >
                    ยืนยันการจอง
                </button>
            )}

        </div>
    );
};

export default BookingPage;
