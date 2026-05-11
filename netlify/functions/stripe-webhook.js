// netlify/functions/stripe-webhook.js
//
// Called automatically by Stripe when payment events occur.
// We listen for `checkout.session.completed` to mark agreements as paid.
//
// IMPORTANT: This function uses the raw request body to verify Stripe's signature.
// Netlify provides event.body as a string, which is what stripe.webhooks.constructEvent expects.

const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return { statusCode: 400, body: 'Missing signature or secret' };
  }

  let stripeEvent;
  try {
    // Verify the event came from Stripe (not a spoofed request)
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const agreementId = session.metadata?.agreement_id;

        if (!agreementId) {
          console.error('checkout.session.completed received without agreement_id metadata');
          return { statusCode: 200, body: 'Ignored: no agreement_id' };
        }

        // Only mark paid if payment actually succeeded
        if (session.payment_status === 'paid') {
          await sql`
            UPDATE client_agreements
            SET payment_status = 'paid',
                stripe_payment_intent_id = ${session.payment_intent},
                paid_at = NOW(),
                updated_at = NOW()
            WHERE agreement_id = ${agreementId}
          `;
          console.log(`Agreement ${agreementId} marked as paid`);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = stripeEvent.data.object;
        const agreementId = session.metadata?.agreement_id;

        if (agreementId) {
          await sql`
            UPDATE client_agreements
            SET payment_status = 'expired',
                updated_at = NOW()
            WHERE agreement_id = ${agreementId}
              AND payment_status = 'pending'
          `;
          console.log(`Agreement ${agreementId} marked as expired`);
        }
        break;
      }

      default:
        // We don't care about other event types for now
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook handler error:', err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
