import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/utils/database';
import DB_COLLECTIONS from '@/utils/constant';
export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();
        console.log('Order Data Received:', orderData);

        // ตรวจสอบฟิลด์ที่จำเป็น
        if (!orderData.customerId || !orderData.totalPrice) {
            return NextResponse.json(
                { error: 'Missing required fields in order data' },
                { status: 400 } // Bad Request
            );
        }

        // เชื่อมต่อ Firestore
        const firestoreInstance = new firestore();
        const collectionRef = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER);

        // บันทึกข้อมูลลง Firestore
        const newOrder = await collectionRef.add({
            ...orderData,
            createdAt: new Date().toISOString(), // เพิ่มวันที่สร้างเอกสาร
        });

        console.log('Order Saved Successfully:', newOrder.id);
        return NextResponse.json({ id: newOrder.id, success: true }); // ส่ง ID กลับ
    } catch (error) {
        console.error('Error Saving Order:', error);
        return NextResponse.json(
            { error: 'Failed to save order', details: error },
            { status: 500 } // Internal Server Error
        );
    }
}
export const GET = async (req: NextRequest) => {
    const searchParams = new URL(req.url).searchParams;
    const customerId = searchParams.get('customerId');

    try {
        const firestoreInstance = new firestore();
        const ordersCollection = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER);

        let query;
        if (customerId) {
            query = ordersCollection.where('customerId', '==', customerId); // กรณีที่ระบุ customerId
        } else {
            query = ordersCollection; // ดึงข้อมูลทั้งหมด
        }

        const result = await query.get();
        const orders = result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ Orders: orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
  try {
      // ดึงข้อมูลจาก Body ของ Request
      const { id, isActive } = await req.json();
      //ใช้เซกเมน
      // ตรวจสอบว่ามีการส่ง ID มาหรือไม่
      if (!id) {
          return NextResponse.json(
              { error: "กรุณาระบุ ID" },
              { status: 400 } // Bad Request
          );
      }

      const updateDetail = new firestore();
      const docRef = updateDetail.getCollection(DB_COLLECTIONS.ORDER).doc(id); // อ้างถึงเอกสาร
      const doc = await docRef.get();

      // ตรวจสอบว่ามีเอกสารหรือไม่
      if (!doc.exists) {
          return NextResponse.json(
              { error: "ไม่มีข้อมูลที่ตรงกับ ID นี้" },
              { status: 404 } // Not Found
          );
      }

      // อัปเดตสถานะ isActive
      await docRef.update({
          isActive,
          updatedAt: new Date(), // เพิ่มเวลาที่อัปเดต
      });

      console.log(`อัปเดตสถานะสำเร็จ: ${id}, isActive: ${isActive}`);

      return NextResponse.json(
          { message: "อัปเดตสถานะสำเร็จ", id, isActive },
          { status: 200 } // OK
      );
  } catch (error) {
      console.error("ข้อผิดพลาดใน API PATCH:", error); // Debug
      return NextResponse.json(
          { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" },
          { status: 500 } // Internal Server Error
      );
  }
};
