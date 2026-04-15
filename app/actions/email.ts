'use server'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(email: string, targetName: string) {
  await resend.emails.send({
    from: 'ScamBud <onboarding@resend.dev>',
    to: [email],
    subject: 'Report Approved!',
    html: `<h1>Congrats!</h1><p>Your report for <b>${targetName}</b> is now live.</p>`
  });
}