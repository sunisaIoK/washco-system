import DB_COLLECTIONS from '@/utils/constant';
import firestore from '@/utils/database';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อรองรับ Stripe Webhook
  },
};

// ฟังก์ชันอ่านข้อมูล Webhook
async function buffer(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
  if (!readable) {
    throw new Error('ReadableStream is null');
  }
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
export const POST = async (req: NextRequest) => {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new NextResponse('Missing Stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const buf = await buffer(req.body);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log('Event constructed:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // ตรวจสอบ metadata
        if (!session.metadata?.userId || !session.metadata?.bookingId) {
          console.error('Missing metadata in checkout.session.completed');
          return new NextResponse('Missing metadata', { status: 400 });
        }
        console.log('Handling checkout.session.completed:', session);
        await updateDatabaseStatus({
          userId: session.metadata.userId,
          bookingId: session.metadata.bookingId,
          status: 'success',
          paymentId: session.payment_intent as string,
          totalAmount: session.amount_total || 0,
          currency: session.currency || 'thb',
        });
        break;
      }
      case 'charge.updated': {
        const charge = event.data.object as Stripe.Charge;
        if (!charge.payment_intent) {
          console.error('Missing payment_intent in charge.updated');
          break;
        }
        // ดึง metadata จาก payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(
          charge.payment_intent as string
        );
        if (!paymentIntent.metadata?.userId || !paymentIntent.metadata?.bookingId) {
          console.error('Missing metadata in Payment Intent');
          break;
        }
        console.log('Handling charge.updated with metadata:', paymentIntent.metadata);
        await updateDatabaseStatus({
          userId: paymentIntent.metadata.userId,
          bookingId: paymentIntent.metadata.bookingId,
          status: charge.status === 'succeeded' ? 'success' : 'failed',
          paymentId: charge.payment_intent as string,
          totalAmount: charge.amount || 0,
          currency: charge.currency || 'thb',
        });
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
    return new NextResponse(`Internal Server Error: ${err}`, { status: 500 });
  }
  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};

// ฟังก์ชันอัปเดตสถานะในฐานข้อมูล
async function updateDatabaseStatus(data: {
  userId: string;
  bookingId: string;
  status: string;
  paymentId: string;
  totalAmount: number;
  currency: string;
}) {
  console.log('Updating database with:', data);

  const db = new firestore();
  const bookingRef = db.getCollection(DB_COLLECTIONS.ORDER).doc(data.bookingId);

  try {
    await bookingRef.update({
      status: data.status,
      paymentId: data.paymentId,
      totalAmount: data.totalAmount,
      currency: data.currency,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    throw new Error(`Database update failed: ${err}`);
  }
}

// async function sendNotificationToUser(userId: string, title: string, message: string) {
//   console.log(`Sending notification to user: ${userId}`);

//   // สมมติว่าคุณมีฟังก์ชันที่เชื่อมต่อกับระบบ Notification เช่น Firebase หรือ Email Service
//   try {
//     // ตัวอย่างการส่ง Notification
//     await fetch(`https://api.notification-service.com/send`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         title,
//         message,
//       }),
//     });
//     console.log('Notification sent successfully!');
//   } catch (err) {
//   }
// }
