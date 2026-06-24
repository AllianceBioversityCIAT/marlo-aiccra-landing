import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({
  region: import.meta.env.AWS_REGION ?? 'us-east-1',
});

let cachedSecrets: Record<string, string> | null = null;

export async function getAppSecrets(): Promise<Record<string, string>> {
  if (cachedSecrets) return cachedSecrets;

  const secretName = import.meta.env.SECRET_NAME;
  if (!secretName) {
    throw new Error('SECRET_NAME is not configured');
  }

  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));

  if (!response.SecretString) {
    throw new Error('Secret value is empty or not a string');
  }

  cachedSecrets = JSON.parse(response.SecretString) as Record<string, string>;
  return cachedSecrets;
}
