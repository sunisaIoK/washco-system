'use server';

import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../utils/database";
import DB_COLLECTIONS from "../../../../../utils/constant";

// สำหรับดึงข้อมูลจาก Firestore
export const GET = async () => {
  try {
    // ดึงข้อมูลจาก Collection 'Service'
    const getService = new firestore();
    const result = await getService.getCollection(DB_COLLECTIONS.SERVICE).get();
    const data = result.docs.map((doc) => ({
      id: doc.id, // ID ของเอกสาร
      ...doc.data(), // ข้อมูลภายในเอกสาร
    }));

    console.log("ข้อมูลที่ดึงได้:", data); // Debug ข้อมูลที่ส่งออกไป

    return NextResponse.json({ services: data }, { status: 200 });
  } catch (error) {
    console.log("Error fetching services:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
};

// เพิ่มหรือแก้ไขข้อมูล
export const POST = async (req: NextRequest) => {
  try {
    const { id, nameService, description, hour, price } = await req.json();
    if (!nameService || !description || !hour || !price) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const newService = {
      nameService,
      description,
      hour: Number(hour),
      price: Number(price),
      isActive: true,
      updatedAt: new Date(),
    };

    if (id) {
      // แก้ไขข้อมูล
      const editService = new firestore();
      const docRef = editService.getCollection(DB_COLLECTIONS.SERVICE).doc(id);
      await docRef.update(newService);
      return NextResponse.json({ message: 'อัปเดตข้อมูลสำเร็จ' }, { status: 200 });
    } else {
      // เพิ่มข้อมูลใหม่
      const addService = new firestore();
      await addService.getCollection(DB_COLLECTIONS.SERVICE).add(newService);
      return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จ' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving service:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
};

// เปลี่ยนสถานะเปิด/ปิด
export const PATCH = async (req: NextRequest) => {
  try {
    const { id, isActive } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'กรุณาระบุ ID' }, { status: 400 });
    }

    const updateService = new firestore();
    const docRef = updateService.getCollection(DB_COLLECTIONS.SERVICE).doc(id);
    await docRef.update({ isActive });
    return NextResponse.json({ message: 'อัปเดตสถานะสำเร็จ' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' }, { status: 500 });
  }
};

// ลบข้อมูล
export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'กรุณาระบุ ID' }, { status: 400 });
    }

    const deleteService = new firestore();
    const docRef = deleteService.getCollection(DB_COLLECTIONS.SERVICE).doc(id);
    await docRef.delete();
    return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' }, { status: 500 });
  }
};