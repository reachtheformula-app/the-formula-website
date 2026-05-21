// netlify/functions/stripe-webhook.js
//
// Called automatically by Stripe when payment events occur.
// We listen for `checkout.session.completed` to:
//   1. Mark agreements as paid in the database
//   2. Generate a PDF of the signed Client Services Agreement
//   3. Email it to the family (BCC: agency)
//
// IMPORTANT: This function uses the raw request body to verify Stripe's signature.
// Netlify provides event.body as a string, which is what stripe.webhooks.constructEvent expects.

const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');
const { generateAgreementPDF } = require('./utils/generate-agreement-pdf');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const AGENCY_EMAIL = 'reach.theformula@gmail.com';

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return { statusCode: 400, body: 'Missing signature or secret' };
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const agreementId = session.metadata?.agreement_id;

        if (!agreementId) {
          console.error('checkout.session.completed received without agreement_id metadata');
          return { statusCode: 200, body: 'Ignored: no agreement_id' };
        }

        if (session.payment_status !== 'paid') {
          console.log(`Session not paid (status: ${session.payment_status}), skipping`);
          return { statusCode: 200, body: JSON.stringify({ received: true }) };
        }

        // Idempotency check — Stripe retries can deliver the same event multiple times.
        // If paid_at is already set, we've already sent the email; skip everything.
        const existing = await sql`
          SELECT paid_at FROM client_agreements WHERE agreement_id = ${agreementId}
        `;
        if (existing.length === 0) {
          console.error(`No agreement found for ID ${agreementId}`);
          return { statusCode: 200, body: 'Ignored: agreement not found' };
        }
        if (existing[0].paid_at) {
          console.log(`Agreement ${agreementId} already processed, skipping`);
          return { statusCode: 200, body: JSON.stringify({ received: true }) };
        }

        // Mark as paid
        await sql`
          UPDATE client_agreements
          SET payment_status = 'paid',
              stripe_payment_intent_id = ${session.payment_intent},
              paid_at = NOW(),
              updated_at = NOW()
          WHERE agreement_id = ${agreementId}
        `;
        console.log(`Agreement ${agreementId} marked as paid`);

        // Fetch the full row (now with paid_at populated) for the email
        const rows = await sql`
          SELECT * FROM client_agreements WHERE agreement_id = ${agreementId}
        `;
        const agreement = rows[0];

        // Send confirmation email. Wrap so a send failure doesn't cause Stripe
        // to retry the webhook — the payment is already processed.
        try {
          await sendConfirmationEmail(agreement);
          console.log(`Confirmation email sent for ${agreementId} to ${agreement.email}`);
        } catch (emailErr) {
          console.error(`Failed to send confirmation email for ${agreementId}:`, emailErr);
          // Continue — don't fail the webhook
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
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook handler error:', err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};

// ---------- email ----------

async function sendConfirmationEmail(agreement) {
  if (!GMAIL_USER || !GMAIL_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD env vars are required');
  }
  if (!agreement.email) {
    throw new Error('Agreement has no email address');
  }

  const pdfBuffer = await generateAgreementPDF(agreement);

  const familyDisplayName = agreement.parent2_name
    ? `${agreement.parent1_name} and ${agreement.parent2_name}`
    : agreement.parent1_name;

  const firstName = (agreement.parent1_name || '').split(' ')[0] || 'there';

  const retainer = agreement.retainer_amount
    ? `$${Number(agreement.retainer_amount).toLocaleString()}`
    : '$500';
  const feePct = agreement.placement_fee_pct || 15;
  const feeMin = agreement.placement_fee_min
    ? Number(agreement.placement_fee_min).toLocaleString()
    : '3,500';

  const signedDate = formatDate(agreement.signed_at);
  const pdfFilename = `Formula-Client-Services-Agreement-${agreement.agreement_id}.pdf`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASSWORD },
  });

  const subject = 'Welcome to The Formula — Your Signed Client Services Agreement';

  const textBody = buildPlainText({
    firstName,
    familyDisplayName,
    retainer,
    feePct,
    feeMin,
    signedDate,
    agreementId: agreement.agreement_id,
  });

  const htmlBody = buildHTML({
    firstName,
    familyDisplayName,
    retainer,
    feePct,
    feeMin,
    signedDate,
    agreementId: agreement.agreement_id,
  });

  await transporter.sendMail({
    from: `"The Formula" <${GMAIL_USER}>`,
    to: agreement.email,
    bcc: AGENCY_EMAIL,
    subject,
    text: textBody,
    html: htmlBody,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildPlainText({ firstName, familyDisplayName, retainer, feePct, feeMin, signedDate, agreementId }) {
  return `Hi ${firstName},

Thank you for choosing The Formula. Your signed Client Services Agreement is attached to this email for your records.

A QUICK SUMMARY OF WHAT YOU AGREED TO:

• Retainer: ${retainer} non-refundable, paid today. This is credited against the placement fee when we place a nanny with your family.

• Placement Fee: ${feePct}% of the nanny's annual gross compensation, with a minimum of $${feeMin} (less the retainer you've already paid). Due within 7 days of your nanny's first day.

• 90-Day Replacement Guarantee: If a placement ends within 90 days for performance reasons, we'll conduct one replacement search at no additional placement fee.

• Anti-Circumvention: All candidates we introduce are confidential. If you hire any candidate we introduce — directly or through anyone else — within 24 months, the full placement fee applies.

• Your Role as Employer: Once a nanny is placed, you are the household employer (we are not). You're responsible for payroll, taxes, workers' comp, and compliance with Illinois domestic worker laws.

The attached PDF is the complete agreement and the legally controlling document. Please save a copy for your records.

WHAT'S NEXT:

I'll be in touch within 48 hours to schedule your intake consultation, where we'll walk through your family profile in detail and start building a search plan tailored to your needs.

If you have any questions in the meantime, just reply to this email.

Warmly,
Brittany Barrett
Founder, The Formula
reach.theformula@gmail.com

—
Agreement ID: ${agreementId}
Signed: ${signedDate}
Family: ${familyDisplayName}
`;
}

function buildHTML({ firstName, familyDisplayName, retainer, feePct, feeMin, signedDate, agreementId }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #2C3E50; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; }
    h1 { font-family: Georgia, 'Times New Roman', serif; color: #2C3E50; font-size: 24px; margin: 0 0 16px; }
    h2 { font-family: Georgia, 'Times New Roman', serif; color: #2C3E50; font-size: 16px; margin: 28px 0 12px; border-bottom: 2px solid #D4A373; padding-bottom: 6px; }
    .summary { background: #F5F0EB; border-left: 4px solid #D4A373; padding: 16px 20px; margin: 16px 0; border-radius: 4px; }
    .summary-item { margin: 10px 0; }
    .summary-label { font-weight: 600; color: #2C3E50; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; }
    .signoff { margin-top: 24px; }
    .signoff-name { font-family: Georgia, serif; font-style: italic; font-size: 18px; color: #2C3E50; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>Welcome to The Formula</h1>

  <p>Hi ${escapeHTML(firstName)},</p>

  <p>Thank you for choosing The Formula. Your signed Client Services Agreement is attached to this email for your records.</p>

  <h2>A quick summary of what you agreed to</h2>

  <div class="summary">
    <div class="summary-item">
      <span class="summary-label">Retainer:</span> ${retainer} non-refundable, paid today. Credited against your placement fee when we place a nanny with your family.
    </div>
    <div class="summary-item">
      <span class="summary-label">Placement Fee:</span> ${feePct}% of the nanny's annual gross compensation, with a minimum of $${feeMin} (less the retainer you've already paid). Due within 7 days of your nanny's first day.
    </div>
    <div class="summary-item">
      <span class="summary-label">90-Day Replacement Guarantee:</span> If a placement ends within 90 days for performance reasons, we'll conduct one replacement search at no additional placement fee.
    </div>
    <div class="summary-item">
      <span class="summary-label">Anti-Circumvention:</span> All candidates we introduce are confidential. If you hire any candidate we introduce — directly or through anyone else — within 24 months, the full placement fee applies.
    </div>
    <div class="summary-item">
      <span class="summary-label">Your Role as Employer:</span> Once a nanny is placed, you are the household employer (we are not). You're responsible for payroll, taxes, workers' comp, and compliance with Illinois domestic worker laws.
    </div>
  </div>

  <p>The attached PDF is the complete agreement and the legally controlling document. Please save a copy for your records.</p>

  <h2>What's next</h2>

  <p>I'll be in touch within 48 hours to schedule your intake consultation, where we'll walk through your family profile in detail and start building a search plan tailored to your needs.</p>

  <p>If you have any questions in the meantime, just reply to this email.</p>

  <div class="signoff">
    Warmly,
    <div class="signoff-name">Brittany Barrett</div>
    <div style="font-size: 13px; color: #666;">Founder, The Formula</div>
    <div style="font-size: 13px; color: #666;">reach.theformula@gmail.com</div>
  </div>

  <div class="footer">
    Agreement ID: ${escapeHTML(agreementId)}<br>
    Signed: ${escapeHTML(signedDate)}<br>
    Family: ${escapeHTML(familyDisplayName)}
  </div>
</body>
</html>`;
}

function escapeHTML(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
