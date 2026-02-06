import { registerAs } from '@nestjs/config';

/**
 * Database config.
 * Prisma ใช้เฉพาะ DATABASE_URL จาก .env
 * ถ้าต้องการใช้แยก DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 * ให้ตั้งค่าเหล่านั้นแล้วสร้าง DATABASE_URL ใน .env แบบนี้:
 * DATABASE_URL="postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%?schema=public"
 * หรือใส่ค่าเต็มใน DATABASE_URL เลย
 */
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'password';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const name = process.env.DB_NAME || 'hr_management';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}?schema=public`;
}

export default registerAs('database', () => ({
  url: getDatabaseUrl(),
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'hr_management',
}));
