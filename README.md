# Delta Events - WhatsApp Service

WhatsApp Web automation service for Delta Events platform using whatsapp-web.js.

## Features

- QR code generation for WhatsApp Web authentication
- Message sending with queue management
- Chat management
- Real-time status updates via Socket.IO

## Deployment

This service is designed to run on Render.com's free tier.

### Deploy to Render

1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect the configuration from `render.yaml`
6. Click "Create Web Service"

### Environment Variables

The following environment variables are automatically set via `render.yaml`:
- `PORT=3001`
- `NODE_ENV=production`

## Local Development

```bash
npm install
npm start
```

Service runs on http://localhost:3001

## API Endpoints

- `GET /status` - Check service status
- `GET /qr` - Get QR code for authentication
- `POST /send` - Send WhatsApp message
- `GET /chats` - Get all chats
- `GET /messages/:chatId` - Get messages for a chat

## Tech Stack

- Node.js + Express
- whatsapp-web.js
- Socket.IO for real-time updates
- Winston for logging
