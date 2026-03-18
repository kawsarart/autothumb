# AutoThumb — Deploy করার নির্দেশনা

## ধাপ ১ — GitHub-এ upload করো

1. github.com-এ যাও, নতুন repository বানাও (নাম: `autothumb`)
2. এই পুরো `autothumb-deploy` ফোল্ডারের সব ফাইল সেই repo-তে upload করো
   - Drag & drop করলেই হবে GitHub-এর web interface-এ

## ধাপ ২ — Vercel-এ deploy করো (FREE)

1. vercel.com-এ যাও
2. "Sign up" → GitHub দিয়ে login করো
3. "New Project" → তোমার `autothumb` repo select করো
4. "Deploy" button চাপো

## ধাপ ৩ — API Key যোগ করো (গুরুত্বপূর্ণ!)

Deploy হওয়ার পরে:

1. Vercel dashboard-এ তোমার project খোলো
2. Settings → Environment Variables-এ যাও
3. নতুন variable add করো:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** তোমার Anthropic API key (sk-ant-api03-...)
4. Save করো
5. Project → Deployments → "Redeploy" চাপো

## ধাপ ৪ — Live link পাও

Vercel automatically একটা link দেবে যেমন:
`https://autothumb-xyz.vercel.app`

এই link যে কাউকে দিলেই সে login ছাড়া use করতে পারবে!

---

## Anthropic API Key কোথায় পাবে?

1. console.anthropic.com-এ যাও
2. "API Keys" → "Create Key"
3. Key copy করে Vercel-এ paste করো

**মনে রাখো:** API usage-এর জন্য Anthropic charge করে।
প্রতি analysis-এ আনুমানিক $0.01-0.03 USD লাগবে।
