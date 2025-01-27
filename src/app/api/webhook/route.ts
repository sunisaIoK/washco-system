import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import firestore from '@/utils/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: NodeJS.ReadableStream) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const { userId, bookingId } = session.metadata || {};
        console.log(`Payment completed for session: ${session.id}, userId: ${userId}, bookingId: ${bookingId}`);

        // อัปเดตสถานะในฐานข้อมูล
        await updateDatabaseStatus({
          userId,
          bookingId,
          status: 'success',
          paymentId: session.payment_intent as string,
          totalAmount: session.amount_total || 0,
          currency: session.currency || 'thb',
        });

        // ส่ง Notification
        sendNotificationToClient(userId, 'ชำระเงินสำเร็จ', 'การชำระเงินของคุณสำเร็จแล้ว');

        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

// ฟังก์ชันส่ง Notification (คุณสามารถปรับให้เหมาะสมกับ WebSocket หรือ Firebase)
function sendNotificationToClient(userId: string, title: string, message: string) {
  console.log(`Notification to user ${userId}: ${title} - ${message}`);
  // ตัวอย่าง: ใช้ Firebase หรือ WebSocket เพื่อแจ้งเตือน Client แบบเรียลไทม์
}

// ฟังก์ชันอัปเดตสถานะในฐานข้อมูล
async function updateDatabaseStatus(data: {
  userId: string;
  bookingId: string;
  status: string;
  paymentId: string;
  totalAmount: number;
  currency: string;
}) {
  const db = new firestore();
  const bookingRef = db.getCollection('bookings').doc(data.bookingId);

  await bookingRef.update({
    status: data.status,
    paymentId: data.paymentId,
    totalAmount: data.totalAmount,
    currency: data.currency,
    updatedAt: new Date().toISOString(),
  });

  console.log(`Updated booking ${data.bookingId} in database.`);
}
