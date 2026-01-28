#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

/**
 * TOKEN ESTIMATION CONFIG
 * ENGLISH  : 4
 * INDONESIA: 3.5 (default)
 */
const TOKEN_DIVISOR = 3.5;

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  "coverage",
  ".cache",
  ".turbo",
  ".idea",
  ".vscode",
  ".mjs",
  ".sh",
]);

const IGNORE_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "README.md",
  "count-chars-and-tokens.mjs"
]);

const ONLY_EXT = new Set([
  // ".js", ".ts", ".json", ".md", ".yml", ".yaml", ".sql"
]);

function isProbablyText(buffer) {
  return !buffer.includes(0);
}

function walk(dir, onFile) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      if (!IGNORE_DIRS.has(ent.name)) walk(full, onFile);
      continue;
    }

    if (!ent.isFile()) continue;
    if (IGNORE_FILES.has(ent.name)) continue;

    onFile(full);
  }
}

let totalChars = 0;
let totalFiles = 0;
const byExt = new Map();

walk(ROOT, (file) => {
  const ext = path.extname(file).toLowerCase() || "(no-ext)";
  if (ONLY_EXT.size && !ONLY_EXT.has(ext)) return;

  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return;
  }

  if (!isProbablyText(buf)) return;

  const chars = buf.toString("utf8").length;

  totalChars += chars;
  totalFiles += 1;
  byExt.set(ext, (byExt.get(ext) ?? 0) + chars);
});

const estimatedTokens = Math.ceil(totalChars / TOKEN_DIVISOR);

console.log(`Root                 : ${ROOT}`);
console.log(`Files (text)         : ${totalFiles}`);
console.log(`Total characters     : ${totalChars.toLocaleString("en-US")}`);
console.log(`Estimated tokens     : ${estimatedTokens.toLocaleString("en-US")}`);
console.log(`Token formula        : tokens ≈ characters / ${TOKEN_DIVISOR}`);

console.log("\nCharacters by extension:");
[...byExt.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([ext, n]) =>
    console.log(`${ext.padEnd(10)} ${n.toLocaleString("en-US")}`)
  );
