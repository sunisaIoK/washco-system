'use client';

import { useState} from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { signOut, useSession } from "next-auth/react";

type Props = {
    children?: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession(); // ใช้เพื่อดึงข้อมูล Session

    const user = session?.user; // ข้อมูลผู้ใช้จาก session
    const isAdmin = user?.role === "admin"; // ตรวจสอบ role

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSignOut = () => {
        signOut(); // ใช้ next-auth สำหรับออกจากระบบ
        router.push("/");
    };

    return (
        <section className="flex h-screen">
            {isAdmin && (
                <>
                    <aside
                        className={`fixed top-0 h-full bg-blue-900 text-gray-100 transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? "w-64" : "w-20"
                            }`}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <button
                                onClick={toggleSidebar}
                                className="text-white focus:outline-none hover:bg-blue-100 hover:text-blue-950 p-2 rounded-lg"
                            >
                                <Icon icon="mdi:shield-account" className="w-8 h-8" />
                            </button>
                        </div>
                        <nav className="mt-4 space-y-4">
                            {menuItems.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    isSidebarOpen={isSidebarOpen}
                                />
                            ))}
                            <SidebarItem
                                onClick={handleSignOut}
                                icon="mdi:logout"
                                label="ออกจากระบบ"
                                isSidebarOpen={isSidebarOpen}
                                isLogout
                            />
                        </nav>
                    </aside>

                    <main
                        className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-64" : "ml-20"
                            } p-6 transition-all duration-300`}
                    >
                        {children}
                    </main>
                </>
            )}
        </section>
    );
};

export default Sidebar;

// เมนูข้อมูลสำหรับ Navigation
const menuItems = [
    { href: "/page/admin/dashboard", icon: "mdi:home", label: "แดชบอร์ด" },
    { href: "/page/data/service", icon: "mdi:server", label: "จัดการข้อมูลบริการ" },
    { href: "/page/data/detail", icon: "mdi:file-document-edit", label: "จัดการข้อมูลรายละเอียด" },
    { href: "/page/admin/dashboard/list", icon: "mdi:bell", label: "รายการคำสั่งซื้อ" },
];

// Sidebar Item Component
type SidebarItemProps = {
    href?: string;
    icon: string;
    label: string;
    isSidebarOpen: boolean;
    onClick?: () => void;
    isLogout?: boolean;
};

const SidebarItem = ({
    href,
    icon,
    label,
    isSidebarOpen,
    onClick,
    isLogout,
}: SidebarItemProps) => {
    const ItemTag = href ? "a" : "button";
    return (
        <li>
            <ItemTag
                href={href}
                onClick={onClick}
                className={`flex items-center mx-2 space-x-4 p-3 rounded-lg transition ${isLogout
                    ? "hover:bg-red-600 hover:text-red-100"
                    : "hover:bg-blue-100 hover:text-blue-950"
                    }`}
            >
                <Icon icon={icon} className="w-6 h-6 ml-1" />
                {isSidebarOpen && <span>{label}</span>}
            </ItemTag>
        </li>
    );
};