
import { Pool as PgPool } from 'pg';

declare global {
  type Pool = PgPool;
}

export {};
