import React, { useState, useEffect, useRef } from "react";
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
  Info,
} from "lucide-react";

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

function money(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function GrainSwatch({ seed = 0, size = "large" }) {
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

function SectionLabel({ children }) {
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

export default function BuyerAuctionTerminal() {
  const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 12);
  const [currentBid, setCurrentBid] = useState(START_BID);
  const [leader, setLeader] = useState({
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

  const [feed, setFeed] = useState([
    { name: "Punjab Grain Exchange", rating: 5.0, loc: "Ludhiana, PB", bid: 2410, gain: 15, time: "20:36:26", mine: false },
    { name: "Rajasthan Roller Mills", rating: 4.8, loc: "Jaipur, RJ", bid: 2395, gain: 15, time: "20:36:15", mine: false },
    { name: "Ramesh Flour Mills", rating: 4.9, loc: "Bhopal, MP", bid: 2380, gain: 15, time: "14:22:08", mine: false },
    { name: "Sanjay Agro Traders", rating: 4.7, loc: "Indore, MP", bid: 2365, gain: 15, time: "14:21:44", mine: false },
    { name: "Gujarat Roller Flour", rating: 4.8, loc: "Ahmedabad, GJ", bid: 2350, gain: 20, time: "14:20:59", mine: false },
  ]);

  const feedRef = useRef(null);

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
  }, [secondsLeft]);

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

  function placeBid() {
    if (!escrowDeposited || won || secondsLeft === 0) return;
    const bidVal = Math.max(yourBid, currentBid + INCREMENT);
    setCurrentBid(bidVal);
    setLeader({ name: "You", location: "Your account", rating: null });
    setYouAreLeader(true);
    const now = new Date();
    const t = now.toTimeString().slice(0, 8);
    setFeed((f) => [
      { name: "You", rating: null, loc: "Buyer account", bid: bidVal, gain: bidVal - currentBid, time: t, mine: true },
      ...f,
    ]);
    setYourBid(bidVal + INCREMENT);
    setFlashRow(true);
    setTimeout(() => setFlashRow(false), 900);
  }

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: COLORS.parchment50,
        minHeight: "100vh",
        color: COLORS.ink900,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        .frn { font-family: 'Fraunces', serif; }
        .spg { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; }
        .grain-noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
        }
        @keyframes pulseBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        .pulse { animation: pulseBeat 1s ease-in-out infinite; }
        @keyframes rowFlash { 0%{background:${COLORS.gold400}55} 100%{background:transparent} }
        .flash { animation: rowFlash 0.9s ease-out; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        ::selection { background: ${COLORS.gold400}; }
      `}</style>

      {/* TOP STATUS BAR */}
      <div
        className="grain-noise"
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
          <span className="frn" style={{ fontWeight: 600, fontSize: 18, letterSpacing: "0.02em" }}>
            KEEMAT
          </span>
          <span
            style={{
              background: COLORS.terracotta600,
              fontSize: 10,
              letterSpacing: "0.08em",
              padding: "3px 8px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                display: "inline-block",
              }}
              className="pulse"
            />
            LIVE AUCTION
          </span>
          <span className="spg" style={{ color: COLORS.gold400, fontSize: 14, fontWeight: 600 }}>
            LOT #KM-8802
          </span>
          <span className="frn" style={{ fontStyle: "italic", fontSize: 15, opacity: 0.9 }}>
            10 Tonnes · Sharbati Wheat
          </span>
          <span
            style={{
              border: `1px solid ${COLORS.verdantGlow}66`,
              color: COLORS.verdantGlow,
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 6,
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            GRADE A · AI VERIFIED
          </span>
          <span style={{ fontSize: 12, opacity: 0.55, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={12} /> Sehore, Madhya Pradesh
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
            className={`spg ${urgent ? "pulse" : ""}`}
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: urgent ? COLORS.terracotta500 : COLORS.parchment50,
              display: "flex",
              alignItems: "center",
              gap: 6,
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
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <SectionLabel>AI Assessment Photos</SectionLabel>
              <span
                style={{
                  fontSize: 10,
                  background: COLORS.parchment100,
                  padding: "2px 8px",
                  borderRadius: 999,
                  color: COLORS.ink600,
                  fontWeight: 600,
                }}
              >
                4 PHOTOS
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <GrainSwatch seed={activePhoto} size="large" />
              <span
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "rgba(28,20,13,0.75)",
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {activePhoto + 1} / 4
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    outline: activePhoto === i ? `2px solid ${COLORS.gold500}` : "none",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <GrainSwatch seed={i} size="small" />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {["Uniform grain", "Minor husk", "Moisture"].map((tag, i) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background:
                      i === 0 ? `${COLORS.verdant500}1a` : i === 1 ? `${COLORS.gold500}1a` : `${COLORS.terracotta500}1a`,
                    color: i === 0 ? COLORS.verdant700 : i === 1 ? COLORS.gold600 : COLORS.terracotta600,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <SectionLabel>Quality Dossier</SectionLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Moisture Content", "12.6%", "Optimal", COLORS.verdant700],
                ["Grain Discolouration", "3.2%", "Acceptable", COLORS.gold600],
                ["Foreign Matter / Husk", "1.8%", "Low", COLORS.verdant700],
                ["Uniformity Index", "87%", "High", COLORS.verdant700],
              ].map(([label, val, tag, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span style={{ color: COLORS.ink600 }}>{label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="spg" style={{ fontWeight: 700 }}>{val}</span>
                    <span style={{ fontSize: 10, color, background: `${color}1a`, padding: "2px 7px", borderRadius: 999, fontWeight: 600 }}>
                      {tag}
                    </span>
                  </span>
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
              <span className="frn" style={{ fontWeight: 600, color: COLORS.verdant700, fontSize: 15 }}>
                Your Escrow Protection
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: COLORS.ink600, lineHeight: 1.5, margin: "0 0 10px" }}>
              Your funds are held in a regulated NBFC escrow account until you confirm receipt of the lot.
            </p>
            {["Instant refund if outbid", "Released only after your delivery sign-off", "Dispute SLA: 24-hour resolution", "Zero payout defaults since launch"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.ink600, marginTop: 4 }}>
                <CheckCircle2 size={13} color={COLORS.verdant700} /> {t}
              </div>
            ))}
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
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <SectionLabel>Current Highest Bid</SectionLabel>
                <div className="spg" style={{ fontSize: 40, fontWeight: 700, color: COLORS.gold600, lineHeight: 1.1 }}>
                  {money(currentBid)}
                  <span style={{ fontSize: 15, color: COLORS.ink600, fontWeight: 500 }}> / Quintal</span>
                </div>
                <div style={{ fontSize: 12.5, color: COLORS.ink600, marginTop: 2 }}>
                  Total: {money(currentBid * QTY)} for {QTY} qtl
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <SectionLabel>Leading Buyer</SectionLabel>
                <div className="frn" style={{ fontWeight: 600, fontSize: 16, color: youAreLeader ? COLORS.verdant700 : COLORS.ink900 }}>
                  {leader.name}
                </div>
                <div style={{ fontSize: 12, color: COLORS.ink600 }}>{leader.location}</div>
                {leader.rating && (
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, fontSize: 12, color: COLORS.gold600 }}>
                    <Star size={12} fill={COLORS.gold500} color={COLORS.gold500} /> {leader.rating}
                  </div>
                )}
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
                      className="spg"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: 18,
                        fontWeight: 700,
                        width: 110,
                        color: COLORS.ink900,
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
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <ChevronUp size={12} /> {inc}
                    </button>
                  ))}
                  <button
                    onClick={placeBid}
                    disabled={!escrowDeposited}
                    title={!escrowDeposited ? "Deposit required to bid" : ""}
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
                      boxShadow: escrowDeposited ? `0 10px 24px -8px ${COLORS.gold500}88` : "none",
                    }}
                  >
                    Place Bid — {money(yourBid)}/qtl
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SectionLabel>Live Bid Feed</SectionLabel>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.terracotta500 }} className="pulse" />
              </div>
              <span style={{ fontSize: 11, color: COLORS.ink600 }}>{feed.length} bids placed</span>
            </div>
            <div style={{ display: "flex", fontSize: 10, color: COLORS.ink600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 4px 8px", fontWeight: 600 }}>
              <span style={{ flex: 2 }}>Buyer</span>
              <span style={{ flex: 1 }}>Rating</span>
              <span style={{ flex: 1 }}>Location</span>
              <span style={{ flex: 1, textAlign: "right" }}>Bid / Qtl</span>
              <span style={{ flex: 1, textAlign: "right" }}>+/- Gain</span>
            </div>
            <div ref={feedRef} style={{ maxHeight: 260, overflowY: "auto" }}>
              {feed.map((row, i) => (
                <div
                  key={i}
                  className={i === 0 && flashRow ? "flash" : ""}
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
                  <span style={{ flex: 1, fontSize: 12, color: COLORS.gold600, display: "flex", alignItems: "center", gap: 3 }}>
                    {row.rating ? (
                      <>
                        <Star size={11} fill={COLORS.gold500} color={COLORS.gold500} /> {row.rating}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: COLORS.ink600 }}>{row.loc}</span>
                  <span className="spg" style={{ flex: 1, textAlign: "right", fontWeight: 700 }}>
                    {money(row.bid)}
                  </span>
                  <span className="spg" style={{ flex: 1, textAlign: "right", fontSize: 12, color: COLORS.verdant700 }}>
                    +{row.gain}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {won && (
            <div
              style={{
                background: `${COLORS.verdant500}12`,
                border: `1px solid ${COLORS.verdant500}55`,
                borderRadius: 20,
                padding: 24,
                textAlign: "center",
              }}
            >
              <CheckCircle2 size={36} color={COLORS.verdant700} style={{ marginBottom: 8 }} />
              <div className="frn" style={{ fontSize: 20, fontWeight: 600, color: COLORS.verdant700 }}>
                Bid Accepted — You Won This Lot
              </div>
              <p style={{ fontSize: 13, color: COLORS.ink600, margin: "6px 0" }}>
                Escrow will release to the seller upon your delivery sign-off.
              </p>
              <div className="spg" style={{ fontSize: 18, fontWeight: 700 }}>
                Total landed cost: {money(totalLanded)} ✓
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: COLORS.soil950,
              color: COLORS.parchment50,
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.35)",
            }}
            className="grain-noise"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
                Your Landed Cost
              </span>
              <span style={{ fontSize: 9, background: `${COLORS.gold400}22`, color: COLORS.gold400, padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>
                AUTO-UPDATES
              </span>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ opacity: 0.75 }}>
                  Gross Bid Value
                  <div style={{ fontSize: 10, opacity: 0.5 }}>{money(currentBid)}/qtl × {QTY} qtl</div>
                </span>
                <span className="spg" style={{ fontWeight: 700 }}>{money(grossValue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ opacity: 0.75 }}>
                  Transport to You
                  <div style={{ fontSize: 10, opacity: 0.5 }}>Sehore → your location, {DISTANCE_KM} km</div>
                </span>
                <span className="spg" style={{ fontWeight: 700, color: COLORS.terracotta500 }}>+{money(transportCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ opacity: 0.75 }}>
                  Platform & Handling Fee
                  <div style={{ fontSize: 10, opacity: 0.5 }}>{(PLATFORM_FEE_PCT * 100).toFixed(2)}% of gross value</div>
                </span>
                <span className="spg" style={{ fontWeight: 700, color: COLORS.terracotta500 }}>+{money(platformFee)}</span>
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
              <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.gold400, fontWeight: 700 }}>
                Total Landed Cost
              </div>
              <div className="spg" style={{ fontSize: 26, fontWeight: 700, color: COLORS.gold400 }}>
                {money(totalLanded)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Escrow-guaranteed · all fees included</div>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Per Quintal Breakdown</div>
              {[
                ["Gross", currentBid],
                ["Transport", transportCost / QTY],
                ["Platform", platformFee / QTY],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.75 }}>{l}</span>
                  <span className="spg">{money(v)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLORS.parchment50}22`, paddingTop: 6, fontWeight: 700 }}>
                <span>Landed / qtl</span>
                <span className="spg">{money(landedPerQtl)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <SectionLabel>Keemat vs. Local Sourcing</SectionLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.ink600 }}>Keemat landed cost</span>
                <span className="spg" style={{ fontWeight: 700 }}>{money(totalLanded)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.ink600 }}>Local market (est.)</span>
                <span className="spg" style={{ fontWeight: 700 }}>{money(localSourcingTotal)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: `${COLORS.verdant500}12`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  marginTop: 4,
                }}
              >
                <span style={{ color: COLORS.verdant700, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                  <TrendingUp size={14} /> You Save
                </span>
                <span className="spg" style={{ color: COLORS.verdant700, fontWeight: 700 }}>
                  {money(Math.max(savings, 0))}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${COLORS.parchment200}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 20px 60px -15px rgba(28,20,13,0.12)",
            }}
          >
            <SectionLabel>Auction Stats</SectionLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {[
                ["Total bids placed", feed.length],
                ["Unique bidders", new Set(feed.map((f) => f.name)).size],
                ["Bid range", `${money(feed[feed.length - 1]?.bid || 0)} – ${money(feed[0]?.bid || 0)}`],
                ["Lot opened at", "14:18:00"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: COLORS.ink600 }}>{l}</span>
                  <span className="spg" style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TRUST & SECURITY BAR */}
      <div
        className="grain-noise"
        style={{
          background: COLORS.soil900,
          color: COLORS.parchment50,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          marginTop: 24,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          Already have an account?{" "}
          <span style={{ color: COLORS.gold400, textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>
            Log In
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            [ShieldCheck, "Verified Escrow Security"],
            [RefreshCcw, "Live Mandi Rates Sync"],
            [Truck, "Direct Transport Network"],
          ].map(([Icon, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <div style={{ width: 1, height: 16, background: `${COLORS.parchment200}33`, margin: "0 16px" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, opacity: 0.85 }}>
                <Icon size={15} color={COLORS.gold400} />
                {label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
