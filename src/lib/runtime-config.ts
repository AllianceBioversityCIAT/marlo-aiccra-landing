import { getAppSecrets } from './secrets';
import { runtimeEnv } from './env';

export interface AppConfig {
  rabbitmqUrl: string;
  clientId: string;
  clientSecret: string;
  teamEmail: string;
  emailQueue: string;
  emailSender: string;
}

const SECRET_KEYS = {
  rabbitmqUrl: 'RABBITMQ_URL',
  clientId: 'NOTIFICATION_CLIENT_ID',
  clientSecret: 'NOTIFICATION_CLIENT_SECRET',
  teamEmail: 'MARLO_TEAM_EMAIL',
  emailQueue: 'EMAIL_QUEUE',
  emailSender: 'EMAIL_SENDER',
} as const;

function fromEnv(): AppConfig {
  return {
    rabbitmqUrl: runtimeEnv('RABBITMQ_URL') ?? '',
    clientId: runtimeEnv('NOTIFICATION_CLIENT_ID') ?? '',
    clientSecret: runtimeEnv('NOTIFICATION_CLIENT_SECRET') ?? '',
    teamEmail: runtimeEnv('MARLO_TEAM_EMAIL') ?? '',
    emailQueue: runtimeEnv('EMAIL_QUEUE') ?? '',
    emailSender: runtimeEnv('EMAIL_SENDER') ?? '',
  };
}

function fromSecretStore(secrets: Record<string, string>): AppConfig {
  return {
    rabbitmqUrl: secrets[SECRET_KEYS.rabbitmqUrl] ?? '',
    clientId: secrets[SECRET_KEYS.clientId] ?? '',
    clientSecret: secrets[SECRET_KEYS.clientSecret] ?? '',
    teamEmail: secrets[SECRET_KEYS.teamEmail] ?? '',
    emailQueue: secrets[SECRET_KEYS.emailQueue] ?? '',
    emailSender: secrets[SECRET_KEYS.emailSender] ?? '',
  };
}

/**
 * Lambda: reads from AWS Secrets Manager when SECRET_NAME is set.
 * Local dev / static rollback: reads from import.meta.env (.env file).
 */
export async function getAppConfig(): Promise<AppConfig> {
  if (runtimeEnv('SECRET_NAME')) {
    const secrets = await getAppSecrets();
    return fromSecretStore(secrets);
  }

  return fromEnv();
}

export function validateAppConfig(config: AppConfig): string | null {
  if (!config.rabbitmqUrl) return 'RABBITMQ_URL';
  if (!config.clientId) return 'NOTIFICATION_CLIENT_ID';
  if (!config.clientSecret) return 'NOTIFICATION_CLIENT_SECRET';
  if (!config.teamEmail) return 'MARLO_TEAM_EMAIL';
  if (!config.emailQueue) return 'EMAIL_QUEUE';
  if (!config.emailSender) return 'EMAIL_SENDER';
  return null;
}
