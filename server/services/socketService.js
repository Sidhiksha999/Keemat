import { Server } from 'socket.io';
import Listing from '../models/Listing.js';
import Bid from '../models/Bid.js';
import EscrowTransaction from '../models/EscrowTransaction.js';

let io = null;

export function initSocketService(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join specific auction lot room
    socket.on('join_auction', async (lotId) => {
      const room = `lot_${lotId}`;
      socket.join(room);
      console.log(`[Socket.io] Client ${socket.id} joined room ${room}`);

      // Send initial auction state
      try {
        const listing = await Listing.findOne({ lotId }).populate('winningBid');
        const bids = await Bid.find({ lot: listing._id }).sort({ amountPerQuintal: -1 }).limit(20);
        const escrow = await EscrowTransaction.findOne({ lot: listing._id });

        socket.emit('auction_state', {
          listing,
          bids,
          escrow
        });
      } catch (err) {
        console.error(`[Socket.io] Error fetching initial room state:`, err);
      }
    });

    socket.on('leave_auction', (lotId) => {
      const room = `lot_${lotId}`;
      socket.leave(room);
      console.log(`[Socket.io] Client ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function broadcastNewBid(lotId, newBid, allBids, listing) {
  if (!io) return;
  const room = `lot_${lotId}`;
  io.to(room).emit('new_bid', {
    lotId,
    bid: newBid,
    bids: allBids,
    listing
  });
  console.log(`[Socket.io] Broadcasted new bid of ₹${newBid.amountPerQuintal}/qtl to room ${room}`);
}

export function broadcastEscrowState(lotId, escrow) {
  if (!io) return;
  const room = `lot_${lotId}`;
  io.to(room).emit('escrow_state_changed', {
    lotId,
    escrow
  });
  console.log(`[Socket.io] Broadcasted escrow state transition (${escrow.status}) to room ${room}`);
}

export function broadcastBidAccepted(lotId, winningBid, escrow) {
  if (!io) return;
  const room = `lot_${lotId}`;
  io.to(room).emit('bid_accepted', {
    lotId,
    winningBid,
    escrow
  });
}
