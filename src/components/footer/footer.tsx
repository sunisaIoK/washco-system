"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import Hr from "@/components/hr";
import { Icon } from '@iconify/react';
import { useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session
  const user = session?.user; // ข้อมูลผู้ใช้จาก session
  const isAdmin = user?.role === "admin"; // ตรวจสอบ role

  return (
    <>
      {!isAdmin && (
        <>
          <nav className="flex justify-between bg-blue-900 shadow-8xl">
            <div className="flex flex-col gap-4 md:text-base text-sm lg:text-lg p-6">
              <Link href="/">
                <Image
                  src="/assets/images/LogoClean.png"
                  width={150}
                  height={50}
                  alt="Picture of the author"
                  className="flex justify-self-center mb-5 mt-1"
                />
              </Link>
              <div className="flex gap-4 color-icon mt-5">
                <Link href="https://www.facebook.com/">
                  <Icon icon="fa6-brands:facebook" className="text-white hover:text-gray-400" width={25} height={20} />
                </Link>
                <Link href="https://twitter.com/?lang=th">
                  <Icon icon="fa6-brands:twitter" className="text-white hover:text-gray-400" width={25} height={20} />
                </Link>
                <Link href="https://www.instagram.com/">
                  <Icon icon="fa6-brands:instagram" className="text-white hover:text-gray-400" width={25} height={20} />
                </Link>
                <Link href="https://www.youtube.com/">
                  <Icon icon="fa6-brands:youtube" className="text-white hover:text-gray-400" width={25} height={20} />
                </Link>
              </div>
            </div>

            <div className="hidden md:flex mt-3 m-2 text-center">
              <div className="md:flex-row mt-3 m-2 mr-9">
                <p className=" text-white ">เกี่ยวกับเรา</p>
                <Hr />
                <p className="md:flex w-[260px]  text-white">
                  เราเป็นผู้ช่วยคนสำคัญในเรื่องงานซักรีดของคุณ ด้วยบริการคุณภาพระดับมืออาชีพที่พร้อมจัดการเสื้อผ้าของคุณให้กลับมาสะอาดเรียบเนี๊ยบเหมือนใหม่
                </p>
              </div>
            </div>
            <div className="hidden md:flex mt-3 text-center">
              <div className="md:flex-row mt-3 mr-9">
                <p className=" text-white text-center">อัตราค่าบริการ</p>
                <Hr />
                <p className="w-[200px]  text-white">
                  คุณสามารถดู
                  <a href="/page/rate" className="text-yellow-500 hover:text-blue-400">อัตราค่าบริการ</a>
                  ก่อนทำการจองบริการได้ที่นี่
                </p>
              </div>
            </div>
            <div className="hidden md:flex mt-3 text-center">
              <div className="md:flex-row mt-3 mr-9">
                <p className=" text-white text-center">การให้บริการ</p>
                <Hr />
                <p className="w-[180px] text-white">
                  คุณสามารถดู
                  <a href="/page/sop" className="text-yellow-500 hover:text-blue-400">ขั้นตอนการทำงาน</a>
                  ก่อนทำการจองบริการได้ที่นี่
                </p>
              </div>
            </div>
            <div className="hidden md:flex mt-3 text-center">
              <div className="md:flex-row mt-3 mr-9">
                <p className=" text-white text-center">ข้อมูลติดต่อเรา</p>
                <Hr />
                <p className="md:flex w-[200px] text-white">เบอร์ 0-000-000-000</p>
                <p className="md:flex w-[200px] text-white">อีเมล Wash.co@gmail.com</p>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Footer;