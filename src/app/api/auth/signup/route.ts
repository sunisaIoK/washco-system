import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import firestore from '@/utils/database';

export const POST = async (req: Request) => {
    try {
        const { name, lastname, email, password } = await req.json();

        console.log('Received data:', { name, lastname, email, password }); // เพิ่มการบันทึกข้อมูลที่รับมา


        // ตรวจสอบว่ามีผู้ใช้อีเมลอยู่แล้วหรือไม่
        const db = new firestore()
        // console.log('db:', db);

        const userRef = db.getCollection("users")
        // console.log('userRef:', userRef);

        const userDoc = await userRef.where("email", "==", email).get();
        console.log('userDoc:', userDoc);

        // ตรวจสอบข้อมูลที่ส่งมา
        if (!name || !lastname || !email || !password) {
            return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
        }
        console.log('Validated data:', { name, lastname, email, password });

        if (!userDoc.empty) {
            return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 409 });
        }
        console.log('User does not exist:', userDoc.empty);

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('hashedPassword:', hashedPassword);
        // บันทึกข้อมูลลงใน Firestore
        await userRef.add({
            name,
            lastname,
            email,
            hashedPassword, // เก็บรหัสผ่านที่เข้ารหัส
            createdAt: new Date(),
        });
        console.log('User data saved:', userRef.add, { name, lastname, email, hashedPassword });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', }, { status: 500 });
    }
};