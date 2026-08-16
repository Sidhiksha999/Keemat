import express from 'express';
import { dataStore } from '../services/dataStore.js';
import { broadcastEscrowState } from '../services/socketService.js';

const router = express.Router();

// Get escrow transaction
router.get('/:lotId', async (req, res) => {
  try {
    const escrow = await dataStore.getEscrow(req.params.lotId);
    res.json({ success: true, escrow });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get logistics telemetry
router.get('/:lotId/logistics', async (req, res) => {
  try {
    const logistics = dataStore.getLogistics(req.params.lotId);
    res.json({ success: true, logistics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lock deposit
router.post('/:lotId/deposit', async (req, res) => {
  try {
    const escrow = await dataStore.transitionEscrow(req.params.lotId, 'FUNDS_LOCKED', '10% Buyer deposit locked in escrow');
    broadcastEscrowState(req.params.lotId, escrow);
    res.json({ success: true, escrow });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// File Quality Deviation Dispute
router.post('/:lotId/dispute', async (req, res) => {
  try {
    const { reason, type } = req.body;
    const { dispute, escrow } = await dataStore.fileDispute(
      req.params.lotId,
      reason || 'Quality deviation filed at warehouse arrival',
      type || 'quality_mismatch'
    );
    broadcastEscrowState(req.params.lotId, escrow);
    res.json({
      success: true,
      dispute,
      escrow,
      message: 'Escrow funds immediately frozen. Dispute routed to APMC certified assayer.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Confirm delivery and release funds to farmer
router.post('/:lotId/confirm-delivery', async (req, res) => {
  try {
    await dataStore.transitionEscrow(req.params.lotId, 'DELIVERY_CONFIRMED', 'Buyer delivery sign-off');
    const escrow = await dataStore.transitionEscrow(req.params.lotId, 'FUNDS_RELEASED', 'Automatic payout release to seller');

    broadcastEscrowState(req.params.lotId, escrow);
    res.json({ success: true, escrow, message: 'Delivery confirmed and escrow funds released to seller account.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
