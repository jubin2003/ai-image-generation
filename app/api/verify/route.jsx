// app/api/verify/route.js
import crypto from 'crypto';
import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { eq } from 'drizzle-orm';
export async function POST(req) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_email, credits_purchased } = await req.json();

  try {
    // Verify Razorpay signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      // Fetch the user's current credits
      const user = await db
      .select({ credits: Users.credits })
      .from(Users)
      .where(eq(Users.email, user_email)) // Use `eq` from drizzle-orm
      .then(([result]) => result);

      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
      }

      const updatedCredits = user.credits + credits_purchased;

      // Update user's credits
      await db
      .update(Users)
      .set({ credits: updatedCredits })
      .where(eq(Users.email, user_email));

      return new Response(JSON.stringify({ success: true, credits: updatedCredits }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
