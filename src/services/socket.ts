import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('[Socket.io Client] Connected with ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io Client] Disconnected');
    });
  }
  return socket;
}

export function joinAuctionRoom(lotId: string, callback: (data: any) => void) {
  const s = getSocket();
  s.emit('join_auction', lotId);

  const handleState = (data: any) => callback({ type: 'state', ...data });
  const handleNewBid = (data: any) => callback({ type: 'new_bid', ...data });
  const handleEscrow = (data: any) => callback({ type: 'escrow_state_changed', ...data });
  const handleAccepted = (data: any) => callback({ type: 'bid_accepted', ...data });

  s.on('auction_state', handleState);
  s.on('new_bid', handleNewBid);
  s.on('escrow_state_changed', handleEscrow);
  s.on('bid_accepted', handleAccepted);

  return () => {
    s.off('auction_state', handleState);
    s.off('new_bid', handleNewBid);
    s.off('escrow_state_changed', handleEscrow);
    s.off('bid_accepted', handleAccepted);
    s.emit('leave_auction', lotId);
  };
}

export function subscribeToLot(lotId: string, callback: (data: any) => void) {
  return joinAuctionRoom(lotId, callback);
}

export function unsubscribeFromLot(lotId: string) {
  const s = getSocket();
  s.emit('leave_auction', lotId);
}
