export function getEnvConfig() {
  return {
    server: {
      port: Number(process.env.PORT),
      env: process.env.NODE_ENV,
    },
  };
}
