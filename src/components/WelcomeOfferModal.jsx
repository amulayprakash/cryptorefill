import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Zap, X } from 'lucide-react';
import { useDomainConfig } from '../context/DomainContext';
import { WalletModal } from './wallet/WalletModal';

const DEFAULT_PROMO = {
  eyebrow: 'New shopper · fast track',
  discount: '5% OFF',
  message: 'your first order — gift cards, flights, recharges & app credits, paid straight from your wallet.',
  code: 'HELLO5',
  cta: 'Grab',
};

export default function WelcomeOfferModal() {
  const { config } = useDomainConfig();
  const promo = { ...DEFAULT_PROMO, ...config.promo };

  const [visible, setVisible] = useState(true);
  const [walletOpen, setWalletOpen] = useState(false);

  const close = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  const handleClaim = () => {
    close();
    setWalletOpen(true);
  };

  return (
    <>
      {visible && createPortal(
        <div
          className="welcome-offer-overlay fixed inset-0 z-[60] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcomeOfferTitle"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,700;0,900;1,900&family=Space+Grotesk:wght@400;500;700&display=swap');

        .welcome-offer-overlay {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
          --wo-bg:#04030f;
          --wo-card:#0a0820;
          --wo-neon:#00f0ff;
          --wo-neon2:#7b5cff;
          --wo-hot:#ff2e97;
          --wo-lime:#c6ff2e;
          --wo-amber:#ffb020;
          --wo-ink:#eaf0ff;
          --wo-muted:#8a97c4;
          --wo-line:rgba(123,92,255,.3);
          background: rgba(2,2,10,.74);
          backdrop-filter: blur(9px);
          animation: woFade .35s ease both;
          overflow: hidden;
        }
        @keyframes woFade { from { opacity: 0; } to { opacity: 1; } }

        .wo-speed { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0; }
        .wo-speed span {
          position:absolute; height:2px; border-radius:2px; left:-40%;
          background:linear-gradient(90deg,transparent,var(--wo-neon),transparent);
          opacity:.5; animation: woZip linear infinite;
        }
        .wo-speed span:nth-child(1){top:14%;width:50%;animation-duration:1.1s;animation-delay:0s}
        .wo-speed span:nth-child(2){top:26%;width:38%;background:linear-gradient(90deg,transparent,var(--wo-hot),transparent);animation-duration:.85s;animation-delay:.3s}
        .wo-speed span:nth-child(3){top:44%;width:60%;animation-duration:1.3s;animation-delay:.15s}
        .wo-speed span:nth-child(4){top:63%;width:34%;background:linear-gradient(90deg,transparent,var(--wo-lime),transparent);animation-duration:.7s;animation-delay:.5s}
        .wo-speed span:nth-child(5){top:75%;width:52%;background:linear-gradient(90deg,transparent,var(--wo-neon2),transparent);animation-duration:1.05s;animation-delay:.2s}
        .wo-speed span:nth-child(6){top:88%;width:42%;animation-duration:.95s;animation-delay:.65s}
        @keyframes woZip { from{transform:translateX(0)} to{transform:translateX(260%)} }

        .wo-card {
          position:relative; width:min(450px,100%); border-radius:26px; padding:2.5px;
          background:linear-gradient(135deg,var(--wo-neon),var(--wo-neon2) 40%,var(--wo-hot) 75%,var(--wo-amber));
          background-size:300% 300%;
          box-shadow:0 0 70px rgba(123,92,255,.5),0 0 140px rgba(0,240,255,.18);
          animation: woBurst .6s cubic-bezier(.16,1.1,.3,1.3) both, woBorderflow 4s linear infinite;
        }
        @keyframes woBurst {
          0%{opacity:0;transform:translateY(30px) scale(.8) rotate(-3deg)}
          60%{transform:translateY(-4px) scale(1.02) rotate(.6deg)}
          100%{opacity:1;transform:none}
        }
        @keyframes woBorderflow { to { background-position:300% 0; } }

        .wo-card-inner {
          position:relative; border-radius:24px; overflow:hidden; padding:32px 30px 28px;
          background:
            radial-gradient(440px 260px at 82% -18%, rgba(255,46,151,.20), transparent 60%),
            radial-gradient(360px 240px at 0% 120%, rgba(0,240,255,.14), transparent 60%),
            linear-gradient(180deg,#0d0a26,var(--wo-card));
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
        }
        .wo-orb { position:absolute; border-radius:50%; filter:blur(34px); opacity:.55; z-index:0; }
        .wo-orb.a { width:160px; height:160px; background:var(--wo-neon); top:-56px; left:-46px; animation: woFloat 6s ease-in-out infinite; }
        .wo-orb.b { width:140px; height:140px; background:var(--wo-hot); bottom:-56px; right:-34px; animation: woFloat 7s ease-in-out infinite reverse; }
        @keyframes woFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(22px,-18px)} }
        .wo-card-inner > * { position:relative; z-index:2; }

        .wo-close {
          position:absolute; top:14px; right:14px; z-index:5; width:32px; height:32px; border-radius:50%;
          border:1px solid var(--wo-line); background:rgba(255,255,255,.05); color:var(--wo-muted);
          cursor:pointer; display:flex; align-items:center; justify-content:center; transition:.2s;
        }
        .wo-close:hover { color:var(--wo-ink); border-color:var(--wo-neon); transform:rotate(90deg); }

        .wo-eyebrow {
          font-family:'Archivo',sans-serif;
          display:inline-flex; align-items:center; gap:7px; font-weight:900;
          font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--wo-bg);
          background:var(--wo-lime); padding:6px 13px; border-radius:100px;
          box-shadow:0 0 22px rgba(198,255,46,.5); transform:skewX(-6deg);
          animation: woWobble 2.4s ease-in-out infinite;
        }
        @keyframes woWobble { 0%,100%{transform:skewX(-6deg) translateY(0)} 50%{transform:skewX(-6deg) translateY(-2px)} }
        .wo-bolt { animation: woFlash .9s steps(2) infinite; display:inline-flex; }
        @keyframes woFlash { 50%{opacity:.3} }

        .wo-h1 {
          font-family:'Archivo',sans-serif;
          font-weight:900; font-style:italic; color:var(--wo-ink); line-height:.92; letter-spacing:-.02em;
          margin:16px 0 2px; font-size:33px; text-transform:uppercase; transform:skewX(-4deg);
        }
        .wo-deal-wrap { position:relative; display:inline-block; transform:skewX(-4deg); margin:2px 0 4px; }
        .wo-deal {
          font-family:'Archivo',sans-serif;
          display:block; font-style:italic; font-weight:900; font-size:88px; line-height:.82; letter-spacing:-.03em;
          background:linear-gradient(100deg,var(--wo-neon),var(--wo-lime) 45%,var(--wo-hot) 80%,var(--wo-amber));
          background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation: woRush 2.2s linear infinite;
        }
        @keyframes woRush { to { background-position:200% center; } }
        .wo-deal-wrap::before, .wo-deal-wrap::after {
          font-family:'Archivo',sans-serif;
          content:attr(data-t); position:absolute; top:0; left:0;
          font-style:italic; font-weight:900; font-size:88px; line-height:.82; letter-spacing:-.03em; z-index:-1;
          color:var(--wo-hot); opacity:.22; animation: woTrail 1.6s ease-in-out infinite;
        }
        .wo-deal-wrap::after { color:var(--wo-neon); animation-delay:.2s; }
        @keyframes woTrail { 0%,100%{transform:translateX(0);opacity:0} 40%{opacity:.25} 50%{transform:translateX(-12px);opacity:.12} }

        .wo-sub { color:var(--wo-muted); font-size:15px; line-height:1.5; margin:12px 0 18px; }
        .wo-sub b { color:var(--wo-ink); font-weight:700; }

        .wo-perk {
          font-size:12.5px; color:var(--wo-ink); font-weight:600; border:1px solid var(--wo-line);
          border-radius:100px; padding:7px 12px; background:rgba(123,92,255,.1);
          display:flex; align-items:center; gap:6px; transition:.2s;
        }
        .wo-perk:hover { border-color:var(--wo-neon); transform:translateY(-2px); }

        .wo-cta {
          font-family:'Archivo',sans-serif;
          position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:10px;
          width:100%; border:none; cursor:pointer; font-weight:900; font-style:italic; font-size:19px;
          letter-spacing:.02em; text-transform:uppercase; color:var(--wo-bg); padding:18px 20px; border-radius:16px;
          background:linear-gradient(100deg,var(--wo-neon),var(--wo-neon2) 50%,var(--wo-hot));
          background-size:200% 100%; box-shadow:0 10px 34px rgba(0,240,255,.35);
          transition:transform .14s ease, box-shadow .3s ease;
          animation: woShine 2.6s linear infinite, woBob 1.8s ease-in-out infinite;
        }
        @keyframes woShine { to { background-position:200% 0; } }
        @keyframes woBob { 0%,100%{box-shadow:0 10px 34px rgba(0,240,255,.35)} 50%{box-shadow:0 12px 44px rgba(255,46,151,.4)} }
        .wo-cta:hover { transform:translateY(-3px) scale(1.02); }
        .wo-cta:active { transform:translateY(-1px) scale(.99); }
        .wo-cta .wo-arrow { font-size:22px; transition:transform .2s; }
        .wo-cta:hover .wo-arrow { transform:translateX(6px); }
        .wo-cta::after {
          content:""; position:absolute; top:0; left:-60%; width:40%; height:100%;
          background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
          transform:skewX(-20deg); animation: woGlint 2.6s ease-in-out infinite;
        }
        @keyframes woGlint { 0%{left:-60%} 55%{left:130%} 100%{left:130%} }

        .wo-fine { text-align:center; color:var(--wo-muted); font-size:12px; margin-top:14px; line-height:1.5; }
        .wo-fine .wo-code {
          color:var(--wo-lime); font-weight:700; letter-spacing:.06em; background:rgba(198,255,46,.1);
          padding:2px 8px; border-radius:6px; border:1px dashed rgba(198,255,46,.45);
        }
        .wo-skip {
          display:block; margin:12px auto 0; background:none; border:none; color:var(--wo-muted);
          font-size:12.5px; cursor:pointer; text-decoration:underline; text-underline-offset:3px; transition:.2s;
        }
        .wo-skip:hover { color:var(--wo-ink); }

        .wo-coins {
          display:flex; align-items:center; gap:8px; justify-content:center; margin-top:16px;
          padding-top:16px; border-top:1px solid var(--wo-line); color:var(--wo-muted); font-size:11px; letter-spacing:.04em;
        }
        .wo-coins .wo-dot { width:4px; height:4px; border-radius:50%; background:var(--wo-neon2); }
        .wo-coins b { color:var(--wo-ink); }

        @media (max-width:480px) {
          .welcome-offer-overlay { padding:0; align-items:flex-end; }
          .wo-card {
            width:100%; border-radius:28px 28px 0 0; padding:2.5px 2.5px 0;
            animation: woSlideup .5s cubic-bezier(.16,1.1,.3,1.25) both, woBorderflow 4s linear infinite;
          }
          @keyframes woSlideup { from{opacity:0;transform:translateY(70px)} to{opacity:1;transform:none} }
          .wo-card-inner { border-radius:26px 26px 0 0; padding:30px 22px calc(24px + env(safe-area-inset-bottom)); }
          .wo-h1 { font-size:28px; }
          .wo-deal, .wo-deal-wrap::before, .wo-deal-wrap::after { font-size:74px; }
          .wo-sub { font-size:14px; }
        }
        @media (prefers-reduced-motion:reduce) {
          .welcome-offer-overlay, .wo-card, .wo-card *, .wo-card::before, .wo-card::after,
          .wo-cta::after, .wo-deal-wrap::before, .wo-deal-wrap::after {
            animation:none !important;
          }
          .wo-cta { background-position:0 0; }
          .wo-deal { background-position:0 0; }
          .wo-deal-wrap::before, .wo-deal-wrap::after { display:none; }
          .wo-speed { display:none; }
        }
      `}</style>

      <div className="wo-speed" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>

      <div
        className="wo-card"
        onClick={handleClaim}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClaim();
          }
        }}
      >
        <div className="wo-card-inner">
          <span className="wo-orb a" aria-hidden="true"></span>
          <span className="wo-orb b" aria-hidden="true"></span>

          <button
            type="button"
            className="wo-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            <X className="h-4 w-4" />
          </button>

          <span className="wo-eyebrow">
            <span className="wo-bolt"><Zap className="h-3 w-3 fill-current" /></span>
            {promo.eyebrow}
          </span>

          <h1 id="welcomeOfferTitle" className="wo-h1">Welcome to {config.name}</h1>
          <span className="wo-deal-wrap" data-t={promo.discount}>
            <span className="wo-deal">{promo.discount}</span>
          </span>

          <p className="wo-sub">
            Blast through checkout with <b>{promo.discount}</b> {promo.message}
          </p>

          <div className="flex flex-wrap gap-2 mb-[22px]">
            <span className="wo-perk">🛍️ 6,600+ brands</span>
            <span className="wo-perk">🔒 No KYC</span>
            <span className="wo-perk">⚡ Instant delivery</span>
          </div>

          <button type="button" className="wo-cta">
            {promo.cta} {promo.discount} <span className="wo-arrow">→</span>
          </button>

          <p className="wo-fine">
            Use code <span className="wo-code">{promo.code}</span> at checkout · first order only
          </p>

          <button
            type="button"
            className="wo-skip"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            No thanks, I'll pay full price
          </button>

          <div className="wo-coins">
            <span>Pay with</span><b>USDT</b><span className="wo-dot"></span><b>BTC</b><span className="wo-dot"></span><b>ETH</b><span className="wo-dot"></span><span>100+ coins</span>
          </div>
        </div>
      </div>
        </div>,
        document.body
      )}
      <WalletModal open={walletOpen} onOpenChange={setWalletOpen} />
    </>
  );
}
