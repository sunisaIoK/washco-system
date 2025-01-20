import React from 'react'
import Image from 'next/image'


const Introduce = () => {
    return (
        <>
            <div className=' flex flex-col items-center justify-between min-w-screen mb-9 mt-9 '>
                <div className="flex flex-col items-center ">
                    <div className='flex flex-col items-center '>

                        <div className='max-w-2xl mx-auto justify-items-center p-2 mb-3'>
                            <h1 className='text-2xl font-bold'>
                                เราพร้อมดูแลเสื้อผ้าของคุณอย่างครบวงจร
                            </h1>
                        </div>

                        <div className="flex flex-col items-center mb-5 mt-3">
                            <div className="flex gap-20">
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/dryer.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/iron.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/shirt.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/dryer-alt.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/no-iron.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                                <div className="flex justify-center items-center  p-2">
                                    <Image
                                        src="/assets/images/Icon/shirt-long.png"
                                        width={50}
                                        height={10}
                                        alt="Picture of the author"
                                        className="object-contain max-w-2xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div  className="flex justify-center items-center mb-9">
                            <p className='max-w-2xl mx-auto  text-center p-2'>
                                ด้วยบริการ ซัก อบ รีด ด้วยความพิถีพิถัน ใส่ใจในทุกขั้นตอน
                                ตั้งแต่กระบวนการซักอบแห้งสำหรับเนื้อผ้าทุกรูปแบบ ไปจนถึงการรีดที่ช่วยเพิ่มความมั่นใจในทุกการสวมใส่
                                และเพื่อความสะดวกสบายสูงสุด เรายังมีบริการ รับ-ส่งเสื้อผ้าถึงหน้าบ้าน ไม่ต้องเสียเวลาเดินทาง
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Introduce


