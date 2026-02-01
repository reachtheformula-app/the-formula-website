# The Formula - Marketing Website

## 🚀 Deploy to Netlify (Step-by-Step)

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it `the-formula-website`
4. Click **Create repository**

### Step 2: Upload These Files to GitHub

1. On your new empty repo page, click **"uploading an existing file"**
2. Drag and drop **ALL files and folders** from this package:
   - `src/` folder
   - `public/` folder
   - `package.json`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`
   - `netlify.toml`
3. Click **Commit changes**

### Step 3: Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (or create account)
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** and authorize Netlify if prompted
4. Find and select your `the-formula-website` repository
5. Netlify auto-detects settings from `netlify.toml` - just click **Deploy site**
6. Wait 1-2 minutes for the build to complete

### Step 4: You're Live! 🎉

Your site will be available at a URL like: `https://random-name.netlify.app`

---

## 🌐 Custom Domain (Optional)

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `theformula.co`)
4. Follow instructions to update your DNS settings
5. HTTPS is enabled automatically (free)

---

## 🔗 App Connection

All "Launch App" buttons link to: **https://theformula-app.netlify.app/**

---

## 📁 Project Structure

```
the-formula-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── FormulaWebsite.jsx   ← Main website
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── netlify.toml
```

---

## 💻 Local Development (Optional)

```bash
npm install
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
```
