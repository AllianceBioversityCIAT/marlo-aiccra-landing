/**
 * Server-side env access. In Lambda/Docker, runtime vars come from process.env.
 * import.meta.env is resolved at build time and won't see Lambda env vars.
 */
export function runtimeEnv(name: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env[name] : undefined;
  if (fromProcess) return fromProcess;

  const fromImportMeta = import.meta.env[name as keyof ImportMetaEnv];
  return typeof fromImportMeta === 'string' ? fromImportMeta : undefined;
}
