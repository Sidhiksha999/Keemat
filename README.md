# Keemat 🌾

**An end-to-end agricultural marketplace and profit-optimization platform connecting farmers directly with wholesale buyers.**

Keemat helps farmers stop guessing where to sell their harvest. Instead of trusting the nearest mandi out of habit, farmers get a true, itemized profit comparison across regional markets — then sell directly to verified buyers through live, quality-graded bidding with escrow-backed security.

---

## The Problem

Farmers often sell at the nearest mandi without knowing whether a farther market would actually net them more money once transport, fuel, vehicle wear, and market fees are factored in. Middlemen capture the margin created by this information gap, and farmers have no reliable way to prove crop quality to get a fair price.

## What Keemat Does

Keemat is built around four core pillars:

### 1. True-Profit Arbitrage Calculation
Computes the real net profit a farmer would earn at each nearby mandi — not just the headline price. Subtracts transport fuel cost, vehicle wear-and-tear, and market fees from live regional prices to surface the market that actually pays the most.

### 2. AI Crop Quality Grading
Farmers photograph their harvest and an AI vision model grades grain quality, purity, and condition — giving buyers an objective, trustworthy quality signal without a physical inspection.

### 3. Competitive Digital Bidding
Verified buyers place live bids on quality-rated crops, letting farmers sell to the highest real offer instead of a single fixed local price.

### 4. Secure Escrow & Deposit Protection
Buyers lock a security deposit to place a bid. Losing bidders are refunded instantly; the winning bidder's deposit is applied as a down payment — protecting farmers from bid-and-vanish behavior.

---

## Tech Stack

- **Framework:** Next.js (full-stack)
- **Database/ORM:** PostgreSQL + Prisma
- **AI Vision Grading:** Anthropic API
- **Hosting:** Vercel (serverless)

## Features

- 🔄 Unified landing page with a role-switcher (farmer / buyer), no separate entry flows
- 📊 Regional mandi price comparison with real net-profit math
- 📸 AI-powered crop quality scanner
- 💰 Live competitive bidding
- 🔒 Escrow-protected deposits with instant refunds for losing bids

## Getting Started

```bash
git clone https://github.com/Sidhiksha999/Keemat.git
cd Keemat
npm install
npm run dev
```

## Roadmap

- [ ] Farmer onboarding + crop listing flow
- [ ] AI grading pipeline integration
- [ ] Bidding engine + escrow logic
- [ ] Payment/settlement integration
- [ ] Mobile-responsive polish

## License

This project is licensed under the MIT License.
