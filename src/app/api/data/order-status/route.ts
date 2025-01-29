import DB_COLLECTIONS from "@/utils/constant";
import firestore from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const searchParams = new URL(req.url).searchParams;
    const bookingId = searchParams.get('bookingId');

    // ตรวจสอบว่า bookingId ถูกส่งมาหรือไม่
    if (!bookingId) {
        return NextResponse.json(
            { error: 'Booking ID is required' },
            { status: 400 }
        );
    }

    try {
        const firestoreInstance = new firestore();
        const orderRef = firestoreInstance
            .getCollection(DB_COLLECTIONS.ORDER)
            .where('bookingId', '==', bookingId);

        const snapshot = await orderRef.get();

        // ตรวจสอบว่า snapshot มีข้อมูลหรือไม่
        if (snapshot.empty) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // ใช้ข้อมูลจากเอกสารแรกใน snapshot
        const data = snapshot.docs[0].data();

        // ดึงค่า paymentStatus และตั้งค่า fallback เป็น 'pending'
        const paymentStatus = data.paymentStatus || 'pendipaidng';

        return NextResponse.json(
            { status: paymentStatus },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching order status:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error },
            { status: 500 }
        );
    }
};

export const PUT = async (req: Request) => {
    const { paymentStatus } = await req.json();
    const bookingId = new URL(req.url).searchParams.get('bookingId');

    if (!bookingId || !paymentStatus) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        const firestoreInstance = new firestore();
        const orderRef = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER).where('bookingId', '==', bookingId);
        const snapshot = await orderRef.get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const docId = snapshot.docs[0].id;
        await firestoreInstance.getCollection(DB_COLLECTIONS.ORDER).doc(docId).update({ paymentStatus });

        return NextResponse.json({ paymentStatus }, { status: 200 });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
