// netlify/functions/create-checkout-session.js
//
// Called by agreement.html when a family submits the signed agreement form.
// 1. Saves the agreement to Neon with payment_status='pending'
// 2. Creates a Stripe Checkout session for the $500 retainer
// 3. Returns the Checkout URL for the browser to redirect to

const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event) => {
  // CORS headers (in case the agreement page is ever served from a different origin)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body);
    const {
      agreementId,
      family,
      acknowledgments,
      signature,
      terms,
    } = payload;

    // --- Validate the payload ---
    if (!agreementId || !family || !acknowledgments || !signature || !terms) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // All five acknowledgments must be checked
    const requiredAcks = ['employer', 'fee', 'circumvention', 'guarantee', 'confidential'];
    for (const ack of requiredAcks) {
      if (!acknowledgments[ack]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Missing acknowledgment: ${ack}` }),
        };
      }
    }

    // --- Save the agreement to Neon (status: pending) ---
    await sql`
      INSERT INTO client_agreements (
        agreement_id,
        parent1_name,
        parent2_name,
        email,
        phone,
        address,
        num_kids,
        children_ages,
        acknowledgments,
        signature_method,
        signature_data,
        signed_at,
        retainer_amount,
        placement_fee_pct,
        placement_fee_min,
        payment_status
      ) VALUES (
        ${agreementId},
        ${family.parent1},
        ${family.parent2 || null},
        ${family.email},
        ${family.phone},
        ${family.address},
        ${family.numKids},
        ${family.ages},
        ${JSON.stringify(acknowledgments)},
        ${signature.method},
        ${signature.data},
        ${signature.signedAt},
        ${terms.retainerAmount},
        ${terms.placementFeePct},
        ${terms.placementFeeMin},
        'pending'
      )
      ON CONFLICT (agreement_id) DO NOTHING
    `;

    // --- Create the Stripe Checkout session ---
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: family.email,
      metadata: {
        agreement_id: agreementId,
      },
      success_url: `${process.env.SITE_URL}/agreement.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/agreement.html?canceled=true`,
    });

    // --- Link the session ID back to the agreement ---
    await sql`
      UPDATE client_agreements
      SET stripe_session_id = ${session.id},
          updated_at = NOW()
      WHERE agreement_id = ${agreementId}
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', detail: err.message }),
    };
  }
};
