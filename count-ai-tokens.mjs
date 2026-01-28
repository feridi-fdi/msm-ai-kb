#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

/**
 * TOKEN ESTIMATION RULES
 * Based on content type - more accurate for AI context
 */
const TOKEN_RULES = {
  code: 3.2,        // Code & JSON
  markdown: 3.8,    // Markdown files
  plain: 3.5,       // Plain text
  xml: 2.8,         // XML-like structures
  english: 4.0,     // English text
  indonesian: 3.5,  // Indonesian text
};

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "out",
  ".next", ".nuxt", "coverage", ".cache", ".turbo",
  ".idea", ".vscode",
]);

const IGNORE_FILES = new Set([
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "count-ai-tokens.mjs", "README.md"
]);

function getTokenRule(ext, content) {
  // Detect XML-like structures
  if (content.includes("<") || content.includes("<?xml")) {
    return ["xml", TOKEN_RULES.xml];
  }

  switch (ext) {
    case ".js":
    case ".ts":
    case ".jsx":
    case ".tsx":
    case ".json":
    case ".mjs":
    case ".cjs":
      return ["code", TOKEN_RULES.code];
    case ".md":
      return ["markdown", TOKEN_RULES.markdown];
    case ".xml":
    case ".html":
    case ".svg":
      return ["xml", TOKEN_RULES.xml];
    default:
      return ["plain", TOKEN_RULES.plain];
  }
}

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
let totalTokens = 0;
let totalFiles = 0;
const byType = new Map();
const byExt = new Map();

walk(ROOT, (file) => {
  const ext = path.extname(file).toLowerCase() || "(no-ext)";

  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return;
  }

  if (!isProbablyText(buf)) return;

  const content = buf.toString("utf8");
  const chars = content.length;
  const [type, divisor] = getTokenRule(ext, content);
  const tokens = Math.ceil(chars / divisor);

  totalChars += chars;
  totalTokens += tokens;
  totalFiles += 1;

  // Track by type
  const typeData = byType.get(type) || { chars: 0, tokens: 0, files: 0 };
  typeData.chars += chars;
  typeData.tokens += tokens;
  typeData.files += 1;
  byType.set(type, typeData);

  // Track by extension
  byExt.set(ext, (byExt.get(ext) ?? 0) + chars);
});

console.log(`Root                 : ${ROOT}`);
console.log(`Files (text)         : ${totalFiles}`);
console.log(`Total characters     : ${totalChars.toLocaleString("en-US")}`);
console.log(`Estimated tokens     : ${totalTokens.toLocaleString("en-US")}`);
console.log(`Avg ratio            : ${(totalChars / totalTokens).toFixed(2)} chars/token`);

console.log("\n📊 Token breakdown by content type:");
[...byType.entries()]
  .sort((a, b) => b[1].tokens - a[1].tokens)
  .forEach(([type, data]) => {
    const ratio = (data.chars / data.tokens).toFixed(2);
    console.log(
      `${type.padEnd(12)} ${data.tokens.toLocaleString("en-US").padStart(8)} tokens ` +
      `(${data.chars.toLocaleString("en-US")} chars, ${data.files} files, ${ratio} ratio)`
    );
  });

console.log("\n📁 Characters by extension:");
[...byExt.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([ext, n]) =>
    console.log(`${ext.padEnd(12)} ${n.toLocaleString("en-US")}`)
  );

console.log("\n💡 Token estimation rules:");
console.log(`   Code/JSON        : ~${TOKEN_RULES.code} chars/token`);
console.log(`   Markdown         : ~${TOKEN_RULES.markdown} chars/token`);
console.log(`   XML/HTML         : ~${TOKEN_RULES.xml} chars/token`);
console.log(`   Plain text       : ~${TOKEN_RULES.plain} chars/token`);

console.log("\n⚠️  Note: Actual AI instruction tokens include:");
console.log("   • System instructions overhead (XML structure)");
console.log("   • Tool definitions (~8K-9K tokens)");
console.log("   • Context & conversation history");
console.log("   • Message metadata & formatting");
