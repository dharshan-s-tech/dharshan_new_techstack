'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

const ADMIN_USERS: Record<string, string> = {
  tkeerthana_admin: 'Keerthana@123',
  tdharshan_admin: 'Dharshan@123',
  tsowmiya_admin: 'Sowmiya@123',
  tpurnima_admin: 'Purnima@123',
  themanth_admin: 'Hemant@123',
  'hemanth@gmail.com': 'Hemant@123',
  takilan_admin: 'Akilan@123',
  tyokesh: 'Yokesh@123',
  thanna_admin: 'Hanna@123',
  admin: 'admin123',
  cag_admin: 'cag@123',
};

const LOGO_SRC = '/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png';
const POST_LOGIN_PATH = '/admin/banners';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('25fSdw');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const completeLogin = (token: string) => {
    localStorage.setItem('cag_admin_token', token);
    localStorage.setItem('cag_admin_last_activity', Date.now().toString());
    router.push(POST_LOGIN_PATH);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      setError('Invalid Captcha code. Please try again.');
      setCaptchaInput('');
      generateCaptcha();
      return;
    }

    setLoading(true);

    const inputUser = username.trim().toLowerCase();
    const expectedPass = ADMIN_USERS[inputUser] || ADMIN_USERS[username.trim()];

    if (expectedPass && expectedPass === password) {
      setLoading(false);
      completeLogin(`token_${inputUser}_${Date.now()}`);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError('Invalid username or password. Please check your credentials.');
        generateCaptcha();
        return;
      }

      const data = await res.json();
      completeLogin(data.access_token || data.id || `token_${inputUser}_${Date.now()}`);
    } catch {
      setError('Unable to reach the login service. Please try again.');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
      style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
    >
      <div className="w-full max-w-[520px] flex flex-col items-stretch gap-5">
      {/* Branding header */}
      <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 shadow-xl w-full">
        <div className="flex items-center justify-center gap-4 w-full">
          {/* Circular crest — colored logo on white disc (matches official seal look) */}
          <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-white shadow-lg border-2 border-white/80 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
            <img
              src={LOGO_SRC}
              alt="Comptroller and Auditor General of India"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-left border-l border-white/35 pl-4 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-white leading-tight">
              Comptroller &amp; Auditor General of India
            </h1>
            <p className="text-[11px] sm:text-sm text-white/85 font-medium leading-snug mt-1">
              Supreme Audit Institution of India — Admin Access Desk
            </p>
          </div>
        </div>
        <p className="text-xs text-white/70 italic mt-3">Dedicated to Truth in Public Interest</p>
      </div>

      {/* Sign-in card */}
      <div className="bg-white rounded-xl shadow-2xl w-full overflow-hidden border border-white/10">
        <div
          className="px-6 py-4 text-white"
          style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
        >
          <h2 className="text-base md:text-lg font-bold">Administrator Portal Sign In</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Username / Email Id <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email Id"
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Captcha <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15"
                />
                <div className="flex items-center gap-2">
                  <div
                    className="select-none text-zinc-700 font-mono font-bold tracking-widest text-sm px-5 py-2.5 rounded-lg border border-zinc-200 min-w-[110px] text-center italic"
                    style={{
                      textDecoration: 'line-through',
                      textDecorationStyle: 'double',
                      background:
                        'repeating-linear-gradient(45deg, #eef1f3, #eef1f3 5px, #e2e6e9 5px, #e2e6e9 10px)',
                    }}
                  >
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2.5 border border-zinc-200 text-[#751639] rounded-lg hover:bg-[#fff5f8] transition-colors"
                    title="Generate new Captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-opacity shadow-sm cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        <div className="px-6 py-3 bg-[#fafbfc] border-t border-zinc-100 flex justify-between items-center gap-3 text-[10px] text-zinc-500 font-medium">
          <span>Protected Area — Authorized Administrative Personnel Only</span>
          <span className="shrink-0">Security v2.0</span>
        </div>
      </div>
      </div>
    </div>
  );
}
