import { NextResponse } from 'next/server'; // ใช้ Firebase Admin SDK ที่เชื่อมฐานข้อมูลไว้แล้ว
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

export const GET = async () => {
    try {
        // ดึงข้อมูลจาก Firestore
        const getOrder = new firestore();
        const result = await getOrder.getCollection(DB_COLLECTIONS.ORDERS).get();
        const data = result.docs.map((doc) => ({
            id: doc.id, // ID ของเอกสาร
            ...doc.data(), // ข้อมูลภายในเอกสาร
        }));
        return NextResponse.json({ Orders: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
    }
};