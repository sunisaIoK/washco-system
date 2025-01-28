'use client'

import Tap from '@/components/Tap'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface User {
  name: string,
  lastname: string,
  email: string
  password: string
}

const Profile = () => {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // สำหรับควบคุมโหมดแก้ไข
  const [editedData, setEditedData] = useState<User | null>(null) // เก็บข้อมูลที่ถูกแก้ไข

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/auth/user', {
          method: 'GET',
        })
        if (!res.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลได้');
        }
        const data = await res.json()
        setUserData(data.user)
        setEditedData(data.user) // ตั้งค่าเริ่มต้นสำหรับแก้ไข
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  // ฟังก์ชันอัปเดตข้อมูล
  const handleUpdate = async () => {
    try {
      setLoading(true);

      // ตรวจสอบว่าข้อมูลครบถ้วน
      if (!editedData?.name || !editedData?.email) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const res = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
      }

      const updatedUser = await res.json();
      setUserData(updatedUser.user); // ตั้งค่าใหม่หลังการอัปเดต
      setIsEditing(false); // ปิดโหมดแก้ไข
      alert('อัปเดตข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='p-9 max-w-8xl mb-2 justify-center items-center'>
      <h1 className='text-2xl font-bold' style={{ marginTop: '-3.4rem' }}>โปรไฟล์</h1>
      <div className='flex flex-col md:flex-row'>
        <div className='p-9 mt-7'>
          <Tap />
        </div>
        {loading ? (
          <div className='flex items-center justify-center h-screen'>
            <div className='animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500'></div>
          </div>
        ) : (
          <div className='p-5 mt-16 bg-white w-9/12 rounded-lg'>
            {session ? (
              <div className='flex flex-col'>
                {isEditing ? (
                  <>
                    <label className='text-lg'>ชื่อผู้ใช้:</label>
                    <input
                      type='text'
                      value={editedData?.name || ''}
                      onChange={(e) => setEditedData({ ...editedData!, name: e.target.value })}
                      className='border rounded p-2 mb-4'
                    />
                    <label className='text-lg'>อีเมล:</label>
                    <input
                      type='email'
                      value={editedData?.email || ''}
                      onChange={(e) => setEditedData({ ...editedData!, email: e.target.value })}
                      className='border rounded p-2 mb-4'
                    />
                    <button
                      onClick={handleUpdate}
                      className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className='bg-gray-500 text-white px-4 py-2 rounded'
                    >
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <>
                    <p className='text-lg'>ชื่อผู้ใช้: {userData?.name || session.user.name}</p>
                    <p className='text-lg'>อีเมล: {userData?.email || session.user.email}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
                    >
                      แก้ไขข้อมูล
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p>กรุณาเข้าสู่ระบบ</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default Profile
