import express from 'express';
import { dataStore } from '../services/dataStore.js';
import { broadcastNewBid } from '../services/socketService.js';

const router = express.Router();

// Get bids for a lot
router.get('/:lotId', async (req, res) => {
  try {
    const bids = await dataStore.getBids(req.params.lotId);
    res.json({ success: true, bids });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Place a new bid
router.post('/', async (req, res) => {
  try {
    const { lotId, buyerName, buyerCity, buyerRating, amountPerQuintal } = req.body;
    const targetLotId = lotId || 'KM-8802';
    const bidAmount = Number(amountPerQuintal);

    const listing = await dataStore.getListing(targetLotId);
    if (listing && listing.reservePrice && bidAmount < listing.reservePrice) {
      return res.status(400).json({
        success: false,
        error: `Bid amount ₹${bidAmount}/qtl is below minimum reserve price ₹${listing.reservePrice}/qtl`
      });
    }

    const { newBid } = await dataStore.addBid({
      lotId: targetLotId,
      buyerName: buyerName || 'Arjun Patel',
      buyerCity: buyerCity || 'Indore, MP',
      buyerRating: buyerRating || 5.0,
      amountPerQuintal: bidAmount
    });

    const allBids = await dataStore.getBids(targetLotId);
    const updatedListing = await dataStore.getListing(targetLotId);

    // Broadcast new bid live via Socket.io
    broadcastNewBid(targetLotId, newBid, allBids, updatedListing);

    res.json({
      success: true,
      bid: newBid,
      bids: allBids,
      listing: updatedListing
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Set auto-bidding ceiling
router.post('/auto-bid', async (req, res) => {
  try {
    const { lotId, maxCeiling, stepIncrement, buyerName } = req.body;
    const targetLotId = lotId || 'KM-8802';
    const result = await dataStore.setAutoBidCeiling(targetLotId, maxCeiling, stepIncrement, buyerName);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
