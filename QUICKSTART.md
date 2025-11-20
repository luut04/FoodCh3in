# 🚀 Quick Start Guide

Get FoodCh3in running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start the Development Server

```bash
npm run dev
```

## Step 3: Open Your Browser

Navigate to **http://localhost:3000**

## 🎮 Try the Demo Flow

### As a Customer:

1. Click **"Login with Google"** on the landing page
   - For demo purposes, the mock OAuth will work without real Google credentials
   
2. Browse the menu and click **"Buy Ticket"** on any item

3. On the checkout page, click **"Pay with Card (Sandbox)"**
   - This simulates a successful payment and mints your NFT
   
4. View your ticket with a QR code!

### As a Validator (Vendor):

1. Copy the token ID from your ticket

2. Open **http://localhost:3000/validator** in a new tab

3. Paste the token ID and click **"Check Ticket"**

4. Click **"Mark as Consumed"** to validate the ticket

## 🔧 Configuration (Optional)

### Google OAuth Setup

If you want real Google login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy your Client ID and Client Secret
7. Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## 📝 What's Mocked?

Currently mocked for demo (ready to replace with real integrations):

- ✅ **Crossmint SDK** - Wallet creation & checkout
- ✅ **Arkiv SDK** - NFT metadata & state management  
- ✅ **Blockchain calls** - NFT minting & querying
- ✅ **Google OAuth** - Works with default mock credentials

## 🎯 Next Steps

1. **Replace Crossmint mock** in `lib/crossmint.ts`
2. **Replace Arkiv mock** in `lib/arkiv.ts`
3. **Replace blockchain mock** in `lib/chain.ts`
4. **Add real database** instead of `lib/ordersStore.ts`
5. **Deploy** to Vercel or your preferred platform

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run build
```

## 📚 Need More Info?

Check out the main [README.md](./README.md) for detailed documentation!

---

**Happy hacking! 🎉**

