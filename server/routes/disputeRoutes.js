import express from 'express';
import Dispute from '../models/Dispute.js';
import Listing from '../models/Listing.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 }).populate('lot raisedBy');
    res.json({ success: true, disputes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { lotId, type, reason } = req.body;
    const listing = await Listing.findOne({ lotId });
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const disputeId = `DSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const dispute = await Dispute.create({
      disputeId,
      lot: listing._id,
      raisedBy: listing.seller,
      type: type || 're_grade_request',
      reason: reason || 'Quality re-grade requested',
      status: 'pending_review'
    });

    res.json({ success: true, dispute });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:disputeId/resolve', async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const dispute = await Dispute.findOneAndUpdate(
      { disputeId: req.params.disputeId },
      { status, resolutionNote },
      { new: true }
    );
    res.json({ success: true, dispute });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
