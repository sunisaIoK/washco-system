'use server';

import { NextRequest, NextResponse } from "next/server";
import firestore from "@/utils/database";
import DB_COLLECTIONS from "@/utils/constant";

// // สำหรับดึงข้อมูลจาก Firestore
export const GET = async () => {
    try {
        // ดึงข้อมูลจาก Firestore
        const getDetail = new firestore();
        const result = await getDetail.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).get();
        const data = result.docs.map((doc) => ({
            id: doc.id, // ID ของเอกสาร
            ...doc.data(), // ข้อมูลภายในเอกสาร
        }));

        console.log("ข้อมูลที่ดึงได้:", data); // Debug ข้อมูลที่ส่งออกไป

        return NextResponse.json({ details: data }, { status: 200 });
    } catch (error) {
        console.log("Error fetching services:", error);

        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
    }
};

// สำหรับสร้างข้อมูลใหม่ใน Firestore
export const POST = async (req: NextRequest) => {
    try {
        // ดึงข้อมูลจาก Body ของ Request
        const { id, nameDetail, fields, price } = await req.json();

        // ตรวจสอบความถูกต้องของข้อมูล
        if (!nameDetail || !fields || !price) {
            return NextResponse.json(
                { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }
        //เช็คสิทธิ์
        // สร้างเอกสารใหม่
        const createDetail = async () => {
            const newDetail = {
                nameDetail,
                fields,
                price: Number(price),
                createdAt: new Date(),
            };

            const postData = new firestore();
            const docRef = await postData.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).add(newDetail);
            return { id: docRef.id, ...newDetail };
        };

        // อัปเดตเอกสารที่มีอยู่
        const updateDetail = async () => {
            if (!id) {
                return NextResponse.json({ error: 'ID is required' }, { status: 400 });
            }

            // ตรวจสอบให้แน่ใจว่า price เป็นตัวเลข
            if (isNaN(price)) {
                return NextResponse.json({ error: 'Price must be a number' }, { status: 400 });
            }

            const updateData = new firestore();
            const docRef = updateData.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return NextResponse.json(
                    { error: `ไม่มีข้อมูลที่ตรงกับ ID: ${id}` },
                    { status: 404 }
                );
            }
            try {
                // อัปเดตเฉพาะ field price
                await docRef.update({
                    nameDetail,
                    fields,
                    price: Number(price),
                });
                return { id, ...doc.data() };
            } catch (error) {
                console.error("Error updating document:", error);
                return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
            }
        };

        // ตรวจสอบว่าเป็นการสร้างหรืออัปเดตข้อมูล
        const result = id ? await updateDetail() : await createDetail();

        return NextResponse.json(
            { message: "บันทึกข้อมูลสำเร็จ", data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error },
            { status: 500 }
        );
    }
};

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        console.log("ID ที่ได้รับ:", id); // Debug ค่า `id`

        if (!id) {
            console.log("ไม่มี ID ถูกส่งเข้ามา");
            return NextResponse.json(
                { error: "ไม่มี ID ที่ต้องการลบ" },
                { status: 400 } // Bad Request
            );
        }

        const deleteDetail = new firestore();
        const docRef = deleteDetail.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).doc(id); // อ้างถึงเอกสาร
        console.log("อ้างถึงเอกสาร Firestore:", docRef.id);

        const doc = await docRef.get();
        console.log("สถานะเอกสารใน Firestore:", doc.exists); // ตรวจสอบว่ามีเอกสารหรือไม่

        if (!doc.exists) {
            console.log(`ไม่มีเอกสารที่ตรงกับ ID: ${id}`);
            return NextResponse.json(
                { error: "ไม่มีข้อมูลนี้ในระบบ" },
                { status: 404 } // Not Found
            );
        }

        await docRef.delete(); // ลบเอกสารใน Firestore
        console.log(`ลบเอกสารสำเร็จ: ${id}`);

        return NextResponse.json(
            { message: "ลบข้อมูลสำเร็จ" },
            { status: 200 } // OK
        );
    } catch (error) {
        console.error("ข้อผิดพลาดใน API DELETE:", error); // Debug
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
            { status: 500 } // Internal Server Error
        );
    }
}

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
        const docRef = updateDetail.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).doc(id); // อ้างถึงเอกสาร
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
