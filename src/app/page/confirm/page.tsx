// pages/success.tsx
import React from 'react';
import { useRouter } from 'next/router';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query; // ดึง session_id จาก URL query

  // ฟังก์ชันสำหรับดึงข้อมูล session เพื่อแสดง
  const fetchSessionDetails = async () => {
    if (session_id) {
      const response = await fetch(`/api/checkout-session?sessionId=${session_id}`);
      const session = await response.json();
      console.log(session); // แสดงรายละเอียดใน console
    }
  };

  React.useEffect(() => {
    fetchSessionDetails();
  }, [session_id]);

  return (
    <div>
      <h1>การชำระเงินสำเร็จ!</h1>
      <p>ขอบคุณที่ชำระเงิน.</p>
      {/* สามารถแสดงรายละเอียดเพิ่มเติมเกี่ยวกับการชำระเงินที่นี่ */}
    </div>
  );
};

export default SuccessPage;