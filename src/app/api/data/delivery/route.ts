'use server';

import { NextRequest, NextResponse } from 'next/server';
import firestore from '../../../../../utils/database';
import DB_COLLECTIONS from '../../../../../utils/constant';

// สร้าง Type สำหรับข้อมูล
interface Delivery {
  id?: string;
  Delivery: string;
  descriptionDelivery: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ดึงข้อมูลทั้งหมด
export const GET = async () => {
  const DeliveryDatabase = new firestore();
  const data = await DeliveryDatabase.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).get();

    try {
      const result = await data;
      const getData = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ Deliverys: getData }, { status: 200 }); // แก้ Key เป็น Deliverys
    } catch (error) {
      console.error("Error fetching Delivery:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
        { status: 500 }
      );
    }
  };
  
  // เพิ่มข้อมูลใหม่
  export const POST = async (req: NextRequest) => {
    try {
      const { Delivery, descriptionDelivery }: Delivery = await req.json();
  
      // ตรวจสอบความถูกต้องของข้อมูล
      if (!Delivery || !descriptionDelivery) {
        return NextResponse.json(
          { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
          { status: 400 }
        );
      }
  
      const newDelivery = {
        Delivery,
        descriptionDelivery,
        isActive: true,
        createdAt: new Date(),
      };
  
      const postData = new firestore();
      const docRef = await postData.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).add(newDelivery);
      return NextResponse.json(
        { message: "เพิ่มข้อมูลสำเร็จ", data: { id: docRef.id, ...newDelivery } },
        { status: 201 }
      );
    } catch (error) {
      console.error("ข้อผิดพลาดใน POST:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
        { status: 500 }
      );
    }
  };

// แก้ไขข้อมูล
export const PUT = async (req: NextRequest) => {
  try {
    const { id, Delivery, descriptionDelivery }: Delivery = await req.json();

    if (!id || !Delivery || !descriptionDelivery) {
      return NextResponse.json(
        { error: "กรุณาระบุข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const editDelivery = new firestore();
    const docRef = editDelivery.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: `ไม่มีข้อมูลที่ตรงกับ ID: ${id}` },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูล
    await docRef.update({
      Delivery,
      descriptionDelivery,
      updatedAt: new Date(),
    });

    console.log(`อัปเดตข้อมูลสำเร็จ: ${id}`);
    return NextResponse.json(
      { message: "อัปเดตข้อมูลสำเร็จ", id, Delivery, descriptionDelivery },
      { status: 200 }
    );
  } catch (error) {
    console.error("ข้อผิดพลาดใน API PUT:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
};

// ลบข้อมูล
export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID ที่ต้องการลบ" },
        { status: 400 }
      );
    }

    const deleteDelivery = new firestore();
    const docRef = deleteDelivery.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: `ไม่มีข้อมูลที่ตรงกับ ID: ${id}` },
        { status: 404 }
      );
    }

    await docRef.delete();
    console.log(`ลบข้อมูลสำเร็จ: ${id}`);
    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" }, { status: 200 });
  } catch (error) {
    console.error("ข้อผิดพลาดใน API DELETE:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
};

// อัปเดตสถานะ เช่น เปิด/ปิด
export const PATCH = async (req: NextRequest) => {
  try {
    const { id, isActive }: { id: string; isActive: boolean } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID" },
        { status: 400 }
      );
    }

    const updateDelivery = new firestore();
    const docRef = updateDelivery.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: `ไม่มีข้อมูลที่ตรงกับ ID: ${id}` },
        { status: 404 }
      );
    }

    await docRef.update({
      isActive,
      updatedAt: new Date(),
    });

    console.log(`อัปเดตสถานะสำเร็จ: ${id}, isActive: ${isActive}`);
    return NextResponse.json(
      { message: "อัปเดตสถานะสำเร็จ", id, isActive },
      { status: 200 }
    );
  } catch (error) {
    console.error("ข้อผิดพลาดใน API PATCH:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" },
      { status: 500 }
    );
  }
};