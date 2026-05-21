// netlify/functions/utils/generate-agreement-pdf.js
//
// Generates a PDF of the signed Client Services Agreement with the family's
// info and signature embedded. Returns a Buffer ready to attach to an email.

const PDFDocument = require('pdfkit');

function formatDate(d) {
  if (!d) return '____________________';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function generateAgreementPDF(agreement) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
        info: {
          Title: 'Client Services Agreement',
          Author: 'The Formula',
          Subject: 'Nanny Placement Services Agreement',
        },
      });

      const buffers = [];
      doc.on('data', (b) => buffers.push(b));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      buildPDF(doc, agreement);
      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

// ---------- helpers ----------

function H1(doc, text) {
  doc.font('Helvetica-Bold').fontSize(16).text(text, { align: 'center' });
}

function H2(doc, num, title) {
  // Keep section headings with at least some content after them
  if (doc.y > doc.page.height - 150) doc.addPage();
  doc.moveDown(0.8);
  doc.font('Helvetica-Bold').fontSize(11.5).text(`${num}. ${title}`);
  doc.moveDown(0.3);
}

function P(doc, text) {
  doc.font('Helvetica').fontSize(10).text(text, {
    align: 'justify',
    lineGap: 1.5,
  });
  doc.moveDown(0.4);
}

// Paragraph with a bold lead-in (e.g. "5.1  Retainer. ")
function P_lead(doc, lead, body) {
  doc.font('Helvetica-Bold').fontSize(10).text(lead, { continued: true });
  doc.font('Helvetica').text(body, { align: 'justify', lineGap: 1.5 });
  doc.moveDown(0.4);
}

// Lettered sub-item like "(a)  "Candidate" means..."
function SubItem(doc, letter, parts) {
  // Normalize: PDFKit's justified continued-text drops leading whitespace
  // on font changes, so move any leading whitespace to the previous chunk.
  const normalized = parts.map((p) => ({ ...p }));
  for (let i = 1; i < normalized.length; i++) {
    const m = normalized[i].text.match(/^(\s+)/);
    if (m) {
      normalized[i - 1].text += m[1];
      normalized[i].text = normalized[i].text.slice(m[1].length);
    }
  }

  doc.font('Helvetica-Bold').fontSize(10).text(`(${letter})  `, { continued: true });
  normalized.forEach((p, i) => {
    const isLast = i === normalized.length - 1;
    doc.font(p.bold ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(p.text, {
      continued: !isLast,
      align: 'justify',
      lineGap: 1.5,
    });
  });
  doc.moveDown(0.4);
}

function ALLCAPS(doc, text) {
  doc.font('Helvetica-Bold').fontSize(9.5).text(text, {
    align: 'justify',
    lineGap: 1.5,
  });
  doc.moveDown(0.4);
}

function HR(doc) {
  doc.moveDown(0.5);
  doc
    .strokeColor('#cccccc')
    .lineWidth(0.5)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.5);
}

// ---------- main builder ----------

