import type { APIRoute } from 'astro';
import amqp from 'amqplib';
import fs from 'node:fs';
import path from 'node:path';

function buildEmailHtml(fields: {
  name: string;
  organization: string;
  email: string;
  role?: string;
  message?: string;
  logoBase64: string;
}): string {
  const { name, organization, email, role, message, logoBase64 } = fields;

  const roleRow = role
    ? `<tr><td style="display:flex;padding:10px 18px;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:13px;color:#6b7280;width:110px;flex-shrink:0;">Role</span>
        <span style="font-size:13px;color:#111827;font-weight:500;">${role}</span>
       </td></tr>`
    : '';

  const messageRow = message
    ? `<tr><td style="padding:10px 18px;">
        <span style="font-size:13px;color:#6b7280;display:block;margin-bottom:6px;">Message</span>
        <span style="font-size:13px;color:#374151;line-height:1.6;font-style:italic;">&ldquo;${message}&rdquo;</span>
       </td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Demo Request</title></head>
<body style="margin:0;padding:0;background:#e5e7eb;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e5e7eb;padding:24px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:#2563eb;height:4px;border-radius:4px 4px 0 0;font-size:0;">&nbsp;</td></tr>
  <tr><td style="background:#ffffff;padding:24px 32px 20px;border-bottom:1px solid #e5e7eb;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><table cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <img src="data:image/png;base64,${logoBase64}" alt="MARLO" width="36" height="36" style="display:block;width:36px;height:36px;object-fit:contain;" />
        </td>
        <td style="vertical-align:middle;">
          <span style="font-weight:700;font-size:15px;color:#0f2a47;">MARLO</span>
          <span style="font-size:12px;color:#6b7280;margin-left:5px;">AICCRA Platform</span>
        </td>
      </tr></table></td>
      <td align="right"><span style="font-size:11px;color:#9ca3af;background:#f3f4f6;padding:3px 10px;border-radius:20px;">Demo Request</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;padding:28px 32px 24px;">
    <div style="font-size:22px;font-weight:700;color:#0f2a47;margin-bottom:6px;">New demo request received</div>
    <div style="font-size:14px;color:#6b7280;line-height:1.5;">
      <strong style="color:#111827;">${name}</strong> from
      <strong style="color:#111827;">${organization}</strong> has requested a personalized walkthrough of the MARLO platform.
    </div>
  </td></tr>
  <tr><td style="background:#ffffff;padding:0 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <tr><td style="background:#f8f9fa;padding:12px 18px;border-bottom:1px solid #e5e7eb;">
        <span style="font-size:11px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.6px;">Contact Details</span>
      </td></tr>
      <tr><td style="padding:4px 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:10px 18px;border-bottom:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;color:#6b7280;width:110px;">Name</td>
              <td style="font-size:13px;color:#111827;font-weight:500;">${name}</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 18px;border-bottom:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;color:#6b7280;width:110px;">Organization</td>
              <td style="font-size:13px;color:#111827;font-weight:500;">${organization}</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 18px;border-bottom:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;color:#6b7280;width:110px;">Email</td>
              <td><a href="mailto:${email}" style="font-size:13px;color:#2563eb;text-decoration:none;">${email}</a></td>
            </tr></table>
          </td></tr>
          ${role ? `<tr><td style="padding:10px 18px;border-bottom:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;color:#6b7280;width:110px;">Role</td>
              <td style="font-size:13px;color:#111827;font-weight:500;">${role}</td>
            </tr></table>
          </td></tr>` : ''}
          ${message ? `<tr><td style="padding:10px 18px;">
            <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">Message</div>
            <div style="font-size:13px;color:#374151;line-height:1.6;font-style:italic;">&ldquo;${message}&rdquo;</div>
          </td></tr>` : ''}
        </table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#ffffff;padding:0 32px 28px;">
    <a href="mailto:${email}?subject=Re%3A%20MARLO%20Demo%20Request"
       style="display:block;background:#0f2a47;color:#ffffff;text-align:center;padding:14px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
      Reply to ${name} &#8594;
    </a>
  </td></tr>
  <tr><td style="background:#ffffff;padding:0 32px;"><div style="border-top:1px solid #e5e7eb;font-size:0;">&nbsp;</div></td></tr>
  <tr><td style="background:#ffffff;padding:20px 32px;border-radius:0 0 4px 4px;text-align:center;">
    <span style="font-size:12px;color:#9ca3af;">This notification was sent automatically by the </span>
    <span style="font-size:12px;color:#6b7280;font-weight:500;">MARLO AICCRA Platform</span><br>
    <span style="font-size:11px;color:#d1d5db;">&#169; 2025 CGIAR AICCRA &middot; All rights reserved</span>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, organization, email, role, message } = body;

  if (!name || !organization || !email) {
    return new Response(JSON.stringify({ error: 'Name, organization and email are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rabbitmqUrl = import.meta.env.RABBITMQ_URL;
  const clientId = import.meta.env.NOTIFICATION_CLIENT_ID;
  const clientSecret = import.meta.env.NOTIFICATION_CLIENT_SECRET;
  const teamEmail = import.meta.env.MARLO_TEAM_EMAIL;
  const emailQueue = import.meta.env.EMAIL_QUEUE;
  const emailSender = import.meta.env.EMAIL_SENDER;

  if (!rabbitmqUrl || !clientId || !clientSecret || !teamEmail || !emailQueue || !emailSender) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration: missing env vars' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const text = [
    `Name: ${name}`,
    `Organization: ${organization}`,
    `Email: ${email}`,
    role ? `Role: ${role}` : null,
    message ? `Message: ${message}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const logoPath = path.join(process.cwd(), 'public', 'marlo-logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const htmlBody = buildEmailHtml({ name, organization, email, role, message, logoBase64 });
  const socketFile = Buffer.from(htmlBody).toString('base64');

  const payload = {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    data: {
      from: { email: emailSender, name: 'Marlo AICCRA' },
      emailBody: {
        subject: `New Demo Request – ${name} (${organization})`,
        to: [teamEmail],
        cc: [],
        bcc: [],
        message: { text, socketFile },
      },
    },
  };

  let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
  try {
    connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    // pattern: 'send' is the routing key the NestJS handler listens for
    const rabbitMsg = { pattern: 'send', data: payload };
    channel.sendToQueue(emailQueue, Buffer.from(JSON.stringify(rabbitMsg)), {
      contentType: 'application/json',
    });
    await channel.close();
  } catch (err) {
    console.error('[contact] RabbitMQ error:', err instanceof Error ? err.message : err);
    return new Response(
      JSON.stringify({ error: 'Failed to queue notification' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    if (connection) await connection.close().catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
