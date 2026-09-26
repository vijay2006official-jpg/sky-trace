# 🚀 Public Website Deployment & Custom Domain Setup Guide

Your website **Voyex AI** is built as a lightning-fast, zero-dependency, standalone modern web application.

---

## ⚡ Step 1: Previewing Locally Right Now
You can view and test the website right now:
1. **Option A (Direct File)**: Double-click `index.html` in your file explorer to open it in any web browser (Chrome, Edge, Safari, Firefox).
2. **Option B (Local Web Server)**: In PowerShell/Terminal in this folder, run:
   ```bash
   npx serve .
   ```
   and open `http://localhost:3000`.

---

## 🌐 Step 2: Publish Your Website to the Public Internet (Free in 2 Minutes)

You can publish this site instantly for free on **Vercel** or **Netlify**:

### Method A: Deploy on Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in or sign up with GitHub/Google.
2. Click **"Add New Project"** -> Drag and drop this folder (`ai travel planner new`), or push this folder to GitHub and select the repository.
3. Click **"Deploy"**.
4. In ~15 seconds, your website is live on a public URL like `https://voyex-ai.vercel.app`!

### Method B: Deploy on Netlify (Drag & Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop your `ai travel planner new` folder into the upload box.
3. Your website goes live immediately!

---

## 🏷️ Step 3: Connect Your Custom Domain (e.g., `yourtravelsite.com`)

Once deployed on Vercel or Netlify, you can attach any custom domain purchased from GoDaddy, Namecheap, Google Domains, Cloudflare, Hostinger, etc.:

### 1. In Vercel / Netlify:
- Go to your Project -> **Settings** -> **Domains**.
- Enter your domain name (e.g., `www.yourtravelsite.com` and `yourtravelsite.com`).

### 2. In your Domain Registrar (GoDaddy, Namecheap, Cloudflare, etc.):
Go to the **DNS Management / DNS Records** section and add:

| Record Type | Name / Host | Target / Value |
| :--- | :--- | :--- |
| **A Record** | `@` (or blank) | `76.76.21.21` *(for Vercel)* or your provider's IP |
| **CNAME Record** | `www` | `cname.vercel-dns.com` *(for Vercel)* |

*Automatic free SSL certificates (HTTPS) are provisioned automatically within a few minutes.*

---

## 🎨 Step 4: Customizing Your Brand Name & Logo
- To change the name from **Voyex AI** to your own brand:
  1. Open `index.html` and edit `<title>` and the brand name inside the `<header>` section.
  2. Modify the tagline or description as you wish.
