import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/utils/database';
import DB_COLLECTIONS from '@/utils/constant';
import { v4 as uuidv4 } from 'uuid'; // ใช้ UUID สำหรับสร้าง ID ที่ไม่ซ้ำกัน

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

        // สร้าง Booking ID (ใช้ UUID)
        const bookingId = uuidv4(); // หรือสร้างตามที่คุณต้องการ เช่น "ORDER-XXXX"

        // เชื่อมต่อ Firestore
        const firestoreInstance = new firestore();
        const collectionRef = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER);

        // บันทึกข้อมูลลง Firestore พร้อมเพิ่ม Booking ID
        const newOrder = await collectionRef.add({
            bookingId, // เพิ่ม Booking ID
            ...orderData,
            createdAt: new Date().toISOString(), // เพิ่มวันที่สร้างเอกสาร
        });
        console.log('บันทึกข้อมุล:', { bookingId, ...orderData });

        console.log('Order Saved Successfully:', newOrder.id);
        return NextResponse.json({ id: newOrder.id, bookingId, success: true }); // ส่ง ID และ Booking ID กลับ
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
    const bookingId = searchParams.get('bookingId'); // ดึง bookingId จาก URL

    try {
        const firestoreInstance = new firestore();
        const ordersCollection = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER);

        let query;
        if (customerId) {
            query = ordersCollection.where('customerId', '==', customerId); // กรณีที่ระบุ customerId
        } else {
            query = ordersCollection; // ดึงข้อมูลทั้งหมด
        }
        if (bookingId) {
            query = ordersCollection.where('bookingId', '==', bookingId); // ค้นหาโดย bookingId
        } else {
            query = ordersCollection; // ดึงข้อมูลทั้งหมด หากไม่มี bookingId
        }

        const result = await query.get();
        if (result.empty) {
            return NextResponse.json({ error: 'ไม่พบข้อมูลที่ต้องการ' }, { status: 404 });
        }

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
export const PUT = async (req: NextRequest) => {
    try {
        const { bookingId, paymentStatus } = await req.json();

        if (!bookingId || !paymentStatus) {
            console.error('Invalid request payload:', { bookingId, paymentStatus });
            return NextResponse.json(
                { error: 'กรุณาระบุ Booking ID และสถานะการชำระเงิน' },
                { status: 400 }
            );
        }

        const firestoreInstance = new firestore();
        const docRef = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER).doc(bookingId);

        const doc = await docRef.get();
        if (!doc.exists) {
            console.error('Document not found for Booking ID:', bookingId);
            return NextResponse.json(
                { error: 'ไม่พบเอกสารที่ตรงกับ Booking ID' },
                { status: 404 }
            );
        }

        console.log('Before update:', doc.data());

        // อัปเดต `paymentStatus` เป็น `paid`
        await docRef.update({
            paymentStatus,
            updatedAt: new Date().toISOString(),
        });

        console.log('Updated Firestore Document:', { bookingId, paymentStatus });

        return NextResponse.json(
            { message: 'อัปเดตสถานะสำเร็จ', bookingId, paymentStatus },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' },
            { status: 500 }
        );
    }
};

