import React from 'react'
import Image from 'next/image'

const question = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-between min-w-screen mb-5">
                <div className="flex flex-col items-center p-9 justify-items-center">
                    <div className="flex flex-col md:flex-row items-center ">

                        <div className="flex flex-col md:flex-col ml-9 pl-9  ">

                            <div className="flex flex-col gap-4 image-container">
                                <Image
                                    src="/assets/images/ques/send.jpg"
                                    width={100}
                                    height={10}
                                    alt="Picture of the author"
                                    className="object-contain max-w-2xl image-1"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Image
                                    src="/assets/images/ques/luan.jpg"
                                    width={100}
                                    height={10}
                                    alt="Picture of the author"
                                    className="object-contain max-w-2xl image-2"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Image
                                    src="/assets/images/ques/iron.jpg"
                                    width={100}
                                    height={50}
                                    alt="Picture of the author"
                                    className="object-contain max-w-2xl image-3"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-col items-center p-9 ml-10">
                            <h1 className="text-xl  mb-2">คำถามที่พบบ่อย</h1>
                            <div className="md:w-2/2 mx-auto mt-1 justify-items-start">
                                <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center question'>
                                    Q.  ทางร้านซักรีดของเรารับซักผ้าประเภทใดบ้าง?
                                </p>
                                <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center '>
                                    เรารับซักผ้าทุกประเภท ไม่ว่าจะเป็นเสื้อผ้าประจำวัน ชุดทำงาน
                                    รวมถึงเสื้อผ้าที่ต้องการการดูแลพิเศษ เช่น ชุดสูทหรือชุดราตรี เพียงแจ้งล่วงหน้าเกี่ยวกับชนิดของผ้า เราจะดูแลให้ดีที่สุดค่ะ
                                </p>

                                <p className="text-md leading-relaxed flex justify-center items-center question">
                                    Q.  ทางร้านมีบริการรับ-ส่งเสื้อผ้าถึงบ้านหรือไม่?
                                </p>
                                <p className="text-md leading-relaxed flex justify-center items-center">
                                    เรามี บริการรับ-ส่งฟรี ภายในพื้นที่ที่กำหนด   หากที่อยู่ของผู้ใช้บริการอยู่นอกเขตพื้นที่ ทางเรามีการคิดค่าบริการ 10 บาท ต่อ 1 กิโลเมตร
                                </p>

                                <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center question'>
                                    Q.  หากเสื้อผ้าสูญหายหรือเสียหายในระหว่างการซัก ทางร้านรับผิดชอบอย่างไร?
                                </p>
                                <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center'>
                                    เราใส่ใจดูแลเสื้อผ้าของคุณอย่างดีที่สุด แต่หากเกิดกรณีที่เสื้อผ้าสูญหายหรือเสียหายจากการให้บริการ
                                    ทางร้านมี นโยบายการชดเชย ตามมูลค่าของเสื้อผ้า โดยลูกค้าสามารถติดต่อทีมงานของเราได้ทันที
                                    เพื่อดำเนินการตรวจสอบและแก้ไขปัญหาอย่างโปร่งใสค่ะ?
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default question