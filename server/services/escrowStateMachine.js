import EscrowTransaction from '../models/EscrowTransaction.js';
import Listing from '../models/Listing.js';

const ALLOWED_TRANSITIONS = {
  PENDING_DEPOSIT: ['FUNDS_LOCKED', 'CANCELLED'],
  FUNDS_LOCKED: ['HELD_IN_ESCROW', 'REFUNDED'],
  HELD_IN_ESCROW: ['DISPATCH_APPROVED', 'DISPUTED'],
  DISPATCH_APPROVED: ['DELIVERY_CONFIRMED', 'DISPUTED'],
  DELIVERY_CONFIRMED: ['FUNDS_RELEASED', 'DISPUTED'],
  FUNDS_RELEASED: [],
  DISPUTED: ['REFUNDED', 'FUNDS_RELEASED', 'HELD_IN_ESCROW'],
  REFUNDED: []
};

export async function transitionEscrowState(transactionId, targetState, triggeredBy = 'user', note = '') {
  const escrow = await EscrowTransaction.findOne({ transactionId });
  if (!escrow) {
    throw new Error(`Escrow transaction ${transactionId} not found`);
  }

  const currentState = escrow.status;
  const allowed = ALLOWED_TRANSITIONS[currentState] || [];

  if (!allowed.includes(targetState) && targetState !== currentState) {
    throw new Error(`Invalid Escrow transition from ${currentState} to ${targetState}`);
  }

  escrow.status = targetState;
  escrow.stateHistory.push({
    state: targetState,
    timestamp: new Date(),
    triggeredBy,
    note
  });

  await escrow.save();

  // Also update listing status if applicable
  if (targetState === 'FUNDS_RELEASED') {
    await Listing.findByIdAndUpdate(escrow.lot, { status: 'delivered' });
  } else if (targetState === 'FUNDS_LOCKED' || targetState === 'HELD_IN_ESCROW') {
    await Listing.findByIdAndUpdate(escrow.lot, { status: 'escrow_locked' });
  }

  return escrow;
}

export function calculateFinancialBreakdown(bidAmountPerQuintal, quantityQuintals, distanceKm = 148) {
  const grossAmount = bidAmountPerQuintal * quantityQuintals;
  const transportRatePerKm = 42; // ₹42/km flat rate for 10-tonne truck
  const transportCost = distanceKm * transportRatePerKm;
  const platformFee = Math.round(grossAmount * 0.0075); // 0.75% platform fee
  const netSellerPayout = grossAmount - transportCost - platformFee;
  const totalLandedCost = grossAmount + transportCost + platformFee;
  const landedCostPerQuintal = totalLandedCost / quantityQuintals;

  return {
    grossAmount,
    transportCost,
    platformFee,
    netSellerPayout,
    totalLandedCost,
    landedCostPerQuintal
  };
}
