/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SECRET_NAME?: string;
  readonly AWS_REGION?: string;
  readonly RABBITMQ_URL?: string;
  readonly NOTIFICATION_CLIENT_ID?: string;
  readonly NOTIFICATION_CLIENT_SECRET?: string;
  readonly MARLO_TEAM_EMAIL?: string;
  readonly EMAIL_QUEUE?: string;
  readonly EMAIL_SENDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
