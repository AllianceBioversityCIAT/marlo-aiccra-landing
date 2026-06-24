import type { APIRoute } from 'astro';
import amqp from 'amqplib';
import { getAppConfig, validateAppConfig } from '../../lib/runtime-config';

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

  let config;
  try {
    config = await getAppConfig();
  } catch (err) {
    console.error('[contact] Config error:', err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: 'Server misconfiguration: unable to load config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const missingKey = validateAppConfig(config);
  if (missingKey) {
    return new Response(
      JSON.stringify({ error: `Server misconfiguration: missing ${missingKey}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const { rabbitmqUrl, clientId, clientSecret, teamEmail, emailQueue, emailSender } = config;

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
      from: { email: emailSender },
      emailBody: {
        subject: `New Contact Request`,
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
