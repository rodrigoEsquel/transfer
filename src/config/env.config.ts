export function getEnvConfig() {
  return {
    server: {
      port: Number(process.env.PORT),
      env: process.env.NODE_ENV,
    },
    token: {
      accessSecret: process.env.TOKEN_ACCESS_SECRET,
      refreshSecret: process.env.TOKEN_REFRESH_SECRET,
      accessTokenDuration: process.env.TOKEN_ACCESS_DURATION,
      refreshTokenDuration: process.env.TOKEN_REFRESH_DURATION,
    },
  };
}
