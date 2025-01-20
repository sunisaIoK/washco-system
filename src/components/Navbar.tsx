"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session
  const router = useRouter();

  const handleSignOut = () => {
    signOut(); // ใช้ next-auth สำหรับออกจากระบบ
    router.push("/page/signin");
  };

  const user = session?.user; // ข้อมูลผู้ใช้จาก session
  const isAdmin = user?.role === "admin"; // ตรวจสอบ role

  return (
    <nav className="Navbar flex justify-between bg-white">
      {/* โลโก้ */}
      <div className="flex gap-4 md:text-base text-sm lg:text-lg p-2">
        {user && !isAdmin && (
          <Link href="/">
            <Image
              src="/assets/images/Wash.png"
              width={150}
              height={50}
              alt="Logo"
              className="flex justify-self-center mb-1 mt-1"
            />
          </Link>
        )}
      </div>

      {/* เมนูกลาง */}
      <div className="hidden md:flex gap-4 mt-9 p-4 m-5 text-ss">
        {user && user.role === "user" && (
          <>
            <a href="/page/sop" className="text-black-600 border process">
              ขั้นตอนการทำงาน
            </a>
            <a href="/page/rate" className="text-black-600 border price">
              อัตราค่าบริการ
            </a>
            <a href="/page/user/booking" className="text-black-600 border reserve">
              จองบริการ
            </a>
            <a href="/page/user/history" className="text-black-600 border history">
              ประวัติการจอง
            </a>
          </>
        )}
      </div>

      {/* เมนูด้านขวา */}
      <div className="hidden md:flex gap-4 mt-8 items-center m-5 p-4">
        {!user ? (
          // ผู้ใช้ยังไม่ได้ล็อกอิน
          <>
            <Link href="/page/signin" className="text-black-600 border signin">
              เข้าสู่ระบบ
            </Link>
            <Link href="/page/signup" className="text-black-600 border signup">
              สมัครสมาชิก
            </Link>
          </>
        ) : (
          // ผู้ใช้ล็อกอินแล้ว
          <>
            {!isAdmin && <span>{user.email?.split("@")[0]}</span>}
            {!isAdmin &&(
              <button
              onClick={handleSignOut}
              className="text-black-600 border signout"
            >
              ออกจากระบบ
            </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
