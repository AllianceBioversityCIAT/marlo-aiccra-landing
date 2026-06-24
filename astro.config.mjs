// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deployment target:
 * - lambda (default): SSR on AWS Lambda via @astro-aws/adapter
 * - static: legacy S3 + CloudFront static deploy (rollback)
 *
 * Usage:
 *   DEPLOY_TARGET=lambda npm run build   # or npm run build:lambda
 *   DEPLOY_TARGET=static npm run build   # or npm run build:static
 */
const deployTarget = process.env.DEPLOY_TARGET === 'static' ? 'static' : 'lambda';

const shared = {
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@lucide/astro'],
    },
  },
};

/** @type {import('astro').AstroUserConfig} */
const staticConfig = {
  ...shared,
  output: 'static',
  adapter: (await import('@astrojs/node')).default({ mode: 'standalone' }),
};

/** @type {import('astro').AstroUserConfig} */
const lambdaConfig = {
  ...shared,
  output: 'server',
  adapter: (await import('@astro-aws/adapter')).default({ mode: 'ssr' }),
};

// https://astro.build/config
export default defineConfig(deployTarget === 'static' ? staticConfig : lambdaConfig);
