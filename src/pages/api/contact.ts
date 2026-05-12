import type { APIRoute } from 'astro';
import amqp from 'amqplib';

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
        message: { text },
      },
    },
  };

  let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
  try {
    connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    const rabbitMsg = { pattern: 'send', data: payload };
    channel.sendToQueue(emailQueue, Buffer.from(JSON.stringify(rabbitMsg)), {
      contentType: 'application/json',
    });
    await channel.close();
  } catch (err) {
    console.error('[contact] RabbitMQ error:', err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: 'Failed to queue notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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
