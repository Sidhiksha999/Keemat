import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  RefreshCcw,
  Truck,
  Clock,
  CheckCircle2,
  MapPin,
  Star,
  TrendingUp,
  Lock,
  ChevronUp,
} from "lucide-react";
import { api } from "../services/api";
import { joinAuctionRoom } from "../services/socket";

const COLORS = {
  soil950: "#1C140D",
  soil900: "#2B1E13",
  soil800: "#3D2B1B",
  parchment50: "#FBF7EF",
  parchment100: "#F3ECDC",
  parchment200: "#E8DCC2",
  gold600: "#B8862B",
  gold500: "#D4A039",
  gold400: "#E8BE5C",
  verdant700: "#1F5E3E",
  verdant500: "#2E8B57",
  verdantGlow: "#4ADE80",
  terracotta600: "#B5502E",
  terracotta500: "#D46A44",
  ink900: "#221A12",
  ink600: "#5A4A38",
};

const INCREMENT = 15;
const START_BID = 2410;
const QTY = 100;
const TRANSPORT_RATE_PER_KM = 42;
const DISTANCE_KM = 148;
const PLATFORM_FEE_PCT = 0.0075;

function money(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function GrainSwatch({ seed = 0, size = "large" }: { seed?: number; size?: string }) {
  const dim = size === "large" ? 220 : 44;
  return (
    <div
      style={{
        width: "100%",
        height: dim,
        borderRadius: size === "large" ? 16 : 8,
        background: `
          radial-gradient(circle at ${20 + seed * 7}% ${30 + seed * 5}%, rgba(232,190,92,0.55) 0 3px, transparent 4px),
          radial-gradient(circle at ${60 - seed * 4}% ${65 + seed * 3}%, rgba(184,134,43,0.5) 0 3px, transparent 4px),
          radial-gradient(circle at ${40 + seed * 5}% ${20 + seed * 8}%, rgba(212,160,57,0.5) 0 4px, transparent 5px),
          linear-gradient(135deg, #C9A15B 0%, #B8862B 45%, #8F6A22 100%)
        `,
        backgroundSize: "18px 18px, 22px 22px, 26px 26px, 100% 100%",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${COLORS.gold400}55`,
      }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: COLORS.ink600,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

interface Props {
  lotId?: string;
  onNavigate?: (view: string, params?: any) => void;
}

export default function BuyerAuctionTerminal({ lotId = 'KM-8802' }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 12);
  const [currentBid, setCurrentBid] = useState(START_BID);
  const [leader, setLeader] = useState<any>({
    name: "Punjab Grain Exchange",
    location: "Ludhiana, PB",
    rating: 5.0,
  });
  const [youAreLeader, setYouAreLeader] = useState(false);
  const [yourBid, setYourBid] = useState(START_BID + INCREMENT);
  const [escrowDeposited, setEscrowDeposited] = useState(true);
  const [won, setWon] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [flashRow, setFlashRow] = useState(false);

  const [feed, setFeed] = useState<any[]>([
    { name: "Punjab Grain Exchange", rating: 5.0, loc: "Ludhiana, PB", bid: 2410, gain: 15, time: "20:36:26", mine: false },
    { name: "Rajasthan Roller Mills", rating: 4.8, loc: "Jaipur, RJ", bid: 2395, gain: 15, time: "20:36:15", mine: false },
    { name: "Ramesh Flour Mills", rating: 4.9, loc: "Bhopal, MP", bid: 2380, gain: 15, time: "14:22:08", mine: false },
    { name: "Sanjay Agro Traders", rating: 4.7, loc: "Indore, MP", bid: 2365, gain: 15, time: "14:21:44", mine: false },
    { name: "Gujarat Roller Flour", rating: 4.8, loc: "Ahmedabad, GJ", bid: 2350, gain: 20, time: "14:20:59", mine: false },
  ]);

  const feedRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time Socket.io events
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await api.getListing(lotId)
        if (res.bids && res.bids.length > 0) {
          const top = res.bids[0]
          setCurrentBid(top.amountPerQuintal)
          setLeader({ name: top.buyerName, location: top.buyerCity, rating: top.buyerRating })
          setYourBid(top.amountPerQuintal + INCREMENT)
          setFeed(res.bids.map((b: any) => ({
            name: b.buyerName,
            rating: b.buyerRating,
            loc: b.buyerCity,
            bid: b.amountPerQuintal,
            gain: 15,
            time: b.timestampStr || 'Live',
            mine: b.buyerName === 'You' || b.buyerName === 'Punjab Grain Exchange'
          })))
        }
      } catch (err) {
        console.warn('Buyer auction load warning:', err)
      }
    }
    loadInitial()

    const unsubscribe = joinAuctionRoom(lotId, (event) => {
      if (event.type === 'state') {
        if (event.bids && event.bids.length > 0) {
          const top = event.bids[0]
          setCurrentBid(top.amountPerQuintal)
          setLeader({ name: top.buyerName, location: top.buyerCity, rating: top.buyerRating })
          setFeed(event.bids.map((b: any) => ({
            name: b.buyerName,
            rating: b.buyerRating,
            loc: b.buyerCity,
            bid: b.amountPerQuintal,
            gain: 15,
            time: b.timestampStr || 'Live',
            mine: b.buyerName === 'You' || b.buyerName === 'Punjab Grain Exchange'
          })))
        }
      } else if (event.type === 'new_bid') {
        const nb = event.bid
        if (nb) {
          setCurrentBid(nb.amountPerQuintal)
          setLeader({ name: nb.buyerName, location: nb.buyerCity, rating: nb.buyerRating })
          setYourBid(nb.amountPerQuintal + INCREMENT)
          setFeed(prev => [
            {
              name: nb.buyerName,
              rating: nb.buyerRating,
              loc: nb.buyerCity,
              bid: nb.amountPerQuintal,
              gain: 15,
              time: nb.timestampStr || 'Live',
              mine: nb.buyerName === 'You'
            },
            ...prev
          ])
          setFlashRow(true)
          setTimeout(() => setFlashRow(false), 900)
        }
      }
    })

    return () => unsubscribe()
  }, [lotId])

  useEffect(() => {
    if (won) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [won]);

  useEffect(() => {
    if (secondsLeft === 0 && !won) {
      setWon(youAreLeader);
    }
  }, [secondsLeft, youAreLeader, won]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const urgent = secondsLeft <= 10;

  const grossValue = currentBid * QTY;
  const transportCost = DISTANCE_KM * TRANSPORT_RATE_PER_KM;
  const platformFee = grossValue * PLATFORM_FEE_PCT;
  const totalLanded = grossValue + transportCost + platformFee;
  const landedPerQtl = totalLanded / QTY;

  const localSourcingPerQtl = currentBid + 95;
  const localSourcingTotal = localSourcingPerQtl * QTY;
  const savings = localSourcingTotal - totalLanded;

  async function placeBid() {
    if (!escrowDeposited || won || secondsLeft === 0) return;
    const bidVal = Math.max(yourBid, currentBid + INCREMENT);

    try {
      await api.placeBid({
        lotId,
        amountPerQuintal: bidVal,
        buyerName: 'You (Punjab Grain Exch.)',
        buyerCity: 'Ludhiana, PB',
        buyerRating: 5.0
      });
      setYouAreLeader(true);
    } catch (err: any) {
      alert('Error placing bid: ' + err.message);
    }
  }

  const handleDeliveryConfirm = async () => {
    try {
      await api.confirmDelivery(lotId);
      alert('Delivery confirmed! Escrow released to seller bank account.');
    } catch (err: any) {
      alert('Error confirming delivery: ' + err.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: COLORS.parchment50,
        minHeight: "100vh",
        color: COLORS.ink900,
      }}
    >
      {/* TOP STATUS BAR */}
      <div
        style={{
          background: COLORS.soil950,
          color: COLORS.parchment50,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: `1px solid ${COLORS.gold600}33`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 18 }}>
            KEEMAT
          </span>
          <span
            style={{
              background: COLORS.terracotta600,
              fontSize: 10,
              letterSpacing: "0.08em",
              padding: "3px 8px",
              borderRadius: 999,
              color: 'white',
              fontWeight: 600,
            }}
          >
            LIVE AUCTION
          </span>
          <span style={{ color: COLORS.gold400, fontSize: 14, fontWeight: 600, fontFamily: "Space Grotesk, monospace" }}>
            LOT #{lotId}
          </span>
          <span style={{ fontSize: 15, opacity: 0.9, fontFamily: "Fraunces, serif" }}>
            10 Tonnes · Sharbati Wheat
          </span>
          <span
            style={{
              border: `1px solid ${COLORS.verdantGlow}66`,
              color: COLORS.verdantGlow,
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            GRADE A · AI VERIFIED
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: escrowDeposited ? COLORS.verdantGlow : COLORS.terracotta500,
              fontWeight: 600,
            }}
          >
            {escrowDeposited ? <ShieldCheck size={15} /> : <Lock size={15} />}
            {escrowDeposited ? "Your Deposit: ₹18,000 Locked" : "Deposit Required to Bid"}
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: urgent ? COLORS.terracotta500 : COLORS.parchment50,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Space Grotesk, monospace",
            }}
          >
            <Clock size={16} />
            {mm}:{ss}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "300px 1fr 320px",
          gap: 20,
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
            }}
          >
            <SectionLabel>AI Assessment Photos</SectionLabel>
            <GrainSwatch seed={activePhoto} size="large" />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} onClick={() => setActivePhoto(i)} style={{ flex: 1, cursor: "pointer" }}>
                  <GrainSwatch seed={i} size="small" />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
            }}
          >
            <SectionLabel>Quality Dossier</SectionLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Moisture Content", "12.0%", "Optimal", COLORS.verdant700],
                ["Grain Discolouration", "3.2%", "Acceptable", COLORS.gold600],
                ["Foreign Matter / Husk", "1.8%", "Low", COLORS.verdant700],
                ["Uniformity Index", "87%", "High", COLORS.verdant700],
              ].map(([label, val, tag, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: COLORS.ink600 }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: `${COLORS.verdant500}12`,
              border: `1px solid ${COLORS.verdant500}44`,
              borderRadius: 20,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <ShieldCheck size={16} color={COLORS.verdant700} />
              <span style={{ fontWeight: 600, color: COLORS.verdant700, fontSize: 15, fontFamily: "Fraunces, serif" }}>
                Your Escrow Protection
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: COLORS.ink600, margin: "0 0 10px" }}>
              Your funds are held in a regulated NBFC escrow account until you confirm receipt of the lot.
            </p>
            <button
              onClick={handleDeliveryConfirm}
              style={{
                width: '100%', padding: '9px 14px', backgroundColor: COLORS.verdant700,
                color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: 12
              }}
            >
              Confirm Delivery & Release Escrow →
            </button>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <SectionLabel>Current Highest Bid</SectionLabel>
                <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.gold600, fontFamily: "Space Grotesk, monospace" }}>
                  {money(currentBid)}
                  <span style={{ fontSize: 15, color: COLORS.ink600, fontWeight: 500 }}> / Quintal</span>
                </div>
                <div style={{ fontSize: 12.5, color: COLORS.ink600, marginTop: 2 }}>
                  Total: {money(currentBid * QTY)} for {QTY} qtl
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <SectionLabel>Leading Buyer</SectionLabel>
                <div style={{ fontWeight: 600, fontSize: 16, color: youAreLeader ? COLORS.verdant700 : COLORS.ink900, fontFamily: "Fraunces, serif" }}>
                  {leader.name}
                </div>
                <div style={{ fontSize: 12, color: COLORS.ink600 }}>{leader.location}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                background: youAreLeader ? `${COLORS.verdant500}12` : `${COLORS.terracotta500}12`,
                fontSize: 13,
                fontWeight: 600,
                color: youAreLeader ? COLORS.verdant700 : COLORS.terracotta600,
              }}
            >
              {won
                ? "🎉 Auction closed — you won this lot."
                : youAreLeader
                ? "You're currently the highest bidder."
                : `You've been outbid by ${money(INCREMENT)}/qtl.`}
            </div>

            {!won && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.parchment200}`, paddingTop: 16 }}>
                <SectionLabel>Place Your Bid</SectionLabel>
                <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${COLORS.parchment200}`,
                      borderRadius: 14,
                      padding: "8px 14px",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: COLORS.ink600, fontSize: 14 }}>₹</span>
                    <input
                      type="number"
                      value={yourBid}
                      onChange={(e) => setYourBid(Number(e.target.value))}
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: 18,
                        fontWeight: 700,
                        width: 110,
                        color: COLORS.ink900,
                        fontFamily: "Space Grotesk, monospace",
                      }}
                    />
                    <span style={{ fontSize: 12, color: COLORS.ink600 }}>/ qtl</span>
                  </div>
                  {[15, 50, 100].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => setYourBid((b) => b + inc)}
                      style={{
                        border: `1px solid ${COLORS.gold500}66`,
                        background: `${COLORS.gold400}1a`,
                        color: COLORS.gold600,
                        borderRadius: 999,
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <ChevronUp size={12} /> {inc}
                    </button>
                  ))}
                  <button
                    onClick={placeBid}
                    disabled={!escrowDeposited}
                    style={{
                      marginLeft: "auto",
                      background: escrowDeposited ? COLORS.gold500 : COLORS.parchment200,
                      color: escrowDeposited ? "#fff" : COLORS.ink600,
                      border: "none",
                      borderRadius: 14,
                      padding: "12px 22px",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: escrowDeposited ? "pointer" : "not-allowed",
                    }}
                  >
                    Place Bid — {money(yourBid)}/qtl
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Bid Feed */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <SectionLabel>Live Bid Feed (Real-Time Socket.io)</SectionLabel>
              <span style={{ fontSize: 11, color: COLORS.ink600 }}>{feed.length} bids placed</span>
            </div>
            <div ref={feedRef} style={{ maxHeight: 260, overflowY: "auto" }}>
              {feed.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 4px",
                    borderTop: `1px solid ${COLORS.parchment100}`,
                    borderLeft: row.mine ? `3px solid ${COLORS.gold500}` : "3px solid transparent",
                    paddingLeft: row.mine ? 8 : 4,
                  }}
                >
                  <span style={{ flex: 2, fontSize: 13, fontWeight: 600 }}>
                    {row.name} {row.mine && <span style={{ color: COLORS.gold600, fontSize: 10 }}>(you)</span>}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: COLORS.ink600 }}>{row.loc}</span>
                  <span style={{ flex: 1, textAlign: "right", fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>
                    {money(row.bid)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: COLORS.soil950,
              color: COLORS.parchment50,
              borderRadius: 20,
              padding: 18,
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
              Your Landed Cost Engine
            </span>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Gross Bid Value ({QTY} qtl)</span>
                <span style={{ fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>{money(grossValue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Transport ({DISTANCE_KM} km)</span>
                <span style={{ fontWeight: 700, color: COLORS.terracotta500, fontFamily: "Space Grotesk, monospace" }}>+{money(transportCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Platform Fee (0.75%)</span>
                <span style={{ fontWeight: 700, color: COLORS.terracotta500, fontFamily: "Space Grotesk, monospace" }}>+{money(platformFee)}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                background: `${COLORS.gold500}18`,
                border: `1px solid ${COLORS.gold500}55`,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", color: COLORS.gold400, fontWeight: 700 }}>
                Total Landed Cost
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.gold400, fontFamily: "Space Grotesk, monospace" }}>
                {money(totalLanded)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                Landed per qtl: {money(landedPerQtl)}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
            }}
          >
            <SectionLabel>Keemat vs. Local Sourcing</SectionLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.ink600 }}>Keemat landed cost</span>
                <span style={{ fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>{money(totalLanded)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.ink600 }}>Local market (est.)</span>
                <span style={{ fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>{money(localSourcingTotal)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: `${COLORS.verdant500}12`,
                  borderRadius: 10,
                  padding: "8px 10px",
                }}
              >
                <span style={{ color: COLORS.verdant700, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                  <TrendingUp size={14} /> You Save
                </span>
                <span style={{ color: COLORS.verdant700, fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>
                  {money(Math.max(savings, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
