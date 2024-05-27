import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV
const envFilename = `.env.${env}`

if (!env) {
  console.log(`Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  console.log(`Phát hiện NODE_ENV = ${env}`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${env}, vì thế app sẽ dùng file môi trường là ${envFilename}`)
if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
  console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
  process.exit(1)
}

config({
  path: envFilename
})

export const isProduction = env === 'production'

export const ENV_CONFIG = {
  PORT: process.env.PORT as string,
  HOST: process.env.HOST as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,
  STATIC_IMAGES_PATH: process.env.STATIC_IMAGES_PATH as string,

  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_ROLES_COLLECTION_NAME: process.env.DB_ROLES_COLLECTION_NAME as string,
  DB_USERS_COLLECTION_NAME: process.env.DB_USERS_COLLECTION_NAME as string,
  DB_REFRESH_TOKENS_COLLECTION_NAME: process.env.DB_REFRESH_TOKENS_COLLECTION_NAME as string,
  DB_FILES_COLLECTION_NAME: process.env.DB_FILES_COLLECTION_NAME as string,
  DB_USER_ROLES_COLLECTION_NAME: process.env.DB_USER_ROLES_COLLECTION_NAME as string,
  DB_ADDRESSES_COLLECTION_NAME: process.env.DB_ADDRESSES_COLLECTION_NAME as string,
  DB_PROVINCES_COLLECTION_NAME: process.env.DB_PROVINCES_COLLECTION_NAME as string,
  DB_PRODUCT_CATEGORIES_COLLECTION_NAME: process.env.DB_PRODUCT_CATEGORIES_COLLECTION_NAME as string,
  DB_BRANDS_COLLECTION_NAME: process.env.DB_BRANDS_COLLECTION_NAME as string,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_VERIFY_EMAIL_TOKEN_SECRET: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET as string,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
  JWT_ACCESS_TOKEN_EXPIRED_IN: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN as string,
  JWT_REFRESH_TOKEN_EXPIRED_IN: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN as string,
  JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN: process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN as string,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN as string,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_REGION: process.env.AWS_REGION as string,
  AWS_SES_FROM_ADDRESS: process.env.AWS_SES_FROM_ADDRESS as string,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string
} as const
