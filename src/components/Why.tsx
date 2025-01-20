import React from 'react'
import Image from 'next/image'

const Why = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-between min-w-screen p-9 mb-5">
        <div className="flex flex-col items-center p-9">
          <div className="flex flex-col md:flex-row items-center ">

            <div className='mx-auto ml-9' >
              <Image src="/assets/images/why/why.jpg"
                width={480} 
                height={100}
                alt="Picture of the author"
                className="object-contain max-w-2xl ml-9" />
            </div>

            <div className="md:w-1/2 mx-auto mt-1 p-9">
              <h1 className="text-3xl font-bold mb-2">ทำไมต้องจองบริการซักผ้า?</h1>
              <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center'>
                เพราะเราเข้าใจว่าคุณมีเวลาจำกัด และงานซักผ้าอาจเป็นเรื่องยุ่งยาก
              </p>
              <p className="text-md leading-relaxed flex justify-center items-center">
                ที่กินเวลามากเกินไปในชีวิตประจำวันไม่ว่าจะเป็นการ
                จัดการกับคราบที่ล้างออกยากเสื้อผ้าที่ต้องการดูแลเป็นพิเศษหรือ
                เพียงแค่เสื้อผ้ากองโตที่รอการจัดการ
              </p>
              <p className='line-clamp-3 text-md leading-relaxed flex justify-center items-center'>
                บริการซักผ้าของเราคือคำตอบที่ช่วยแก้ปัญหาเหล่านี้ให้คุณ ไม่ต้อง
              </p>
              <p className='line-clamp-3 text-md leading-relaxed'>
                เสียเวลาซักผ้าด้วยตัวเอง ไม่ต้องเผชิญกับอากาศร้อนหรือ
                เครื่องซักผ้าที่กินไฟเกินพอดี เพียงแค่จองบริการซักรีดจากเรา คุณก็สามารถใช้เวลาไปทำสิ่งที่สำคัญหรือเติมเต็มวันพักผ่อนได้
                อย่างสบายใจ
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Why

