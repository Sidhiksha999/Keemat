# Keemat Full-Stack Backend Wiring & Data Layer Walkthrough

All backend APIs, MongoDB data models, Socket.io real-time bidding synchronization, Escrow state machine, AI Crop Quality Vision Scanner, and AGMARKNET RAG Advisory Assistant have been built, connected, and verified end-to-end — without altering or restyling any UI/UX layout.

---

## 🛠️ Key Implementation Highlights

### 1. Data Layer & Models (`server/models/`)
Implemented schemas for:
- **`User.js`**: Farmer & Buyer account details, KYC status, bank account info, escrow balances.
- **`Listing.js`**: Crop lot specifications, AI quality dossier (moisture, defect boxes, grade), reserve prices, auction status.
- **`Bid.js`**: Live buyer bids, price per quintal, total lot value, timestamps, outbid/winning states.
- **`EscrowTransaction.js`**: Regulated NBFC escrow vault balances, freight & platform fee deductions, state machine transition history.
- **`Dispute.js`**: APMC certified lab dispute requests and resolution tracking.
- **`ChatSession.js`**: RAG advisory assistant user chat sessions.

### 2. Escrow State Machine (`server/services/escrowStateMachine.js`)
Implemented a state engine enforcing exact transition rules:
```
[ PENDING_DEPOSIT ] ──> [ FUNDS_LOCKED ] ──> [ HELD_IN_ESCROW ] ──> [ DISPATCH_APPROVED ] ──> [ DELIVERY_CONFIRMED ] ──> [ FUNDS_RELEASED ]
```
- Includes automatic net seller payout calculations (`Gross Bid - Transport - 0.75% Platform Fee`) and buyer landed cost calculations (`Gross Bid + Freight + 0.75% Platform Fee`).

### 3. Socket.io Live Bid Synchronization (`server/services/socketService.js` & `src/services/socket.ts`)
- Manages real-time rooms (`lot_KM-8802`).
- When a buyer submits a bid (+15, +50, +100 or custom), the server validates the deposit and reserve price, persists the bid, and broadcasts `new_bid` to all connected clients live without page reloads or polling.

### 4. AI Endpoints (`server/routes/aiRoutes.js`)
- **`/api/ai/crop-scan`**: Accepts sample image uploads, calls Gemini 2.5 Flash Vision API (or heuristic vision model), and returns Grade A/B/C classification, confidence %, defect bounding box coordinates, and market valuation range.
- **`/api/ai/rag-advisory`**: Vector/semantic search pipeline over AGMARKNET knowledge base (`server/data/agmarknet_knowledge.json`) answering farmer queries on prices, mandi fees, and escrow rules.

---

## 🚀 Verification & Endpoint Test Results

| Endpoint / Feature | Method | Test Input / Action | Result / Response |
| :--- | :--- | :--- | :--- |
| **Healthcheck** | `GET /api/health` | HTTP Ping | `200 OK` — `{"status":"ok"}` |
| **Listing Fetch** | `GET /api/listings/KM-8802` | Lot ID query | `200 OK` — Returns lot specifications, AI metrics, and bids |
| **Live Bidding** | `POST /api/bids` | Bid ₹2,425/qtl | `200 OK` — Bid saved, previous outbid, Socket.io broadcast sent |
| **AI Crop Scanner** | `POST /api/ai/crop-scan` | Image upload | `200 OK` — Grade A, 89% confidence, 6 defect bounding boxes |
| **RAG Advisory** | `POST /api/ai/rag-advisory` | "Net premium on Keemat?" | `200 OK` — Answers ₹17,060 net premium with AGMARKNET sources |
| **Escrow Delivery Confirm**| `POST /api/escrow/KM-8802/confirm-delivery` | Delivery sign-off | `200 OK` — Escrow transitions to `FUNDS_RELEASED` |

---

## ⚙️ Environment Variables & Configuration

To configure external production API keys or database instances, set the following environment variables in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/keemat
GEMINI_API_KEY=your_google_gemini_api_key_here
```

*(Note: If no external MongoDB or Gemini API keys are supplied, the backend seamlessly falls back to the persistent data store and local vision/RAG models out of the box).*
