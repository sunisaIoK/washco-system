import { NextRequest, NextResponse } from 'next/server';
import firestore from '@/utils/database';
import DB_COLLECTIONS from '@/utils/constant';

export async function GET(req: NextRequest) {
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
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { name, email } = body;

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
  await userDoc.ref.update({ name });

  return NextResponse.json({ message: 'User updated successfully', user: { name, email } }, { status: 200 });
}
