'use client';

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";

// type Props = {
//     children?: React.ReactNode;
// };
const Tab = () => {
    const router = useRouter();
    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session

    // const user = session?.user; // ข้อมูลผู้ใช้จาก session
    // const isAdmin = user?.role === "admin"; // ตรวจสอบ role

    const handleSignOut = () => {
        signOut(); // ใช้ next-auth สำหรับออกจากระบบ
        router.push("/");
    };

    return (
        <section className="flex ">
            {/* {isAdmin && ( */}
            <>
                <div className="flex flex-col rounded-lg bg-white p-9">
                    {/* <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <button
                            className="text-white hover:text-blue-950 p-2 rounded-lg"
                        >
                            <Icon icon="mdi:shield-account" className="w-8 ml-5 h-8 color-icon" />
                        </button>
                    </div> */}
                    <div className="flex flex-col md:flex-row">
                        <nav className="mt-4 space-y-4">
                            <div className="flex flex-col md:flex-row">
                                <a href="/page/user/history" className="flex items-center">
                                    <Icon icon="mdi:file-document" className="w-8 h-8 color-icon hover:text-blue-800" />
                                    <p className="ml-2 text-blue-950 hover:text-blue-800">ประวัติการจอง</p>
                                </a>
                            </div>
                            <div className="flex flex-col md:flex-row" style={{ marginTop: "19px" }}>
                                <a href="/page/rate" className="flex items-center">
                                    <Icon icon="mdi:money" className="w-8 h-8 color-icon hover:text-blue-800" />
                                    <p className="ml-2 text-blue-950 hover:text-blue-800">อัตราค่าบริการ</p>
                                </a>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <a href="/page/user/history" className="flex items-center">
                                    <Icon icon="mdi:logout" className="w-8 h-8 color-icon hover:text-red-500" />
                                    <SidebarItem
                                        onClick={handleSignOut}
                                    />
                                    <p className="-ml-8 text-blue-950 hover:text-red-600">ออกจากระบบ</p>
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </>
            {/* )} */}
        </section>
    );
};

export default Tab;

// Sidebar Item Component
type SidebarItemProps = {
    href?: string;
    onClick?: () => void;
    isLogout?: boolean;
};

const SidebarItem = ({
    href,
    onClick,
    isLogout,
}: SidebarItemProps) => {
    const ItemTag = href ? "a" : "button";
    return (
        <>
            <ItemTag
                href={href}
                onClick={onClick}
                className={`flex items-center mx-2 space-x-4 p-3 rounded-lg transition ${isLogout
                    ? "hover:bg-red-600 hover:text-red-100"
                    : "hover:bg-blue-100 hover:text-red-950"
                    }`}
            >
            </ItemTag>
        </>
    );
};