const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'no-reply@grownroot.com';

if (!BREVO_API_KEY) {
  console.warn('BREVO_API_KEY is not configured. Email sending will fail.');
}

export async function sendOtpEmail(to, otpCode) {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo is not configured (missing BREVO_API_KEY).');
  }

  const body = {
    sender: {
      name: 'GrownRoot',
      email: BREVO_FROM_EMAIL,
    },
    to: [{ email: to }],
    subject: 'Your GrownRoot verification code',
    textContent: `Your GrownRoot verification code is ${otpCode}. It expires in 15 minutes.`,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    const err = new Error(`Brevo request failed (${res.status}): ${errorText}`);
    err.status = res.status;
    throw err;
  }
}
