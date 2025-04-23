import 'dotenv/config'

export const { PORT, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, SIGNUP_CODE } = process.env as {
  PORT: string
  MONGODB_URI: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  SIGNUP_CODE: string
}

if (!PORT) {
  throw new Error('PORT environment variable is required but not set!')
}
