"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, ArrowRight } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
    };

    return (
        <div className="lroot">
            {/* Background layers */}
            <div className="lbg-grad" />
            <div className="lbg-grid" />

            {/* Topographic SVG rings */}
            <svg className="lbg-svg" viewBox="0 0 800 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <ellipse cx="400" cy="310" rx="500" ry="440" stroke="rgba(42,148,120,0.07)" strokeWidth="1" fill="none"/>
                <ellipse cx="400" cy="310" rx="370" ry="310" stroke="rgba(42,148,120,0.09)" strokeWidth="1" fill="none"/>
                <ellipse cx="400" cy="310" rx="240" ry="200" stroke="rgba(42,148,120,0.11)" strokeWidth="1" fill="none"/>
                <ellipse cx="400" cy="310" rx="120" ry="100" stroke="rgba(212,175,90,0.10)" strokeWidth="1" fill="none"/>
                <circle cx="118" cy="88"  r="2.5" fill="rgba(212,175,90,0.3)"/>
                <circle cx="688" cy="528" r="2.5" fill="rgba(212,175,90,0.3)"/>
                <circle cx="705" cy="115" r="1.8" fill="rgba(42,148,120,0.4)"/>
                <circle cx="92"  cy="492" r="1.8" fill="rgba(42,148,120,0.4)"/>
                <circle cx="655" cy="278" r="1.2" fill="rgba(247,245,239,0.18)"/>
                <circle cx="145" cy="338" r="1.2" fill="rgba(247,245,239,0.18)"/>
            </svg>

            {/* Card */}
            <div className="lcard">
                <div className="lcard-top" />
                <div className="lcard-body">

                    {/* Logo */}
                    <div className="llogo-row">
                        <div className="llogo-icon">
                            <img
                                src="/images/nawasanga.png"
                                alt="Nawasanga icon"
                                width={40}
                                height={40}
                                style={{ imageRendering: 'crisp-edges' }}
                            />
                        </div>
                        <span className="llogo-name">Nawasanga</span>
                    </div>

                    {/* Heading */}
                    <div className="lheading">
                        <h1 className="ltitle">
                            Selamat <em>datang</em>
                        </h1>
                        <p className="lsubtitle">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lform">

                        {/* Email */}
                        <div className={`lfield ${focused === "email" ? "lfocused" : ""}`}>
                            <label className="llabel" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused(null)}
                                placeholder="nama@perusahaan.com"
                                className="linput"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className={`lfield ${focused === "password" ? "lfocused" : ""}`}>
                            <div className="llabel-row">
                                <label className="llabel" htmlFor="password">Password</label>
                                <a href="#" className="lforgot">Lupa password?</a>
                            </div>
                            <div className="linput-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="••••••••"
                                    className="linput"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="lpwtoggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember */}
                        <label className="lremember">
                            <input type="checkbox" className="lchk" />
                            <span className="lchk-box" />
                            <span className="lchk-label">Ingat saya di perangkat ini</span>
                        </label>

                        {/* Error */}
                        {error && (
                            <div className="lerror">
                                <span className="lerror-dot" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`lbtn ${isLoading ? "lbtn-loading" : ""}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="ldots">
                                    <span /><span /><span />
                                </span>
                            ) : (
                                <>Masuk <ArrowRight size={15} strokeWidth={2.2} /></>
                            )}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="lregister">
                        Belum punya akun?{" "}
                        <a href="#" className="lregister-link">Daftar sekarang</a>
                    </p>
                </div>
            </div>

            <style>{`
        /* ── Nawasanga tokens (dari globals.css) ── */
        .lroot {
          --rimba-400: #2A9478;
          --rimba-500: #1D6B5A;
          --rimba-600: #175749;
          --rimba-700: #104238;
          --rimba-800: #0a2d27;
          --rimba-900: #051916;
          --emas-300:  #D4AF5A;
          --emas-400:  #C9A040;
          --tanah-500: #C14B2A;
          --arang:     #1A1A18;
          --abu-bambu: #7A7A72;
          --kertas:    #F7F5EF;
          --pasir:     #EDEAE0;
          --jati:      #4A3728;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lroot {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--rimba-900);
          font-family: 'Roboto', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 32px 16px;
        }

        /* ── Background ── */
        .lbg-grad {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 75% 65% at -5% 105%, var(--rimba-700) 0%, transparent 55%),
            radial-gradient(ellipse 50% 45% at 105% -5%, var(--rimba-800) 0%, transparent 50%);
          z-index: 0;
        }
        .lbg-grid {
          position: absolute; inset: 0; z-index: 1;
          background-image:
            linear-gradient(rgba(247,245,239,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,245,239,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .lbg-svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          z-index: 1; pointer-events: none;
        }

        /* ── Badge ── */
        .lbadge {
          position: absolute; top: 24px; right: 24px; z-index: 20;
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(10,45,39,0.9);
          border: 1px solid rgba(42,148,120,0.2);
          border-radius: 100px;
          font-size: 11px; font-weight: 500;
          color: rgba(42,148,120,0.85); letter-spacing: 0.3px;
        }
        .lbadge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--rimba-400);
          animation: lbadgepulse 2s ease-in-out infinite;
        }
        @keyframes lbadgepulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }

        /* ── Card ── */
        .lcard {
          position: relative; z-index: 10;
          width: 100%; max-width: 408px;
          background: var(--rimba-800);
          border: 1px solid rgba(247,245,239,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(42,148,120,0.08),
            0 24px 60px rgba(0,0,0,0.6),
            0 4px 16px rgba(0,0,0,0.35);
        }
        .lcard-top {
          height: 4px;
          background: linear-gradient(90deg,
            var(--rimba-500) 0%,
            var(--rimba-400) 55%,
            var(--emas-300)  100%
          );
        }
        .lcard-body { padding: 36px 38px 32px; }

        /* ── Logo ── */
        .llogo-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px;
        }
        .llogo-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--rimba-600);
          border: 1px solid rgba(42,148,120,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--emas-300);
        }
        .llogo-name {
          font-size: 15px; font-weight: 600;
          color: var(--kertas); letter-spacing: 0.1px;
        }

        /* ── Heading ── */
        .lheading { margin-bottom: 26px; }
        .ltitle {
          font-size: 30px; font-weight: 400;
          color: var(--kertas);
          letter-spacing: -0.3px; line-height: 1.15;
          margin-bottom: 5px;
          font-family: Georgia, 'Times New Roman', serif;
        }
        .ltitle em {
          font-style: italic;
          color: var(--emas-300);
        }
        .lsubtitle {
          font-size: 13px; font-weight: 300;
          color: rgba(247,245,239,0.4); line-height: 1.5;
        }

        /* ── Form ── */
        .lform { display: flex; flex-direction: column; gap: 16px; }
        .lfield { display: flex; flex-direction: column; gap: 5px; }
        .llabel-row { display: flex; justify-content: space-between; align-items: center; }
        .llabel {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.9px; text-transform: uppercase;
          color: rgba(247,245,239,0.35);
          transition: color 0.15s;
        }
        .lfocused .llabel { color: rgba(42,148,120,0.8); }

        .lforgot {
          font-size: 11.5px; color: var(--rimba-400);
          text-decoration: none; font-weight: 500;
        }
        .lforgot:hover { color: #3dbda0; }

        .linput-wrap { position: relative; }
        .linput {
          width: 100%; height: 46px; padding: 0 14px;
          background: var(--rimba-900);
          border: 1px solid rgba(247,245,239,0.08);
          border-radius: 10px;
          font-family: 'Roboto', sans-serif; font-size: 14px;
          color: var(--kertas); outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          caret-color: var(--rimba-400);
        }
        .linput-wrap .linput { padding-right: 42px; }
        .linput::placeholder { color: rgba(247,245,239,0.18); }
        .linput:hover { border-color: rgba(247,245,239,0.15); }
        .lfocused .linput,
        .linput:focus {
          border-color: rgba(42,148,120,0.6);
          box-shadow: 0 0 0 3px rgba(42,148,120,0.12);
        }

        .lpwtoggle {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(247,245,239,0.25);
          display: flex; align-items: center;
          padding: 2px; transition: color 0.15s;
        }
        .lpwtoggle:hover { color: var(--rimba-400); }

        /* ── Remember ── */
        .lremember {
          display: flex; align-items: center; gap: 8px;
          cursor: pointer; user-select: none;
        }
        .lchk { position: absolute; opacity: 0; width: 0; height: 0; }
        .lchk-box {
          width: 15px; height: 15px; flex-shrink: 0;
          border: 1px solid rgba(247,245,239,0.15);
          border-radius: 4px; background: var(--rimba-900);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .lchk:checked ~ .lchk-box {
          background: var(--rimba-500);
          border-color: var(--rimba-400);
        }
        .lchk:checked ~ .lchk-box::after {
          content: '';
          width: 8px; height: 5px;
          border-left: 1.5px solid var(--kertas);
          border-bottom: 1.5px solid var(--kertas);
          transform: rotate(-45deg) translateY(-1px);
          display: block;
        }
        .lchk-label { font-size: 12.5px; color: rgba(247,245,239,0.3); }

        /* ── Error ── */
        .lerror {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 13px;
          background: rgba(193,75,42,0.12);
          border: 1px solid rgba(193,75,42,0.25);
          border-radius: 8px;
          font-size: 12.5px; color: #e8917a;
        }
        .lerror-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--tanah-500); flex-shrink: 0;
        }

        /* ── Button ── */
        .lbtn {
          height: 48px; width: 100%;
          background: var(--rimba-500);
          border: none; border-radius: 11px;
          font-family: 'Roboto', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--kertas); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(29,107,90,0.35);
          margin-top: 4px; letter-spacing: 0.3px;
        }
        .lbtn:hover:not(.lbtn-loading) {
          background: var(--rimba-400);
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(29,107,90,0.45);
        }
        .lbtn:active:not(.lbtn-loading) { transform: scale(0.985); box-shadow: none; }
        .lbtn-loading { cursor: not-allowed; background: var(--rimba-600); }

        .ldots { display: flex; gap: 4px; align-items: center; }
        .ldots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(247,245,239,0.6);
          animation: ldotpulse 1.2s ease-in-out infinite;
        }
        .ldots span:nth-child(2) { animation-delay: 0.18s; }
        .ldots span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes ldotpulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.7); }
          40%            { opacity: 1;   transform: scale(1);   }
        }

        /* ── Register ── */
        .lregister {
          margin-top: 20px; text-align: center;
          font-size: 12.5px; color: rgba(247,245,239,0.28);
        }
        .lregister-link { color: var(--rimba-400); font-weight: 500; text-decoration: none; }
        .lregister-link:hover { text-decoration: underline; }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .lcard-body { padding: 28px 24px 24px; }
          .ltitle { font-size: 26px; }
          .lbadge { display: none; }
        }
      `}</style>
        </div>
    );
}