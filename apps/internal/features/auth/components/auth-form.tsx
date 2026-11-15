"use client";

import { useState } from "react";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 2. Inisialisasi router di sini
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulasi proses login
        await new Promise((r) => setTimeout(r, 1200));

        setLoading(false);
        // 3. Langsung pindah ke dashboard setelah loading selesai
        router.push("/dashboard");
    };

    return (
        <div className="login-root">
            <div className="bg-pattern" aria-hidden="true">
                <div className="ring ring-1" />
                <div className="ring ring-2" />
                <div className="ring ring-3" />
                <div className="ring ring-4" />
            </div>

            <div className="card">
                <div className="card-bar" />

                <div className="logo-wrap">
                    <div className="logo-icon">
                        <Leaf size={22} strokeWidth={1.8} />
                    </div>
                    <div>
                        <p className="logo-name">Nawasanga</p>
                        <p className="logo-sub">Carbon Management Platform</p>
                    </div>
                </div>

                <div className="heading-wrap">
                    <h1 className="heading">Selamat datang</h1>
                    <p className="subheading">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {/* 4. Gunakan handleSubmit yang sudah ada di tag form */}
                <form onSubmit={handleSubmit} className="form">
                    <div className="field">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="nama@perusahaan.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="field">
                        <div className="label-row">
                            <label htmlFor="password" className="label">Password</label>
                            <a href="#" className="forgot">Lupa password?</a>
                        </div>
                        <div className="input-wrap">
                            <input
                                id="password"
                                type={show ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-pw"
                            />
                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() => setShow((v) => !v)}
                                tabIndex={-1}
                            >
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* 5. Kembalikan type ke "submit" agar handleSubmit terpanggil */}
                    <button
                        type="submit"
                        className={`submit-btn${loading ? " loading" : ""}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner" />
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

                <p className="footer-text">
                    Belum punya akun?{" "}
                    <a href="#" className="footer-link">Hubungi administrator</a>
                </p>
            </div>

            <style>{`
                /* CSS kamu tetap sama... */
                .login-root { min-height: 100vh; background: #F0EDE5; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; font-family: "Roboto", Arial, sans-serif; }
                .bg-pattern { position: absolute; inset: 0; pointer-events: none; }
                .ring { position: absolute; border-radius: 50%; border: 1px solid #1D6B5A; top: 50%; left: 50%; transform: translate(-50%, -50%); }
                .ring-1 { width: 340px; height: 340px; opacity: 0.06; }
                .ring-2 { width: 580px; height: 580px; opacity: 0.05; }
                .ring-3 { width: 820px; height: 820px; opacity: 0.04; }
                .ring-4 { width: 1100px; height: 1100px; opacity: 0.03; }
                .card { position: relative; width: 100%; max-width: 420px; background: #FDFCFA; border-radius: 16px; border: 1px solid #DEDAD0; padding: 36px 40px 32px; overflow: hidden; box-shadow: 0 1px 2px rgba(29,107,90,0.04), 0 4px 16px rgba(29,107,90,0.07), 0 12px 40px rgba(26,26,24,0.06); }
                .card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #1D6B5A 0%, #2A9478 50%, #D4AF5A 100%); }
                .logo-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
                .logo-icon { width: 40px; height: 40px; border-radius: 10px; background: #1D6B5A; color: #F7F5EF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .logo-name { font-size: 15px; font-weight: 600; color: #1A1A18; margin: 0; line-height: 1.2; letter-spacing: -0.01em; }
                .logo-sub { font-size: 11px; color: #7A7A72; margin: 0; line-height: 1.3; }
                .heading-wrap { margin-bottom: 24px; }
                .heading { font-size: 22px; font-weight: 600; color: #1A1A18; margin: 0 0 4px; letter-spacing: -0.02em; line-height: 1.2; }
                .subheading { font-size: 13px; color: #7A7A72; margin: 0; }
                .form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
                .field { display: flex; flex-direction: column; gap: 6px; }
                .label { font-size: 12px; font-weight: 500; color: #1A1A18; }
                .label-row { display: flex; align-items: center; justify-content: space-between; }
                .forgot { font-size: 12px; color: #1D6B5A; text-decoration: none; font-weight: 500; }
                .forgot:hover { text-decoration: underline; }
                .input { height: 40px; border-radius: 8px; border: 1px solid #DEDAD0; background: #F7F5EF; color: #1A1A18; font-size: 14px; font-family: "Roboto", sans-serif; padding: 0 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%; box-sizing: border-box; }
                .input::placeholder { color: #BDBDB5; }
                .input:focus { border-color: #1D6B5A; box-shadow: 0 0 0 3px rgba(29,107,90,0.10); background: #FDFCFA; }
                .input-wrap { position: relative; }
                .input-pw { padding-right: 40px; }
                .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 0; cursor: pointer; color: #7A7A72; display: flex; align-items: center; }
                .eye-btn:hover { color: #1D6B5A; }
                .submit-btn { height: 42px; border-radius: 8px; border: none; background: #1D6B5A; color: #F7F5EF; font-size: 14px; font-weight: 600; font-family: "Roboto", sans-serif; cursor: pointer; letter-spacing: 0.01em; transition: background 0.15s, transform 0.1s; display: flex; align-items: center; justify-content: center; margin-top: 4px; }
                .submit-btn:hover:not(:disabled) { background: #175749; }
                .submit-btn:active:not(:disabled) { transform: scale(0.99); }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { width: 18px; height: 18px; border: 2px solid rgba(247,245,239,0.35); border-top-color: #F7F5EF; border-radius: 50%; animation: spin 0.65s linear infinite; }
                .footer-text { text-align: center; font-size: 12px; color: #7A7A72; margin: 0; }
                .footer-link { color: #1D6B5A; font-weight: 500; text-decoration: none; }
                .footer-link:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
}