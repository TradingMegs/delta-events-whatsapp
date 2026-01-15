# Koyeb Deployment Guide - WhatsApp Service (Baileys)

## Why Koyeb?

✅ **FREE Tier includes:**
- 512MB RAM (perfect for Baileys)
- Persistent storage (critical for WhatsApp sessions)
- Always-on (no cold starts)
- Automatic HTTPS
- GitHub integration

---

## Quick Deployment Steps

### 1. Create Koyeb Account
1. Go to https://www.koyeb.com/
2. Sign up with GitHub (easiest)
3. Verify your email

### 2. Deploy from GitHub

**Option A: Via Koyeb Dashboard (Recommended)**

1. Click **"Create App"**
2. Select **"GitHub"** as source
3. Connect your GitHub account
4. Select repository: `delta-events-whatsapp` (or your repo name)
5. Configure:
   - **Name**: `delta-whatsapp`
   - **Region**: Choose closest to you (e.g., Washington DC)
   - **Instance**: `Nano` (512MB - FREE)
   - **Port**: `3001`
   - **Build**: Docker
   - **Dockerfile path**: `Dockerfile`

6. **Environment Variables**:
   ```
   PORT=3001
   NODE_ENV=production
   ALLOWED_ORIGINS=https://app.deltaevents.co.za
   ```

7. **Persistent Storage** (CRITICAL!):
   - Click "Add Volume"
   - Mount path: `/app/sessions`
   - Size: `1GB`

8. Click **"Deploy"**

---

**Option B: Via Koyeb CLI**

```bash
# Install Koyeb CLI
npm install -g @koyeb/cli

# Login
koyeb login

# Deploy
koyeb app init delta-whatsapp \
  --git github.com/YOUR_USERNAME/YOUR_REPO \
  --git-branch main \
  --ports 3001:http \
  --routes /:3001 \
  --env PORT=3001 \
  --env NODE_ENV=production \
  --env ALLOWED_ORIGINS=https://app.deltaevents.co.za \
  --instance-type nano \
  --regions was \
  --docker Dockerfile

# Add persistent volume
koyeb volume create whatsapp-sessions --size 1 --region was
koyeb service update delta-whatsapp --volume whatsapp-sessions:/app/sessions
```

---

## 3. Get Your Service URL

After deployment (takes ~3-5 minutes):

1. Go to your Koyeb dashboard
2. Click on your app
3. Copy the **Public URL** (e.g., `delta-whatsapp-YOUR_ORG.koyeb.app`)

---

## 4. Update Convex

1. Go to **Convex Dashboard** → **Settings** → **Environment Variables**
2. Add/Update:
   ```
   WHATSAPP_SERVICE_URL=https://delta-whatsapp-YOUR_ORG.koyeb.app
   ```

---

## 5. Connect WhatsApp

1. Go to your admin dashboard → **System Settings** → **WhatsApp**
2. Click **"Connect"**
3. Scan the QR code
4. Done! ✅

---

## Monitoring & Logs

### View Logs
```bash
koyeb logs delta-whatsapp -f
```

Or in the dashboard: **App → Logs**

### Check Status
```bash
koyeb service get delta-whatsapp
```

---

## Troubleshooting

### QR Code Not Showing?
- Check logs for errors
- Ensure port 3001 is exposed
- Verify Dockerfile is correct

### Session Lost After Restart?
- Ensure persistent volume is mounted at `/app/sessions`
- Check volume is attached in Koyeb dashboard

### Out of Memory?
- Upgrade to Micro instance (1GB RAM) - still FREE on trial
- Check for memory leaks in logs

---

## Cost

**FREE Forever** (with limits):
- 1 Nano instance (512MB)
- 1GB persistent storage
- Unlimited bandwidth
- Automatic SSL

**No credit card required for free tier!**

---

## Advantages Over Other Platforms

| Feature | Koyeb | Fly.io | Railway | Render |
|---------|-------|--------|---------|--------|
| Free RAM | 512MB | 256MB | 512MB | 512MB |
| Persistent Storage | ✅ Free | ❌ Paid | ❌ Paid | ❌ Paid |
| Always On | ✅ | ❌ | ✅ | ❌ |
| Setup Difficulty | Easy | Hard | Medium | Easy |
| GitHub Integration | ✅ | ❌ | ✅ | ✅ |

---

## Next Steps

1. **Sign up**: https://www.koyeb.com/
2. **Connect GitHub**
3. **Deploy** (follow steps above)
4. **Update Convex** with your new URL
5. **Connect WhatsApp**

**That's it!** Your WhatsApp service will be running 24/7 for FREE! 🎉

---

**Need help?** Koyeb docs: https://www.koyeb.com/docs
