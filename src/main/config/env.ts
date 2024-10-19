export const env = {
  port: process.env.PORT ?? 8080,
  tokenSecret: process.env.TOKEN_SECRET ?? '',
  s3: {
    accessKey: process.env.S3_ACESS_KEY_ID ?? '',
    secret: process.env.S3_SECRET_ACESS_KEY ?? '',
    bucket: process.env.S3_BUCKET ?? '',
    region: process.env.S3_REGION ?? ''
  }
}
