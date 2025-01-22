import Introduce from '@/components/Introduce';
import Question from '@/components/Question';
import Why from '@/components/Why';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import Comment from '@/components/Comment';

export default async function Home() {
  // ดึงข้อมูล session จาก NextAuth
  const session = await getServerSession(authOptions);

  // ไม่ใช้งาน session ภายในคอมโพเนนต์
  console.log('Session Data:', session); //  log ไว้ตรวจสอบ
  return (
    <main>
      <div className="p-4" style={{ marginTop: "-7%"}}>
        <Why />
        <Introduce />
        <Comment />
        <Question />
      </div>
    </main>
  );
};


