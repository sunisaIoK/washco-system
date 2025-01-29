import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/utils/database';
import DB_COLLECTIONS from '@/utils/constant';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    const db = new firestore();
    const userRef = db.getCollection(DB_COLLECTIONS.LOGIN);
    const querySnapshot = await userRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = querySnapshot.docs[0].data();
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, lastname, phone, address, email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    const db = new firestore();
    const userRef = db.getCollection(DB_COLLECTIONS.LOGIN);
    const querySnapshot = await userRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const updatedFields = { name, lastname, phone, address };
    await userDoc.ref.update(updatedFields);

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: { ...updatedFields, email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}