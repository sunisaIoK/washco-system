"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import Hr from "../hr";
import { Icon } from '@iconify/react';
import { useSession } from "next-auth/react";

const Footer = () => {
    const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session
    const user = session?.user; // ข้อมูลผู้ใช้จาก session
    const isAdmin = user?.role === "admin"; // ตรวจสอบ role

  return (
    <>
     { !isAdmin && (
      <>
       <div className="min-w-screen mt-24">
        <Hr />
      </div>
      <nav className="flex justify-between bg-white">
        <div className="flex flex-col gap-4 md:text-base text-sm lg:text-lg p-6">
          <Link href="/">
            <Image
              src="/assets/images/Wash.png"
              width={150}
              height={50}
              alt="Picture of the author"
              className="flex justify-self-center mb-5 mt-1"
            />
          </Link>
          <div className="flex gap-4 color-icon mt-5">
            <Link href="https://www.facebook.com/">
              <Icon icon="fa6-brands:facebook" width={25} height={20} />
            </Link>
            <Link href="https://twitter.com/?lang=th">
              <Icon icon="fa6-brands:twitter" width={25} height={20} />
            </Link>
            <Link href="https://www.instagram.com/">
              <Icon icon="fa6-brands:instagram" width={25} height={20} />
            </Link>
            <Link href="https://www.youtube.com/">
              <Icon icon="fa6-brands:youtube" width={25} height={20} />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex mt-3 m-2">
          <div className="md:flex-row mt-3 m-2 mr-9">
            <p>เกี่ยวกับเรา</p>
            <p className="md:flex mt-3 w-[260px]">
              เราเป็นผู้ช่วยคนสำคัญในเรื่องงานซักรีดของคุณ ด้วยบริการคุณภาพระดับมืออาชีพที่พร้อมจัดการเสื้อผ้าของคุณให้กลับมาสะอาดเรียบเนี๊ยบเหมือนใหม่
            </p>
          </div>
        </div>
        <div className="hidden md:flex mt-3">
          <div className="md:flex-row mt-3 mr-9">
            <p>อัตราค่าบริการ</p>
            <p className="md:flex mt-3 w-[200px]">
              คุณสามารถดูอัตราค่าบริการ ก่อนทำการจองบริการได้ที่นี่
            </p>
          </div>
        </div>
        <div className="hidden md:flex mt-3">
          <div className="md:flex-row mt-3 mr-9">
            <p>การให้บริการ</p>
            <p className="md:flex mt-3 w-[180px]">
              คุณสามารถดูขั้นตอนการให้บริการ ก่อนทำการจองบริการได้ที่นี่
            </p>
          </div>
        </div>
        <div className="hidden md:flex mt-3">
          <div className="md:flex-row mt-3 mr-9">
            <p>ข้อมูลติดต่อเรา</p>
            <p className="md:flex mt-3 w-[200px]">เบอร์ 0-000-000-000</p>
            <p className="md:flex w-[200px]">อีเมล Wash.co@gmail.com</p>
          </div>
        </div>
      </nav>
      </>
     )}
    </>
  );
};

export default Footer;