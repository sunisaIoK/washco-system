'use client';

import React from 'react';
import Image from 'next/image';

const SopPage = () => {
    return (
        <main className="p-8 min-w-screen mb-2 justify-center items-center" style={{ marginTop: '-9%'}}>
            <div className="flex justify-center items-center mr-24 px-3 ml-24 pl-2">
                <h1 className="text-2xl font-bold mb-9">ขั้นตอนการให้บริการ</h1>
            </div>
            <div className="workflow-container mt-5">
                {/* แถวบน */}
                <div className="ml-96 flex flex-row items-center" style={{marginLeft: "40%"}}>
                    {/* จอง */}
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className='step step-top p-3'>
                            <div className="step-circle font-bold text-3xl text-blue-500 mb-2">1</div>
                            <div className="font-bold text-2xl text-blue-900 mb-2">จอง</div>
                            <p>เลือกบริการที่คุณต้องการ เช่น บริการในราคาประหยัด บริการเร่งด่วนในราคาสุดคุ้ม และการซัก อบ รีด พร้อมชำระค่าบริการ</p>
                        </div>
                        <div className=' '>
                            <Image src="/assets/images/serviceRead/booking.png" alt="booking" width={400} height={200} className="object-contain max-w-2xl" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center" style={{marginLeft: "-50%"}}>
                    <div className=' '>
                        <Image src="/assets/images/serviceRead/receivecloth.png" alt="booking" width={400} height={200} className="object-contain max-w-2xl" />
                    </div>
                    {/* ซัก */}
                    <div className='step step-top p-3'>
                        <div className="step-circle font-bold text-3xl text-blue-500 mb-2">2</div>
                        <div className="font-bold text-2xl text-blue-900 mb-2">รับ</div>
                        <p>พนักงานจะนำเสื้อผ้าของคุณมาทำความสะอาดตามความต้องการที่คุณต้องการ</p>
                    </div>
                </div>
                {/* แถวล่าง */}
                <div className=" flex flex-row items-center justify-between" style={{marginLeft: "40%"}}>
                    {/* รับ */}
                    <div className='step step-top p-3'>
                        <div className="step-circle font-bold text-3xl text-blue-500 mb-2">3</div>
                        <div className="font-bold text-2xl text-blue-900 mb-2">ซัก</div>
                        <p>ทางเรามีบริการรับเสื้อผ้าฟรี ตามจุดที่ลูกค้าสะดวกและต้องการ</p>
                    </div>
                    <div className=''>
                        <Image src="/assets/images/serviceRead/laundry.png" alt="booking" width={400} height={200} className="object-contain max-w-2xl" />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between" style={{marginLeft: "-50%"}}>
                    <div className=''>
                        <Image src="/assets/images/serviceRead/sendback.png" alt="booking" width={400} height={200} className="object-contain max-w-2xl" />
                    </div>
                    {/* ส่ง */}
                    <div className='step step-top p-3'>
                        <div className="step-circle font-bold text-3xl text-blue-500 mb-2">4</div>
                        <div className="font-bold text-2xl text-blue-900 mb-2">ส่ง</div>
                        <p> เมื่อเสร็จสิ้นการซักรีด เสื้อผ้าจะถูกจัดส่งกลับตามช่วงเวลาที่คุณได้เลือกไว้</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SopPage;