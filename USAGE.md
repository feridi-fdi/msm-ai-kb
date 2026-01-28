# Count AI Tokens - Usage Guide

## 🎯 Tujuan

Script ini menghitung estimasi token untuk konten repository yang akan digunakan sebagai context AI (seperti GitHub Copilot, Claude, ChatGPT, dll).

## 📦 Instalasi

Tidak perlu instalasi khusus, cukup Node.js v18+.

## 🚀 Cara Penggunaan

### 1. Test pada repository saat ini
```bash
node count-ai-tokens.mjs
```

### 2. Test pada repository lain
```bash
# Absolute path
node count-ai-tokens.mjs /home/user/my-project

# Relative path
node count-ai-tokens.mjs ../other-project

# Home directory
node count-ai-tokens.mjs ~/projects/my-app
```

### 3. Copy script ke repo lain
```bash
# Copy file
cp count-ai-tokens.mjs /path/to/other/repo/

# Jalankan di repo tersebut
cd /path/to/other/repo
node count-ai-tokens.mjs
```

## 📊 Output yang Dihasilkan

```
Root                 : /path/to/repo
Files (text)         : 150
Total characters     : 245,789
Estimated tokens     : 78,234
Avg ratio            : 3.14 chars/token

📊 Token breakdown by content type:
code            45,678 tokens (146,168 chars, 120 files, 3.20 ratio)
markdown         8,234 tokens (31,289 chars, 25 files, 3.80 ratio)
xml              2,456 tokens (6,879 chars, 5 files, 2.80 ratio)

📁 Characters by extension:
.ts          125,456
.tsx          45,789
.md           31,289
.json         15,678
...
```

## 🧪 Test Cases

### Contoh 1: Small Project
```bash
node count-ai-tokens.mjs ~/projects/simple-api
# Expected: ~2K-5K tokens
```

### Contoh 2: Medium Project (Next.js app)
```bash
node count-ai-tokens.mjs ~/projects/my-nextjs-app
# Expected: ~10K-30K tokens
```

### Contoh 3: Large Monorepo
```bash
node count-ai-tokens.mjs ~/projects/monorepo
# Expected: 50K+ tokens
```

## ⚙️ Konfigurasi

Edit file `count-ai-tokens.mjs` untuk menyesuaikan:

### 1. Token Rules (baris 11-18)
```javascript
const TOKEN_RULES = {
  code: 3.2,        // Ubah sesuai kebutuhan
  markdown: 3.8,
  xml: 2.8,
  // ... dst
};
```

### 2. Ignore Directories (baris 20-24)
```javascript
const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist",
  "your-custom-folder",  // Tambahkan folder yang ingin diabaikan
]);
```

### 3. Ignore Files (baris 26-30)
```javascript
const IGNORE_FILES = new Set([
  "package-lock.json",
  "your-file.txt",  // Tambahkan file yang ingin diabaikan
]);
```

## 🔬 Validasi Akurasi

Untuk memvalidasi apakah estimasi akurat:

1. **Upload file ke AI dan bandingkan**:
   - Estimasi script: 5,000 tokens
   - Actual usage: 5,200 tokens
   - Akurasi: ~96%

2. **Gunakan tokenizer library**:
   ```bash
   npm install @anthropic-ai/tokenizer
   ```
   
   ```javascript
   import { encode } from '@anthropic-ai/tokenizer';
   const actualTokens = encode(content).length;
   ```

3. **Check API response**:
   - Claude API mengembalikan `usage.input_tokens`
   - Bandingkan dengan estimasi script

## ⚠️ Catatan Penting

### Yang DIHITUNG:
- ✅ File konten (code, markdown, config)
- ✅ Struktur XML/HTML
- ✅ Comments & documentation

### Yang TIDAK DIHITUNG:
- ❌ System instructions overhead (~3-4K tokens)
- ❌ Tool definitions (~8-9K tokens)
- ❌ Conversation history
- ❌ Message metadata & formatting
- ❌ Binary files (images, PDFs)

### Margin of Error:
- **Small repos** (<5K tokens): ±5-10%
- **Medium repos** (5K-50K): ±10-15%
- **Large repos** (>50K): ±15-20%

## 🎓 Tips & Best Practices

### 1. Optimize untuk AI Context
```bash
# Check token usage
node count-ai-tokens.mjs

# Jika terlalu besar (>100K tokens):
# - Tambahkan folder ke IGNORE_DIRS
# - Exclude test files
# - Remove generated files
```

### 2. Monitor Perubahan
```bash
# Before adding new features
node count-ai-tokens.mjs > before.txt

# After changes
node count-ai-tokens.mjs > after.txt

# Compare
diff before.txt after.txt
```

### 3. CI/CD Integration
```bash
# .github/workflows/check-tokens.yml
- name: Check token count
  run: |
    TOKEN_COUNT=$(node count-ai-tokens.mjs | grep "Estimated tokens" | awk '{print $4}' | tr -d ',')
    if [ $TOKEN_COUNT -gt 50000 ]; then
      echo "Warning: Token count too high: $TOKEN_COUNT"
      exit 1
    fi
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Pastikan menggunakan Node.js v18+
node --version

# Update Node.js jika perlu
nvm install 20
nvm use 20
```

### Error: "Permission denied"
```bash
chmod +x count-ai-tokens.mjs
./count-ai-tokens.mjs
```

### Output tidak sesuai ekspektasi
```bash
# Check ignored directories
# Edit IGNORE_DIRS di script

# Debug mode (tambahkan console.log di function walk)
```

## 📚 Resources

- [Claude Token Counting](https://docs.anthropic.com/claude/reference/token-counting)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- [GitHub Copilot Context](https://docs.github.com/en/copilot)

## 🤝 Contributing

Ingin improve script ini? Silakan:
1. Fork repo
2. Improve token estimation rules
3. Add tests
4. Submit PR
