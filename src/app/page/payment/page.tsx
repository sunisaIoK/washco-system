'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/page/user/history'); // Redirect to booking history page
    }, 3000); // Redirect after 3 seconds
  }, [router]);

  return <div>ชำระเงินสำเร็จ กำลังกลับไปยังหน้าประวัติการจอง...</div>;
};

export default SuccessPage;