function buildPDF(doc, a) {
  const signedDate = formatDate(a.signed_at);
  const familyName = a.parent2_name
    ? `${a.parent1_name} and ${a.parent2_name}`
    : a.parent1_name;
  const address = a.address || '[Address on file]';
  const retainer = a.retainer_amount ? `$${Number(a.retainer_amount).toLocaleString()}` : '$500';
  const feePct = a.placement_fee_pct || 15;
  const feeMin = a.placement_fee_min ? Number(a.placement_fee_min).toLocaleString() : '3,500';

  // ===== TITLE =====
  H1(doc, 'CLIENT SERVICES AGREEMENT');
  doc.moveDown(0.2);
  doc
    .font('Helvetica-Oblique')
    .fontSize(11)
    .text('The Formula — Nanny Placement Services', { align: 'center' });
  doc.moveDown(1.2);

  // ===== INTRO =====
  doc.font('Helvetica').fontSize(10).text(
    `This Client Services Agreement (the "Agreement") is entered into as of ${signedDate} (the "Effective Date"), by and between The Formula, a business operating in the State of Illinois (the "Agency"), and ${familyName}, residing at ${address} (collectively, the "Family" or "Client"). The Agency and the Family are each a "Party" and together the "Parties."`,
    { align: 'justify', lineGap: 1.5 }
  );

  // ===== 1. RECITALS =====
  H2(doc, '1', 'Recitals');
  P(doc, 'The Agency operates a nanny placement service that identifies, screens, and presents candidates for in-home childcare positions, and provides curriculum and educational resources in support of those placements. The Family wishes to engage the Agency to assist in the search for, and placement of, an in-home childcare provider. The Parties enter into this Agreement to set forth the terms governing that engagement.');

  // ===== 2. DEFINITIONS =====
  H2(doc, '2', 'Definitions');
  SubItem(doc, 'a', [
    { text: '"Candidate"', bold: true },
    { text: ' means any individual whose name, résumé, profile, contact information, photograph, video, or other identifying information is presented, introduced, referred, or otherwise disclosed to the Family by the Agency, whether in writing, orally, electronically, or by any other means, and whether or not the Family ultimately interviews or hires that individual.' },
  ]);
  SubItem(doc, 'b', [
    { text: '"Engage"', bold: true },
    { text: ' (and its variants ' },
    { text: '"Engagement," "Hire," "Hired,"', bold: true },
    { text: ' and ' },
    { text: '"Hiring"', bold: true },
    { text: ') means to employ, retain, contract with, or otherwise compensate a Candidate, directly or indirectly, in any capacity involving childcare, household services, tutoring, educational support, or any related role, whether full-time, part-time, temporary, occasional, on a trial basis, or as an independent contractor, and whether the compensation is monetary or in kind.' },
  ]);
  SubItem(doc, 'c', [
    { text: '"Placement"', bold: true },
    { text: ' means the Family\'s Engagement of any Candidate.' },
  ]);
  SubItem(doc, 'd', [
    { text: '"Placement Fee"', bold: true },
    { text: ' means the fee payable by the Family to the Agency upon Placement, as set forth in Section 5.' },
  ]);
  SubItem(doc, 'e', [
    { text: '"Annual Gross Compensation"', bold: true },
    { text: ' means the total gross annual compensation the Family agrees to pay the Candidate, calculated based on the agreed hourly or weekly rate multiplied out to a 52-week year, plus any guaranteed bonuses, signing bonuses, or other guaranteed monetary compensation. For salaried Placements, Annual Gross Compensation is the agreed annual salary.' },
  ]);

  // ===== 3. SCOPE OF SERVICES =====
  H2(doc, '3', 'Scope of Services');
  P_lead(doc, 'Agency Services. ', 'The Agency will use commercially reasonable efforts to:');
  SubItem(doc, 'a', [{ text: 'Conduct an intake consultation to understand the Family\'s childcare needs, scheduling requirements, household preferences, and developmental priorities for the child(ren);' }]);
  SubItem(doc, 'b', [{ text: 'Source and screen Candidates from the Agency\'s candidate pool and external recruitment channels;' }]);
  SubItem(doc, 'c', [{ text: 'Conduct preliminary reference checks and review professional credentials of Candidates the Agency presents;' }]);
  SubItem(doc, 'd', [{ text: 'Present qualified Candidates to the Family for the Family\'s independent review and interview;' }]);
  SubItem(doc, 'e', [{ text: 'Coordinate interviews and trust-building activities (such as trial days) at the Family\'s request; and' }]);
  SubItem(doc, 'f', [{ text: 'Provide guidance throughout the search process, including offer support and onboarding resources.' }]);
  P_lead(doc, 'Excluded Services. ', 'The Agency does not, and is not obligated to: (i) supervise, train, schedule, manage, or direct any Candidate or Placement after the Engagement begins; (ii) act as the Candidate\'s employer or co-employer; (iii) administer payroll, withhold taxes, or pay employment taxes on the Candidate\'s behalf; (iv) provide workers\' compensation, unemployment, disability, or any other insurance covering the Candidate; (v) provide legal, tax, immigration, or accounting advice; or (vi) guarantee the future performance, behavior, conduct, suitability, longevity, or continued availability of any Candidate.');

  // ===== 4. FAMILY'S ACKNOWLEDGMENTS =====
  H2(doc, '4', "Family's Acknowledgments and Responsibilities");
  P(doc, 'The Family acknowledges, represents, and agrees that:');
  SubItem(doc, 'a', [
    { text: 'Family is the Employer. ', bold: true },
    { text: 'Upon Placement, the Family — not the Agency — is the sole employer of the Candidate. The Family is solely responsible for all aspects of the employment relationship, including hiring decisions, compensation, scheduling, supervision, performance management, discipline, and termination.' },
  ]);
  SubItem(doc, 'b', [
    { text: 'Tax and Payroll Compliance. ', bold: true },
    { text: 'The Family is solely responsible for complying with all federal, state, and local tax, payroll, and employment laws applicable to household employers, including without limitation obtaining an Employer Identification Number (EIN); withholding and remitting federal income tax, Social Security, and Medicare; paying federal and state unemployment taxes; issuing Form W-2 or applicable wage statements; and complying with overtime, minimum wage, and recordkeeping requirements.' },
  ]);
  SubItem(doc, 'c', [
    { text: 'Insurance. ', bold: true },
    { text: 'The Family is solely responsible for obtaining and maintaining workers\' compensation insurance to the extent required by law, and is encouraged to maintain appropriate homeowner\'s, umbrella, or employment practices liability coverage.' },
  ]);
  SubItem(doc, 'd', [
    { text: "Illinois Domestic Workers' Bill of Rights. ", bold: true },
    { text: 'The Family acknowledges its obligations under the Illinois Domestic Workers\' Bill of Rights and any applicable Cook County or City of Chicago domestic worker ordinances, including without limitation those addressing minimum wage, overtime, paid leave, rest periods, and written agreements.' },
  ]);
  SubItem(doc, 'e', [
    { text: 'Independent Evaluation. ', bold: true },
    { text: 'The Family will independently evaluate each Candidate, conduct any additional reference, background, motor vehicle, social media, or credential checks the Family deems appropriate, and make its own informed hiring decision. The Family does not rely solely on the Agency\'s screening.' },
  ]);
  SubItem(doc, 'f', [
    { text: 'Accurate Information. ', bold: true },
    { text: 'The Family will provide accurate and complete information regarding its needs, household, schedule, compensation offer, and any material facts that may affect a Placement, and will promptly notify the Agency of any change.' },
  ]);

  // ===== 5. PLACEMENT FEE =====
  H2(doc, '5', 'Placement Fee and Payment Terms');
  P_lead(doc, '5.1  Retainer. ', `Upon execution of this Agreement, the Family will pay a non-refundable retainer of ${retainer} (the "Retainer"). The Retainer secures the Agency's services and will be credited against the Placement Fee upon Placement. If no Placement occurs, the Retainer is not refundable except as expressly provided herein.`);
  P_lead(doc, '5.2  Placement Fee. ', `Upon Placement, the Family will pay the Agency a Placement Fee equal to ${feePct}% of the Candidate's Annual Gross Compensation, with a minimum Placement Fee of $${feeMin}, less any Retainer previously paid.`);
  P_lead(doc, '5.3  When the Placement Fee Is Earned. ', "The Placement Fee is fully earned and payable upon the earlier of: (i) the Candidate's acceptance of the Family's offer of Engagement; or (ii) the Candidate's first day of work for the Family.");
  P_lead(doc, '5.4  Payment Due Date. ', 'The Family will pay the Placement Fee in full within seven (7) calendar days after the Placement Fee is earned, by ACH, credit card, or such other method as the Agency may accept. The Family authorizes the Agency to invoice the Family electronically.');
  P_lead(doc, '5.5  Late Payment. ', "Any amount not paid when due will accrue interest at the lesser of 1.5% per month or the maximum rate permitted by Illinois law, beginning on the first day after the due date and continuing until paid in full. The Family will also reimburse the Agency for all costs of collection, including reasonable attorneys' fees, court costs, and collection agency fees.");
  P_lead(doc, '5.6  Suspension of Services. ', 'If any amount is past due, the Agency may, in its sole discretion and without liability, suspend or terminate services and withdraw any Candidate previously presented, until all past-due amounts are paid in full.');
  P_lead(doc, '5.7  No Set-Off. ', 'The Family will pay all amounts due under this Agreement without set-off, deduction, counterclaim, or withholding of any kind.');
  P_lead(doc, '5.8  Taxes. ', 'All fees are exclusive of any applicable sales, use, or similar taxes, which the Family will pay in addition to the fees.');

  // ===== 6. ANTI-CIRCUMVENTION =====
  H2(doc, '6', 'Anti-Circumvention; Direct Hire Protection');
  P_lead(doc, '6.1  Confidential Candidate Information. ', "All Candidate information disclosed by the Agency to the Family — including names, contact information, résumés, references, and photographs — is the confidential property of the Agency, is provided solely for the purpose of evaluating the Candidate for Placement through the Agency, and may not be used for any other purpose, copied, shared, posted, forwarded, or disclosed to any third party (including other families, friends, relatives, employers, agencies, or job platforms) without the Agency's prior written consent.");
  P_lead(doc, '6.2  Direct Hire Fee. ', "If, during the term of this Agreement or within twenty-four (24) months after its expiration or termination, the Family (or any member of the Family's household, immediate family, business, or affiliated entity) Engages any Candidate introduced by the Agency — whether for the originally contemplated role or for any other position, whether full-time, part-time, occasional, or temporary, and whether the Engagement is arranged directly, through a third party, or through any other agency — the full Placement Fee set forth in Section 5.2 will become immediately due and payable to the Agency, regardless of how the Family came to re-contact the Candidate.");
  P_lead(doc, '6.3  Notice of Engagement. ', "The Family will notify the Agency in writing within five (5) business days of any Engagement of a Candidate covered by Section 6.2 and will provide the Candidate's start date and Annual Gross Compensation to permit calculation of the Placement Fee.");
  P_lead(doc, '6.4  Referrals to Third Parties. ', "If the Family refers a Candidate to a third party who Engages that Candidate within twenty-four (24) months of the Agency's introduction, the Family will pay the Agency a referral fee equal to fifty percent (50%) of the Placement Fee that would have been due under Section 5.2.");

  // ===== 7. REPLACEMENT GUARANTEE =====
  H2(doc, '7', 'Replacement Guarantee');
  P_lead(doc, '7.1  Eligibility. ', "If a Placement ends within ninety (90) days after the Candidate's first day of work, the Agency will, subject to Section 7.2, conduct one (1) replacement search at no additional Placement Fee. The Family must (i) have paid the original Placement Fee in full, (ii) notify the Agency in writing within ten (10) calendar days of the end of the Placement, and (iii) cooperate in good faith with the replacement search.");
  P_lead(doc, '7.2  Exclusions. ', "The replacement guarantee does not apply if the Placement ends because of: (a) any change in the Family's circumstances, including relocation, change in schedule, change in compensation, elimination of the position, parental leave returning, or change in childcare needs; (b) the Family's breach of any agreement with the Candidate or any applicable employment law; (c) misconduct by the Family or any household member; (d) the Family's failure to provide the Candidate with the agreed compensation, hours, working conditions, or required benefits; or (e) the Family's decision to terminate the Candidate without cause within the guarantee period for reasons unrelated to job performance.");
  P_lead(doc, '7.3  Replacement Search Window. ', "The replacement search will commence within a reasonable time after the Family's written request and will continue for up to ninety (90) days. If no replacement Candidate is Placed within that window despite the Agency's commercially reasonable efforts, the Agency's obligations under this Section 7 are fully satisfied, and no refund of the Placement Fee will be due.");
  P_lead(doc, '7.4  One Replacement Only. ', "The Agency's replacement obligation is limited to one (1) replacement search per original Placement. A subsequent Placement begins a new ninety (90) day guarantee period only if a new Placement Fee is paid for that Placement.");
  P_lead(doc, '7.5  No Cash Refunds. ', "Except as expressly stated in this Agreement, all fees are non-refundable. The replacement guarantee is the Family's sole and exclusive remedy for a Placement that ends within the guarantee period.");

  // ===== 8. SCREENING =====
  H2(doc, '8', 'Screening and Background Information');
  P(doc, "The Agency's screening may include reference checks, identity verification, review of credentials, and other reasonable inquiries. The Agency does not warrant that screening will reveal every fact relevant to a hiring decision. The Family acknowledges that any criminal background check, motor vehicle record check, credit check, or similar inquiry conducted by the Agency is performed only with the Candidate's consent and in compliance with applicable law, and that the Family is responsible for ordering, paying for, and reviewing any additional background checks the Family deems appropriate before Engaging a Candidate. The Family will use any background information solely for evaluating the Candidate for Engagement and will comply with the Fair Credit Reporting Act and all other applicable laws.");

  // ===== 9. DISCLAIMERS =====
  H2(doc, '9', 'Disclaimers; No Warranties');
  ALLCAPS(doc, 'THE AGENCY\'S SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." THE AGENCY MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT, AND DISCLAIMS ALL SUCH WARRANTIES TO THE FULLEST EXTENT PERMITTED BY LAW. WITHOUT LIMITING THE FOREGOING, THE AGENCY DOES NOT WARRANT OR GUARANTEE THE CHARACTER, HONESTY, SAFETY, JUDGMENT, RELIABILITY, COMPETENCE, OR FUTURE CONDUCT OF ANY CANDIDATE, OR THAT ANY PLACEMENT WILL BE SUCCESSFUL OR LASTING. THE FAMILY ASSUMES ALL RISK OF EMPLOYING ANY CANDIDATE.');

  // ===== 10. LIMITATION OF LIABILITY =====
  H2(doc, '10', 'Limitation of Liability');
  ALLCAPS(doc, "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE AGENCY'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICES, REGARDLESS OF THE FORM OF ACTION (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE), WILL NOT EXCEED THE TOTAL AMOUNT OF FEES ACTUALLY PAID BY THE FAMILY TO THE AGENCY UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM. IN NO EVENT WILL THE AGENCY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST WAGES, LOST OPPORTUNITY, EMOTIONAL DISTRESS, OR INJURY TO PERSON OR PROPERTY CAUSED BY ANY CANDIDATE, EVEN IF THE AGENCY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.");

  // ===== 11. INDEMNIFICATION =====
  H2(doc, '11', 'Indemnification');
  P(doc, 'The Family will defend, indemnify, and hold harmless the Agency and its owners, employees, contractors, and affiliates (the "Indemnified Parties") from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising out of or relating to: (a) the employment, engagement, conduct, acts, or omissions of any Candidate or Placement (whether or not the Engagement was made through the Agency); (b) the Family\'s breach of this Agreement or any representation made herein; (c) the Family\'s violation of any law, including without limitation employment, tax, wage-and-hour, immigration, and household-employer laws; (d) any injury, illness, or property damage occurring on the Family\'s premises or in connection with the Candidate\'s services; and (e) any claim by a Candidate against the Agency arising from the Family\'s acts or omissions.');

  // ===== 12. CONFIDENTIALITY =====
  H2(doc, '12', 'Confidentiality');
  P(doc, "Each Party will keep confidential any non-public information disclosed by the other Party in connection with this Agreement, including the Agency's candidate database, screening practices, pricing, and proprietary curriculum, and the Family's personal and household information. This obligation survives termination for two (2) years and indefinitely as to information that constitutes a trade secret. Confidential information does not include information that is public through no fault of the receiving Party, was known to the receiving Party before disclosure, or is required to be disclosed by law (in which case the receiving Party will give the other Party prompt notice where lawful).");

  // ===== 13. TERM AND TERMINATION =====
  H2(doc, '13', 'Term and Termination');
  P_lead(doc, '13.1  Term. ', 'This Agreement begins on the Effective Date and continues until the earlier of (i) Placement and full payment of the Placement Fee, or (ii) twelve (12) months after the Effective Date, unless earlier terminated as provided herein.');
  P_lead(doc, '13.2  Termination by Family. ', 'The Family may terminate this Agreement at any time by written notice. The Retainer is not refundable upon termination, and the Family remains liable for any Placement Fee triggered before or after termination under Section 6 (Anti-Circumvention).');
  P_lead(doc, '13.3  Termination by Agency. ', "The Agency may terminate this Agreement immediately upon written notice if the Family (i) fails to pay any amount when due, (ii) breaches any material term of this Agreement, (iii) provides materially inaccurate information, or (iv) engages in conduct the Agency reasonably believes endangers a Candidate or compromises the Agency's reputation.");
  P_lead(doc, '13.4  Survival. ', 'Sections 4, 5, 6, 9, 10, 11, 12, 13.4, 14, and 15 survive termination or expiration of this Agreement.');

  // ===== 14. GOVERNING LAW =====
  H2(doc, '14', 'Governing Law; Dispute Resolution');
  P_lead(doc, '14.1  Governing Law. ', 'This Agreement is governed by the laws of the State of Illinois, without regard to its conflict-of-laws principles.');
  P_lead(doc, '14.2  Informal Resolution. ', 'Before initiating any formal proceeding, the Parties will attempt in good faith to resolve any dispute through direct negotiation for at least thirty (30) days after written notice of the dispute.');
  P_lead(doc, '14.3  Mediation. ', 'If informal resolution fails, the Parties will submit the dispute to non-binding mediation in Cook County, Illinois, before a mutually agreed mediator, with the costs shared equally.');
  P_lead(doc, '14.4  Venue. ', 'Any dispute not resolved through mediation will be brought exclusively in the state or federal courts located in Cook County, Illinois, and each Party consents to the personal jurisdiction and venue of those courts and waives any objection based on inconvenient forum.');
  P_lead(doc, "14.5  Attorneys' Fees. ", "In any action to enforce this Agreement or collect amounts due hereunder, the prevailing Party is entitled to recover its reasonable attorneys' fees, court costs, and expenses, in addition to any other relief awarded.");
  P_lead(doc, '14.6  Jury Waiver. ', 'EACH PARTY WAIVES ANY RIGHT TO A TRIAL BY JURY IN ANY ACTION ARISING OUT OF OR RELATING TO THIS AGREEMENT.');

  // ===== 15. GENERAL =====
  H2(doc, '15', 'General Provisions');
  P_lead(doc, '15.1  Entire Agreement. ', 'This Agreement is the entire agreement between the Parties regarding its subject matter and supersedes all prior or contemporaneous communications, representations, and agreements, whether oral or written.');
  P_lead(doc, '15.2  Amendment. ', 'No amendment is effective unless in writing and signed by both Parties.');
  P_lead(doc, '15.3  Assignment. ', "The Family may not assign this Agreement without the Agency's prior written consent. The Agency may assign this Agreement to a successor in connection with a sale, merger, or reorganization of its business.");
  P_lead(doc, '15.4  Severability. ', 'If any provision is held invalid or unenforceable, that provision will be enforced to the maximum extent permitted, and the remaining provisions will continue in full force and effect.');
  P_lead(doc, '15.5  Waiver. ', 'No failure or delay in exercising any right is a waiver, and no single or partial exercise precludes any further exercise of that or any other right.');
  P_lead(doc, '15.6  Notices. ', 'Notices must be in writing and sent by email or recognized overnight courier to the addresses in the signature block. Email notice is effective on transmission, absent a bounce-back.');
  P_lead(doc, '15.7  Independent Contractors. ', 'The Parties are independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, or employment relationship between the Parties or between the Agency and any Candidate.');
  P_lead(doc, '15.8  Force Majeure. ', 'Neither Party is liable for delay or failure to perform (other than payment obligations) caused by events beyond its reasonable control, including acts of God, illness, pandemic, government action, or labor disruption.');
  P_lead(doc, '15.9  Electronic Signatures and Counterparts. ', 'This Agreement may be executed in counterparts and by electronic signature, each of which is deemed an original and all of which together constitute one agreement.');
  P_lead(doc, '15.10  Headings. ', 'Headings are for convenience only and do not affect interpretation.');

  // ===== SIGNATURE BLOCK =====
  // Try to keep signature block on a fresh-ish area
  if (doc.y > doc.page.height - 280) doc.addPage();
  doc.moveDown(1);
  doc
    .font('Helvetica-Oblique')
    .fontSize(10)
    .text('IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.', {
      align: 'center',
    });
  doc.moveDown(1);

  // AGENCY
  doc.font('Helvetica-Bold').fontSize(10.5).text('THE AGENCY:');
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(10).text('The Formula');
  doc.moveDown(0.6);
  doc.font('Helvetica-Oblique').fontSize(11).text('Brittany Barrett', { indent: 20 });
  doc.font('Helvetica').fontSize(10).text('_________________________________________');
  doc.text('Name: Brittany Barrett');
  doc.text('Title: Founder');
  doc.text(`Date: ${signedDate}`);
  doc.text('Email: reach.theformula@gmail.com');

  doc.moveDown(1);

  // FAMILY
  doc.font('Helvetica-Bold').fontSize(10.5).text('THE FAMILY:');
  doc.moveDown(0.3);

  // Render signature
  renderSignature(doc, a);

  doc.font('Helvetica').fontSize(10);
  doc.text('_________________________________________');
  doc.text(`Printed Name: ${a.parent1_name || ''}`);
  doc.text(`Date: ${signedDate}`);

  if (a.parent2_name) {
    doc.moveDown(0.6);
    doc.font('Helvetica').fontSize(10).text('_________________________________________');
    doc.text(`Printed Name (second parent/guardian): ${a.parent2_name}`);
    doc.text(`Date: ${signedDate}`);
  }

  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).text(`Address: ${a.address || ''}`);
  doc.text(`Email: ${a.email || ''}`);
  doc.text(`Phone: ${a.phone || ''}`);

  // Footer note
  doc.moveDown(1.5);
  HR(doc);
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#666666').text(
    `Agreement ID: ${a.agreement_id}    •    Electronically signed on ${signedDate}    •    Retainer paid: ${a.paid_at ? formatDate(a.paid_at) : 'pending'}`,
    { align: 'center' }
  );
  doc.fillColor('black');
}

function renderSignature(doc, a) {
  const sig = a.signature_data;
  if (!sig) {
    doc.font('Helvetica-Oblique').fontSize(11).text('[signature on file]', { indent: 20 });
    return;
  }

  // Drawn signature stored as data URL
  if (typeof sig === 'string' && sig.startsWith('data:image')) {
    try {
      const base64 = sig.split(',')[1];
      const imgBuffer = Buffer.from(base64, 'base64');
      doc.image(imgBuffer, { width: 180 });
      return;
    } catch (e) {
      // fall through to typed rendering
    }
  }

  // Typed signature — render in a script-like font
  doc
    .font('Times-Italic')
    .fontSize(16)
    .text(sig, { indent: 20 });
}

module.exports = { generateAgreementPDF };
