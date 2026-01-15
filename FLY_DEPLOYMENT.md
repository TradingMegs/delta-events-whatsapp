# Fly.io Deployment Guide for WhatsApp Service (Baileys)

## Prerequisites

1. **Install Fly.io CLI**
   ```bash
   # Windows (PowerShell)
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up / Login to Fly.io**
   ```bash
   fly auth signup  # or fly auth login
   ```

## Deployment Steps

### 1. Navigate to WhatsApp Service Directory
```bash
cd whatsapp-service
```

### 2. Initialize Fly App (First Time Only)
```bash
fly apps create delta-events-whatsapp
```

### 3. Create Persistent Volume for Sessions
This is **critical** - your WhatsApp sessions MUST persist across restarts.

```bash
fly volumes create whatsapp_sessions --region iad --size 1
```

### 4. Set Environment Variables
```bash
fly secrets set ALLOWED_ORIGINS="https://app.deltaevents.co.za,http://localhost:5173"
```

### 5. Deploy the Application
```bash
fly deploy
```

This will:
- Build the Docker image
- Push it to Fly.io
- Mount the persistent volume at `/app/sessions`
- Start your WhatsApp service

### 6. Check Deployment Status
```bash
fly status
fly logs
```

### 7. Get Your Service URL
```bash
fly info
```

Look for the **Hostname** (e.g., `delta-events-whatsapp.fly.dev`)

### 8. Update Convex Environment Variables

Go to your **Convex Dashboard** → **Settings** → **Environment Variables**:

```
WHATSAPP_SERVICE_URL=https://delta-events-whatsapp.fly.dev
```

### 9. Test the Connection

Visit your admin dashboard:
- Go to **System Settings** → **WhatsApp Tab**
- Click **Connect**
- Scan the QR code with your phone

## Important Notes

### Session Persistence
- Sessions are stored in `/app/sessions` which is mounted to the persistent volume
- Even if the app restarts, your WhatsApp connection will remain active
- **Never delete the volume** or you'll need to re-scan QR code

### Scaling
```bash
# Keep exactly 1 machine running (critical for WhatsApp)
fly scale count 1

# Adjust memory if needed
fly scale memory 512  # MB
```

### Monitoring
```bash
# View real-time logs
fly logs

# View metrics
fly dashboard
```

### Troubleshooting

**QR Code not showing?**
```bash
fly logs --app delta-events-whatsapp
```
Look for connection errors.

**Session lost after restart?**
Check if volume is mounted:
```bash
fly ssh console
ls -la /app/sessions
```

**Out of memory?**
```bash
fly scale memory 1024
```

### Manual Session Reset

If you need to logout and start fresh:
```bash
fly ssh console
rm -rf /app/sessions/admin
exit
fly apps restart delta-events-whatsapp
```

## Cost Estimate

Fly.io Pricing (as of 2024):
- **Shared CPU 1x (512MB RAM)**: ~$2/month
- **Persistent Volume (1GB)**: ~$0.15/month
- **Total**: ~$2.15/month

First 3 machines + 3GB volumes are FREE on Hobby plan!

## Security

1. **Firewall**: Fly.io apps are behind a firewall by default
2. **HTTPS**: All traffic is encrypted
3. **Private Network**: Connect via Fly.io's private network if needed

## Maintenance

### Update Deployment
```bash
fly deploy --no-cache  # Force rebuild
```

### View SSH Access
```bash
fly ssh console
```

### Backup Sessions (Optional)
```bash
fly sftp get /app/sessions ./sessions-backup -r
```

## Next Steps

After deployment:
1. Update `WHATSAPP_SERVICE_URL` in Convex
2. Redeploy your main app if needed (`vercel --prod`)
3. Connect WhatsApp via admin dashboard
4. Test sending messages from notifications page

---

**Need help?** Check Fly.io docs: https://fly.io/docs/
