#!/usr/bin/env node
/**
 * Supabase セットアップスクリプト
 * 使い方: npm run db:setup
 *
 * 必要な環境変数（.env.local に記載）:
 *   NEXT_PUBLIC_SUPABASE_URL      ... https://<ref>.supabase.co
 *   SUPABASE_ACCESS_TOKEN         ... Supabase ダッシュボード > Account > Access Tokens
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, "..");

// .env.local を読み込む
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  } catch {
    // .env.local がない場合は process.env にフォールバック
  }
  return { ...process.env, ...env };
}

const env = loadEnv();

const supabaseUrl   = env.NEXT_PUBLIC_SUPABASE_URL;
const accessToken   = env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || supabaseUrl.includes("your-project-id")) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL が設定されていません (.env.local を確認してください)");
  process.exit(1);
}
if (!accessToken || accessToken.includes("your-")) {
  console.error("❌  SUPABASE_ACCESS_TOKEN が設定されていません");
  console.error("    取得先: https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

// プロジェクト参照IDを URL から抽出
const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!match) {
  console.error("❌  SUPABASE_URL の形式が不正です:", supabaseUrl);
  process.exit(1);
}
const projectRef = match[1];

async function runSQL(sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${label} 失敗 (${res.status}): ${body}`);
  }
}

async function main() {
  console.log(`\n🚀 FlowRev DB セットアップ開始`);
  console.log(`   プロジェクト: ${projectRef}\n`);

  // migrations/ フォルダの SQL ファイルを順番に実行
  const migrationsDir = resolve(ROOT, "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = readFileSync(resolve(migrationsDir, file), "utf8");
    process.stdout.write(`   ▶ ${file} ... `);
    try {
      await runSQL(sql, file);
      console.log("✅");
    } catch (err) {
      console.log("⚠️  (スキップ: 既に存在する可能性があります)");
      // CREATE IF NOT EXISTS などで既に存在する場合はスキップ扱い
    }
  }

  // seed.sql があれば実行
  try {
    const seedPath = resolve(ROOT, "supabase", "seed.sql");
    const seedSql = readFileSync(seedPath, "utf8");
    process.stdout.write(`   ▶ seed.sql ... `);
    await runSQL(seedSql, "seed.sql");
    console.log("✅");
  } catch {
    // seed.sql がない場合は無視
  }

  console.log("\n✨ セットアップ完了！\n");
  console.log("   次のステップ:");
  console.log("   1. npm run dev  でアプリを起動");
  console.log("   2. /signup  でアカウントを作成\n");
}

main().catch((err) => {
  console.error("\n❌ エラー:", err.message);
  process.exit(1);
});
