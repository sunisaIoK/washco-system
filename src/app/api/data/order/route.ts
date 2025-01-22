import { NextRequest, NextResponse } from 'next/server'; // ใช้ Firebase Admin SDK ที่เชื่อมฐานข้อมูลไว้แล้ว
import firestore from '../../../../../utils/database';
import DB_COLLECTIONS from '../../../../../utils/constant';

export async function POST(req: Request) {
  try {
    const orderData = await req.json(); // อ่านข้อมูลคำสั่งซื้อจากคำขอ
    // console.log(orderData);

    // เพิ่มข้อมูลคำสั่งซื้อไปยัง "orders" collection ใน Firestore
    const ordersCollection = new firestore();
    const newOrder = await ordersCollection.getCollection(DB_COLLECTIONS.ORDERS).add({
      ...orderData, // บันทึกข้อมูลทั้งหมดที่ส่งมา
      createdAt: new Date().toISOString(), // เพิ่มวันที่บันทึกคำสั่งซื้อ
    });

    return NextResponse.json({ id: newOrder.id, success: true }); // ตอบกลับ ID คำสั่งซื้อ
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

export const GET = async (req: { url: string | URL; }) => {
    const searchParams = new URL(req.url).searchParams;
    const customerId = searchParams.get('customerId');

    try {
        // ดึงข้อมูลจาก Firestore
        const getOrder = new firestore();
        const ordersCollection = getOrder.getCollection(DB_COLLECTIONS.ORDERS);
        
        // สร้าง query สำหรับคำสั่งซื้อของลูกค้า
        let query 

        if (customerId) {
            query = ordersCollection.where('customerId', '==', customerId); // ใช้ where ใน query
        }else{
          query = ordersCollection;
        }

        const result = await query.get(); // ดึงข้อมูลจาก query
        const data = result.docs.map((doc) => ({
            id: doc.id, // ID ของเอกสาร
            ...doc.data(), // ข้อมูลภายในเอกสาร
            detail: doc.data().detail, // ต้องแน่ใจว่ารวม field นี้
        }));
        console.log(data);
        
        
        return NextResponse.json({ Orders: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
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
      const docRef = updateDetail.getCollection(DB_COLLECTIONS.ORDERS).doc(id); // อ้างถึงเอกสาร
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
