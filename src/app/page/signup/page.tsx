"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (password !== confirmpassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname, email, password }),
      });
  
      const data = await response.json();
  
      // ตรวจสอบสถานะ HTTP
      if (response.ok) {
        // ตรวจสอบข้อมูลเพิ่มเติมจาก data
        if (data.ok) {
        } else {
          toast.error('เกิดข้อผิดพลาด: ' + (data.message ));
        }
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + response.statusText);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="flex flex-col items-center min-w-screen">
        <ToastContainer />
        <form onSubmit={handleSubmit} className="flex flex-col justify-self-center mt-auto w-auto">
          <Card>
            <CardHeader>
              <div>
                <label htmlFor="name" className="text-sm">ชื่อ</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                  placeholder="กรุณากรอกชื่อ"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div >
                <label htmlFor="lastname" className="text-sm">นามสกุล</label>
                <input
                  id="lastname"
                  type="text"
                  required
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                  placeholder="กรุณากรอกนามสกุล"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent>
              <div >
                <label htmlFor="email" className="text-sm">อีเมล</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                  placeholder="กรุณากรอกอีเมล"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent>
              <div>
                <label htmlFor="password" className="text-sm">รหัสผ่าน</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent>
              <div>
                <label htmlFor="confirmpassword" className="text-sm">ยืนยันรหัสผ่าน</label>
                <input
                  id="confirmpassword"
                  type="password"
                  required
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded"
                  placeholder="กรุณายืนยันรหัสผ่าน"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-2">
            <button className="bg-blue-800 rounded-lg hover:bg-blue-900 text-white flex mb-3 p-2 w-15" type="submit" disabled={isLoading}>
              {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัคร'}
            </button>
          </div>
        </form>
        <p className="flex justify-self-center mb-9 mt-2">
          มีบัญชีอยู่แล้ว?{' '}
          <a href="/page/signin" className="text-blue-600 ml-1 hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </>
  );
}

export default SignUp;
