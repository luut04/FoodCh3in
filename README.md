# 🎫 FoodCh3in

> **Buy food tickets with your credit card, receive an NFT without even knowing what a wallet is.**

FoodCh3in is a "ticketing invisible" hackathon MVP that demonstrates how Web3 technology can be seamlessly integrated into everyday experiences without requiring users to understand blockchain concepts.

## 🌟 Features

- **Easy Login**: Sign in with Google OAuth - no wallet setup required
- **Simple Menu**: Browse food items and purchase tickets with a few clicks
- **Invisible Blockchain**: Receive NFT tickets automatically after payment
- **QR Code Validation**: Vendors can scan and validate tickets easily
- **Mock Integrations**: Clean abstractions for Crossmint, Arkiv, and blockchain interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth with Google OAuth
- **Styling**: SCSS/Sass (dark theme with neon/festival aesthetic)
- **HTTP Client**: Axios
- **QR Codes**: qrcode library
- **Blockchain**: Ethers.js (mocked for now)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Google OAuth credentials (or use mock mode for development)

### Installation

1. **Clone the repository** (or you're already here!)

2. **Install dependencies**:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up environment variables**:

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note**: For development/demo purposes, the app will work with mock credentials if you don't have Google OAuth set up yet.

4. **Run the development server**:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
FoodCh3in/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── wallet/          # Wallet creation endpoint
│   │   ├── orders/              # Order creation
│   │   ├── tickets/             # Ticket status & consumption
│   │   ├── webhooks/            # Crossmint webhook simulation
│   │   └── checkout/            # Checkout simulation
│   ├── menu/                    # Menu page
│   ├── checkout/[orderId]/      # Checkout flow
│   ├── ticket/[tokenId]/        # Ticket display with QR
│   ├── validator/               # Validator app for vendors
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── providers.tsx            # Client-side providers
│   ├── globals.scss             # Global styles
│   └── variables.scss           # SCSS variables
├── components/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Navbar.tsx
│   ├── QRCode.tsx
│   ├── Loading.tsx
│   └── MenuItemCard.tsx
├── styles/                       # SCSS modules for components & pages
│   ├── Button.module.scss
│   ├── Card.module.scss
│   ├── Navbar.module.scss
│   ├── QRCode.module.scss
│   ├── Loading.module.scss
│   ├── MenuItemCard.module.scss
│   └── pages/
│       ├── home.module.scss
│       ├── menu.module.scss
│       ├── checkout.module.scss
│       ├── ticket.module.scss
│       └── validator.module.scss
├── lib/                         # Core libraries & utilities
│   ├── auth.ts                  # NextAuth configuration
│   ├── ordersStore.ts          # In-memory order storage
│   ├── walletsStore.ts         # In-memory wallet storage
│   ├── crossmint.ts            # Mocked Crossmint SDK
│   ├── arkiv.ts                # Mocked Arkiv SDK
│   ├── chain.ts                # Mocked blockchain calls
│   └── menu.ts                 # Menu data
├── types/                       # TypeScript type definitions
│   ├── index.ts
│   └── next-auth.d.ts
└── README.md
```

## 🎯 User Flow

### Customer Journey

1. **Landing Page** → User clicks "Login with Google"
2. **Menu Page** → User sees their wallet address and browses menu items
3. **Checkout** → User reviews order and clicks "Pay with Card (Sandbox)"
4. **Ticket Page** → User receives NFT ticket with QR code

### Validator Journey

1. **Validator Page** → Vendor enters token ID or scans QR code (simulated)
2. **Status Check** → System shows ticket status (Active/Consumed)
3. **Consumption** → Vendor marks ticket as consumed

## 🔌 Integration Points (Currently Mocked)

### Crossmint Integration

**File**: `lib/crossmint.ts`

Replace mock functions with real Crossmint SDK:

```typescript
// Mock (current)
export async function getOrCreateWallet(email: string): Promise<string>

// Production (replace with)
import { Crossmint } from '@crossmint/server-sdk';
const crossmint = new Crossmint({ apiKey: process.env.CROSSMINT_API_KEY });
// Use crossmint.wallets.create(), etc.
```

### Arkiv Integration

**File**: `lib/arkiv.ts`

Replace mock functions with real Arkiv SDK:

```typescript
// Mock (current)
export async function uploadOrderMetadata(order: Order): Promise<string>
export async function markTicketConsumed(tokenId: string): Promise<void>

// Production (replace with)
// Use Arkiv SDK for metadata storage and NFT state management
```

### Blockchain Integration

**File**: `lib/chain.ts`

Replace mock functions with real Ethers.js/Viem calls:

```typescript
// Mock (current)
export async function mintTicket(toAddress: string, tokenURI: string)

// Production (replace with)
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
const tx = await contract.mint(toAddress, tokenURI);
// etc.
```

**Environment Variables Needed**:

```env
CROSSMINT_API_KEY=your-crossmint-api-key
ARKIV_API_KEY=your-arkiv-api-key
CONTRACT_ADDRESS=0x...
RPC_URL=https://your-testnet-rpc.com
PRIVATE_KEY=your-signer-private-key
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/wallet` | Get/create wallet for user |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders?orderId=xxx` | Get order details |
| POST | `/api/webhooks/crossmint` | Payment webhook |
| POST | `/api/checkout/simulate` | Simulate payment (dev only) |
| GET | `/api/tickets/[tokenId]` | Get ticket status |
| POST | `/api/tickets/consume` | Mark ticket as consumed |

## 🎨 Design System

The app uses a dark theme with neon/festival aesthetics built with SCSS:

- **Primary Colors**: Purple (`#a855f7`) and Cyan (`#06b6d4`)
- **Components**: Glass-morphism effects with neon borders
- **Typography**: Inter font family
- **Animations**: Glow effects and smooth transitions
- **Styling**: SCSS modules for component-scoped styles
- **Variables**: Centralized SCSS variables in `app/variables.scss`

## 🧪 Testing the Flow

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "Login with Google" (or mock login)
4. Select a menu item and click "Buy Ticket"
5. Click "Pay with Card (Sandbox)" on checkout page
6. View your ticket with QR code
7. Open http://localhost:3000/validator in a new tab
8. Enter the token ID from your ticket
9. Click "Mark as Consumed" to simulate ticket validation

## 🔒 Security Notes

**⚠️ This is a demo/MVP. For production:**

- Add proper authentication & authorization checks
- Validate webhook signatures from Crossmint
- Use environment-specific secrets
- Add rate limiting to API endpoints
- Implement proper error handling & logging
- Use a real database instead of in-memory stores
- Add transaction monitoring & retry logic
- Implement proper CORS policies

## 📝 Future Enhancements

- [ ] Real QR code scanner using device camera
- [ ] User dashboard showing all their tickets
- [ ] Email notifications for ticket purchases
- [ ] Multiple payment methods
- [ ] Refund/cancellation flow
- [ ] Analytics dashboard for vendors
- [ ] Multi-vendor support
- [ ] Ticket transfers between users

## 🤝 Contributing

This is a hackathon MVP. Feel free to fork and build upon it!

## 📄 License

MIT License - feel free to use this for your own projects!

---

**Built for the hackathon with ❤️ and ⚡**

*Powered by Next.js, Crossmint, and Arkiv*
