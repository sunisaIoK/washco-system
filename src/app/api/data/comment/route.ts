import DB_COLLECTIONS from "@/utils/constant";
import firestore from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;
  const customerId = searchParams.get('customerId');
  const bookingId = searchParams.get('bookingId'); // ดึง bookingId จาก URL

  try {
      const firestoreInstance = new firestore();
      const ordersCollection = firestoreInstance.getCollection(DB_COLLECTIONS.ORDER);

      if (!customerId) {
          return NextResponse.json(
              { error: 'customerId is required to fetch orders' },
              { status: 400 }
          );
      }

      let query = ordersCollection.where('customerId', '==', customerId);

      // Add a condition for bookingId if provided
      if (bookingId) {
          query = query.where('bookingId', '==', bookingId);
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
