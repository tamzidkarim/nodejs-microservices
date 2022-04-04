import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, OMDB_API_KEY } = process.env;

if (!SECRET_KEY || !OMDB_API_KEY) {
  throw new Error('Missing SECRET_KEY OR OMDB_API_KEY env var. Set it and restart the server');
}
