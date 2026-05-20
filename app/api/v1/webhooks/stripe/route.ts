// /app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/Stripe";
import { headers } from "next/headers";
import admin from "firebase-admin";
import { adminAuth } from "@/lib/firebase/config/firebaseAdmin";
import Stripe from "stripe";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: `Webhook Error: ${err.message}`,
      },
      { status: 400 },
    );
  }

  // Ignore unrelated events
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId metadata" }, { status: 400 });
  }

  let { orderRef, orderSnap, order } = await loadResourceMiddleware({
    id: orderId,
    reqKey: "order",
    collectionName: "orders",
  });

  // Prevent duplicate webhook processing
  if (order?.paymentStatus === "paid") return NextResponse.json({ alreadyProcessed: true });

  // Optional Stripe enrichment
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  await orderRef.update({
    status: "paid",
    paymentStatus: "paid",

    paidAt: admin.firestore.FieldValue.serverTimestamp(),

    shipping: session.customer_details?.address || null,

    stripe: {
      sessionId: session.id,
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total,
      currency: session.currency,
    },

    items: lineItems.data.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      amountTotal: item.amount_total,
      currency: item.currency,
    })),
  });

  // Clear cart safely after payment confirmed
  if (userId) {
    let { cartRef, cartSnap, cart } = await loadResourceMiddleware({
      id: userId,
      reqKey: "cart",
      collectionName: "carts",
    });

    await cartRef.update({
      items: [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({
    received: true,
  });
}
