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
    paymentStatus: 'pending' | 'paid';
    pickupDate: string;
    deliveryDate: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const BookingPage = () => {
    const { data: session } = useSession();
    const [selectedDetail, setSelectedDetail] = useState<{ [key: string]: DetailField }>({});
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
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
    const contactRef = useRef<HTMLDivElement>(null);
    const addressRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);
    const totalRef = useRef<HTMLDivElement>(null);

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

    const calculateTotalPrice = () => {
        let total = 0;
        if (selectedService) total += selectedService.price;
        Object.values(selectedDetail).forEach((detail) => {
            if (detail.price) total += detail.price;
        });
        return total;
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
            paymentStatus: 'pending',
            pickupDate: `${pickupDate} ${pickupTime}`,
            deliveryDate: `${deliveryDate} ${deliveryTime}`,
        };

        try {
            const items = [
                {
                    name: order.services?.nameService || 'บริการ', // ชื่อบริการ
                    price: (order.services?.price || 0) * 100, // ราคาในรูปแบบสตางค์
                    quantity: 1,
                },
                // เพิ่มรายละเอียดเพิ่มเติม
                ...order.details.map((detail) => ({
                    name: detail.fieldValue, // ชื่อรายการ
                    price: (detail.price || 0) * 100, // ราคาในรูปแบบสตางค์
                    quantity: 1,
                })),
                // เพิ่มข้อมูลการจัดส่ง
                ...(order.delivery
                    ? [
                          {
                              name: `การจัดส่ง: ${order.delivery.Delivery}`, // ชื่อการจัดส่ง
                              price: 0, // สมมติไม่มีค่าใช้จ่าย
                              quantity: 1,
                          },
                          {
                              name: `รายละเอียดการจัดส่ง: ${order.delivery.descriptionDelivery}`, // รายละเอียดการจัดส่ง
                              price: 0,
                              quantity: 1,
                          },
                      ]
                    : []),
                // เพิ่มข้อมูลผู้จอง
                ...(order.hotelName
                    ? [
                          {
                              name: `โรงแรม: ${order.hotelName}`,
                              price: 0,
                              quantity: 1,
                          },
                      ]
                    : []),
                ...(order.roomNumber
                    ? [
                          {
                              name: `หมายเลขห้อง: ${order.roomNumber}`,
                              price: 0,
                              quantity: 1,
                          },
                      ]
                    : []),
                ...(order.additionalDetails
                    ? [
                          {
                              name: `รายละเอียดเพิ่มเติม: ${order.additionalDetails}`,
                              price: 0,
                              quantity: 1,
                          },
                      ]
                    : []),
            ];
            
            const stripeSession = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });

            if (!stripeSession.ok) {  
                throw new Error('ไม่สามารถสร้าง Checkout Session ได้');
            }

            const { id } = await stripeSession.json();

            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (!error) {
                // order.paymentStatus = 'paid';
                const saveResponse = await fetch('/api/data/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order),
                });

                const saveResult = await saveResponse.json();
                console.log('Save Response:', saveResult);

                if (!saveResponse.ok) {
                    console.error('Save Error:', saveResult);
                    toast.error('เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ');
                    throw new Error('ไม่สามารถบันทึกคำสั่งซื้อได้');
                }
                toast.success('ชำระเงินสำเร็จและบันทึกคำสั่งซื้อเรียบร้อยแล้ว!');
            } else {
                toast.error('เกิดข้อผิดพลาดในการชำระเงิน');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('เกิดข้อผิดพลาดในการชำระเงินหรือบันทึกคำสั่งซื้อ');
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
            <div className="flex flex-col items-center md:flex-row fixed mt-9 -left-11 p-4" style={{ top: '50%', transform: 'translateY(-77%)' }}>
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
            <section className="w-7/12 max-w-4xl mb-4 flex bg-white p-6 rounded-3xl shadow-xl flex-col items-center" ref={totalRef}>
                <h2 className="text-blue-800 font-bold text-xl mb-4">สรุปคำสั่งซื้อ</h2>

                {/* ค่าบริการ */}
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">บริการที่เลือก:</span>
                    <span className="text-blue-800">{selectedService?.nameService || 'ยังไม่ได้เลือกบริการ'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">ค่าบริการ:</span>
                    <span className="text-blue-800">{selectedService?.price || 0} บาท</span>
                </div>

                {/* รายละเอียดเพิ่มเติม */}
                {Object.values(selectedDetail).map((detail, index) => (
                    <div key={index} className="w-full flex justify-between mb-2">
                        <div className="flex mb-2">
                            <span className="text-gray-600">{detail.fieldValue}:</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-blue-800">{detail.price || 0} บาท</span>
                        </div>
                    </div>
                ))}

                {/* วิธีการจัดส่ง */}
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">วิธีรับ/ส่ง:</span>
                    <span className="text-blue-800">{selectedDelivery?.Delivery || 'ยังไม่ได้เลือกวิธีจัดส่ง'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">รายละเอียดการจัดส่ง:</span>
                    <span className="text-blue-800">{selectedDelivery?.descriptionDelivery || 'ไม่มีข้อมูล'}</span>
                </div>

                {/* วันที่และเวลารับ/ส่ง */}
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">วันที่รับ:</span>
                    <span className="text-blue-800">{pickupDate || 'ยังไม่ได้เลือกวันที่'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">เวลาที่รับ:</span>
                    <span className="text-blue-800">{pickupTime || 'ยังไม่ได้เลือกเวลา'}</span>
                </div>
                {deliveryDate && deliveryTime && (
                    <>
                        <div className="w-full flex justify-between mb-2">
                            <span className="text-gray-600">วันที่ส่ง:</span>
                            <span className="text-blue-800">{deliveryDate}</span>
                        </div>
                        <div className="w-full flex justify-between mb-2">
                            <span className="text-gray-600">เวลาที่ส่ง:</span>
                            <span className="text-blue-800">{deliveryTime}</span>
                        </div>
                    </>
                )}

                {/* ข้อมูลเพิ่มเติม */}
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">ชื่อผู้จอง:</span>
                    <span className="text-blue-800">{formData.name || 'ยังไม่ได้กรอกข้อมูล'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">เบอร์โทร:</span>
                    <span className="text-blue-800">{formData.phone || 'ยังไม่ได้กรอกข้อมูล'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">โรงแรม:</span>
                    <span className="text-blue-800">{formData.hotelName || 'ยังไม่ได้กรอกข้อมูล'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">หมายเลขห้อง:</span>
                    <span className="text-blue-800">{formData.roomNumber || 'ยังไม่ได้กรอกข้อมูล'}</span>
                </div>
                <div className="w-full flex justify-between mb-2">
                    <span className="text-gray-600">รายละเอียดเพิ่มเติม:</span>
                    <span className="text-blue-800">{formData.additionalDetails || 'ไม่มีข้อมูล'}</span>
                </div>

                {/* ยอดรวมทั้งหมด */}
                <div className="w-full flex justify-between border-t mt-4 pt-2">
                    <span className="text-gray-800 font-bold">ยอดรวมทั้งหมด:</span>
                    <span className="text-blue-900 font-bold text-lg">{calculateTotalPrice()} บาท</span>
                </div>
            </section>

            <button
                onClick={handlePaymentAndBooking}
                className="px-6 py-3 mb-9 rounded-lg bg-blue-900 text-white text-lg font-bold hover:bg-blue-600"
            >
                ชำระเงิน
            </button>
        </div>
    );
};

export default BookingPage;
