import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2024-12-18.acacia', // เปลี่ยนเป็นค่าใหม่ที่ระบบแจ้ง (จาก Error)
// });

export async function POST(req: Request) {
//   try {
//       const { items } = await req.json();

//       console.log("Items received from Frontend:", items); // Debug ข้อมูลที่ส่ง

//       // ตรวจสอบและเพิ่ม line_items
//       const lineItems = items.map((item: { name: string; price: number; quantity: number }) => {
//           console.log("Creating Line Item:", item); // ดูข้อมูลที่เตรียมจะส่งไปยัง Stripe
//           return {
//               price_data: {
//                   currency: "thb",
//                   product_data: {
//                       name: item.name, // ชื่อสินค้า
//                   },
//                   unit_amount: Math.round(item.price), // ต้องอยู่ในหน่วยสตางค์
//               },
//               quantity: item.quantity,
//           };
//       });

//       // สร้าง Checkout Session
//     //   const session = await stripe.checkout.sessions.create({
//     //       payment_method_types: ["card"],
//     //       line_items: lineItems,
//     //       mode: "payment",
//     //       success_url: `${req.headers.get("origin")}/page/booking?succes=true`,
//     //       cancel_url: `${req.headers.get("origin")}/page/booking?cancel=true`,
//     //   });

//     //   return NextResponse.json({ id: session.id, message: "ชำระเงินสำเร็จ" });  } catch (error: any) {
//     //   console.error("Error creating Stripe Checkout Session:", error);
//     //   return NextResponse.json(
//     //       { error: "Failed to create Stripe Checkout Session" },
//     //       { status: 500 }
//     //   );
//   }
}
