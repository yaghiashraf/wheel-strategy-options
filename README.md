# Wheel Strategy Income Lab

Vercel-friendly Next.js app that recreates the core workflow of `wheelstrategyoptions.com` with:

- Alpaca-backed covered-call and cash-secured-put screeners
- Symbol detail pages for each wheel leg
- Fundamental screener using public Yahoo Finance fundamentals
- Wheel calculators for premium yield, annualized yield, collateral, and breakeven

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Alpaca REST APIs for stock snapshots, option contracts, and option snapshots
- Yahoo Finance public quote summary endpoints for secondary fundamentals

## Environment

Create `.env.local` from `.env.example` and set:

- `APCA_API_KEY_ID`
- `APCA_API_SECRET_KEY`
- `APCA_API_BASE_URL`

`APCA_API_BASE_URL` can stay on `https://paper-api.alpaca.markets` unless you want to point at a live trading base URL.

## Local Run

```bash
npm install
npm run dev
```

If your local Node version is below 20.9, switch to Node 20+ first.

## Deploy To Vercel

1. Push this directory to a GitHub repo.
2. Import the repo in Vercel.
3. Set the three Alpaca environment variables in the Vercel project settings.
4. Deploy.

The data routes are server-side, so the Alpaca keys stay off the client.
