import express from 'express';
import { dataStore } from '../services/dataStore.js';
import { calculateFinancialBreakdown } from '../services/escrowStateMachine.js';
import { broadcastBidAccepted, broadcastEscrowState } from '../services/socketService.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await dataStore.getListings();
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get specific listing by lotId
router.get('/:lotId', async (req, res) => {
  try {
    const listing = await dataStore.getListing(req.params.lotId);
    const bids = await dataStore.getBids(req.params.lotId);
    const escrow = await dataStore.getEscrow(req.params.lotId);

    res.json({
      success: true,
      listing,
      bids,
      escrow
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Request physical sampling
router.post('/:lotId/sample-request', async (req, res) => {
  try {
    const result = await dataStore.requestPhysicalSample(req.params.lotId, req.body.buyerId);
    res.json({ success: true, sampleRequest: result, message: 'Physical sample request dispatched to APMC on-ground assayer.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch assayer audit report
router.get('/:lotId/assayer-report', async (req, res) => {
  try {
    const listing = await dataStore.getListing(req.params.lotId);
    res.json({ success: true, assayerReport: listing.assayerReport });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new listing
router.post('/', async (req, res) => {
  try {
    const listing = await dataStore.createListing(req.body);
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Set minimum reserve price
router.post('/:lotId/set-reserve', async (req, res) => {
  try {
    const { reservePrice } = req.body;
    const listing = await dataStore.setReservePrice(req.params.lotId, reservePrice);
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Accept winning bid
router.post('/:lotId/accept-bid', async (req, res) => {
  try {
    const lotId = req.params.lotId;
    const listing = await dataStore.getListing(lotId);
    const bids = await dataStore.getBids(lotId);

    const topBid = bids[0];
    if (!topBid) {
      return res.status(400).json({ success: false, error: 'No bids placed on this lot yet' });
    }

    if (listing) listing.status = 'auction_closed';
    topBid.status = 'winning';

    const fin = calculateFinancialBreakdown(topBid.amountPerQuintal || 2410, listing?.quantityQuintals || 100);
    const escrow = await dataStore.transitionEscrow(lotId, 'FUNDS_LOCKED', 'Bid accepted by farmer');

    broadcastBidAccepted(lotId, topBid, escrow);
    broadcastEscrowState(lotId, escrow);

    res.json({
      success: true,
      listing,
      winningBid: topBid,
      escrow,
      financials: fin
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
