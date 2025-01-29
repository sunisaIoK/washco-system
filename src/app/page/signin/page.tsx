"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const elements = e.currentTarget.elements as FormElements;
            const email = elements.email.value;
            const password = elements.password.value;

            console.log("data", { email, password });

            // เรียก next-auth signIn(Provider) -> credentials
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
            } else {
                toast.success("เข้าสู่ระบบสำเร็จ");

                setTimeout(async () => {
                    // ดึงข้อมูล session เพื่อตรวจสอบ role
                    const sessionResponse = await fetch("/api/auth/session");
                    const session = await sessionResponse.json();
                    if (password !== session?.user?.password) {
                        router.push("/page/signin");
                    }

                    if (session?.user?.role === "admin") {
                        router.push("/page/admin/dashboard");
                    } else {
                        router.push("/");
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-w-screen">
            <form onSubmit={handleSubmit} className="flex flex-col w-auto">
                {error && (
                    <div className="text-red-500 bg-red-100 rounded-xl text-center mb-4 p-2">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-500 bg-emerald-100 rounded-xl text-center mb-4 p-2">
                        {success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <div className="mb-2">
                            <label htmlFor="email" className="text-sm">อีเมล</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                                placeholder="กรุณากรอกอีเมล"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2">
                            <label htmlFor="password" className="text-sm">รหัสผ่าน</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                                placeholder="กรุณากรอกรหัสผ่าน"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center text-center mt-3">
                    <button
                        className="bg-blue-800 rounded-lg text-white p-2 hover:bg-blue-900"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "เข้าสู่ระบบ"}
                    </button>
                </div>
            </form>

            <p className="mt-2">
                ยังไม่มีบัญชี?
                <a href="/page/signup" className="text-blue-600 ml-1 hover:underline">
                    สมัครสมาชิก
                </a>
                เลย
            </p>
        </div>
    );
}

export default SignInPage;
