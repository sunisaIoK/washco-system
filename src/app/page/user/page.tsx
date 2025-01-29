'use client';

import Tap from '@/components/Tap';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  name: string;
  lastname?: string;
  email: string;
}

const Profile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<User | null>(null);

  const user = session?.user;

  // Fetch user data if not available in session
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/data/user?email=${user.email}`, {
          method: 'GET',
        });

        if (!res.ok) {
          toast.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
          return;
        }

        const data = await res.json();
        setUserData(data.user); // Set user data
        setEditedData(data.user); // Prepare for editing
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [user, userData]);

  // Update user data
  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Validation for required fields
      if (!editedData?.name || !editedData?.lastname || !editedData?.email) {
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        setLoading(false); // Stop the loading indicator
        return;
      }
  
      // Make an API call to update the user data
      const res = await fetch('/api/data/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update user data');
      }
  
      const updatedUser = await res.json();
      setUserData(updatedUser.user); // Update the user data in the state
      setIsEditing(false); // Exit editing mode
      toast.success('แก้ไขข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };
  
  return (
    <main className="p-9 max-w-8xl mb-2 justify-center items-center">
      <h1 className="text-2xl font-bold">โปรไฟล์</h1>
      <div className="flex flex-col md:flex-row">
        <div className="p-9 mt-7">
          <Tap />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="p-5 mt-16 bg-white w-9/12 rounded-lg">
            {session ? (
              <div className="flex flex-col">
                {isEditing ? (
                  <>
                    <label className="text-lg">ชื่อผู้ใช้:</label>
                    <input
                      type="text"
                      value={editedData?.name || ''}
                      onChange={(e) =>
                        setEditedData({ ...editedData!, name: e.target.value })
                      }
                      className="border rounded p-2 mb-4"
                    />
                    <label className="text-lg">นามสกุล:</label>
                    <input
                      type="text"
                      value={editedData?.lastname || ''}
                      onChange={(e) =>
                        setEditedData({ ...editedData!, lastname: e.target.value })
                      }
                      className="border rounded p-2 mb-4"
                    />
                    <label className="text-lg">อีเมล:</label>
                    <input
                      type="email"
                      value={editedData?.email || ''}
                      onChange={(e) =>
                        setEditedData({ ...editedData!, email: e.target.value })
                      }
                      className="border rounded p-2 mb-4"
                    />
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg">ชื่อผู้ใช้: {userData?.name || user?.name}</p>
                    <p className="text-lg">นามสกุล: {userData?.lastname || ''}</p>
                    <p className="text-lg">อีเมล: {userData?.email || user?.email}</p>
                    {/* <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                      แก้ไขข้อมูล
                    </button> */}
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
  );
};

export default Profile;
