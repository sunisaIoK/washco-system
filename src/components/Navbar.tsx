"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Dropdown from "./Dropdown";

function Navbar() {
  const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session
  const router = useRouter();

  const handleSignOut = () => {
    signOut(); // ใช้ next-auth สำหรับออกจากระบบ
    router.push("/page/signin");
  };

  const user = session?.user; // ข้อมูลผู้ใช้จาก session
  const isAdmin = user?.role === "admin"; // ตรวจสอบ role
  if(isAdmin){
    return null
  }

  return (
    <nav className="Navbar flex justify-between bg-blue-900 mb-20 shadow-xl ">
      {/* โลโก้ */}
      <div className="flex p-2">
        {user && !isAdmin && (
          <Link href="/">
            <Image
              src="/assets/images/LogoClean.png"
              width={170}
              height={50}
              alt="Logo"
              className="flex justify-self-center mb-1 mt-1 ml-9"
            />
          </Link>
        )}
      </div>

      {/* เมนูกลาง */}
      <div className="hidden md:flex gap-4 mt-9 p-4 m-5 ml-20 text-ss">
        {user && user.role === "user" && (
          <>
            <a href="/page/sop" className="text-white navButton">
              ขั้นตอนการทำงาน
            </a>
            <a href="/page/rate" className="text-white navButton">
              อัตราค่าบริการ
            </a>
            <a href="/page/user/book" className="text-white navButton">
              จองบริการ
            </a>
            {/* <a href="/page/user/history" className="text-white navButton">
              ประวัติการจอง
            </a> */}
          </>
        )}
      </div>

      {/* เมนูด้านขวา */}
      <div className="hidden md:flex gap-4 mt-8 items-center m-5 p-4">
        {!user ? (
          // ผู้ใช้ยังไม่ได้ล็อกอิน
          <>
            <Link href="/page/signin" className="text-white navButton">
              เข้าสู่ระบบ
            </Link>
            <Link href="/page/signup" className="text-white navButton">
              สมัครสมาชิก
            </Link>
          </>
        ) : (
          // ผู้ใช้ล็อกอินแล้ว
          <>
            <Dropdown />
            {/* {!isAdmin && 
            <span className="text-white text-lg font-bold profile">{user.email?.split("@")[0]}
            </span>}
<Dropdown />*/}
            {/* {!isAdmin &&(
              <button
              onClick={handleSignOut}
              className=" signout"
            >
              ออกจากระบบ
            </button>
            )}  */}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
