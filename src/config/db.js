// JavaScript Document
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: "postgresql://postgres.wmqxqewiuxhfykcpcipo:Pelana_novasites...@aws-1-us-west-2.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});