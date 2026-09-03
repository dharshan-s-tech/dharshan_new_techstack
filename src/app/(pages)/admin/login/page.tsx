'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';

const ADMIN_USERS: Record<string, string> = {
  'tkeerthana_admin': 'Keerthana@123',
  'tdharshan_admin': 'Dharshan@123',
  'tsowmiya_admin': 'Sowmiya@123',
  'tpurnima_admin': 'Purnima@123',
  'themanth_admin': 'Hemant@123',
  'hemanth@gmail.com': 'Hemant@123',
  'takilan_admin': 'Akilan@123',
  'tyokesh': 'Yokesh@123',
  'thanna_admin': 'Hanna@123',
  'admin': 'admin123',
  'cag_admin': 'cag@123'
};

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('25fSdw');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to generate a simple alphanumeric captcha
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check captcha
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
      localStorage.setItem('cag_admin_token', `token_${inputUser}_${Date.now()}`);
      localStorage.setItem('cag_admin_last_activity', Date.now().toString());
      setLoading(false);
      router.push('/admin/offices');
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        if (!expectedPass) {
          setError('Invalid username or password. Please check your credentials.');
          setLoading(false);
          generateCaptcha();
          return;
        }
        localStorage.setItem('cag_admin_token', 'demo_admin_token');
        localStorage.setItem('cag_admin_last_activity', Date.now().toString());
        router.push('/admin/offices');
        return;
      }

      const data = await res.json();
      localStorage.setItem('cag_admin_token', data.access_token || 'demo_admin_token');
      localStorage.setItem('cag_admin_last_activity', Date.now().toString());
      router.push('/admin/offices');
    } catch (err: any) {
      if (expectedPass && expectedPass === password) {
        localStorage.setItem('cag_admin_token', 'demo_admin_token');
        localStorage.setItem('cag_admin_last_activity', Date.now().toString());
        router.push('/admin/offices');
      } else {
        setError('Invalid username or password. Please check your credentials.');
        generateCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
    >
      
      {/* Official Header Section */}
      <div className="flex flex-col items-center mb-8 text-center bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl border border-white/20 shadow-xl">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img 
            src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png" 
            alt="CAG Crest Logo" 
            className="h-14 w-auto object-contain brightness-0 invert"
          />
          <div className="text-left border-l border-white/30 pl-4">
            <h1 className="text-lg md:text-xl font-bold text-white leading-tight">
              Comptroller & Auditor General of India
            </h1>
            <p className="text-xs text-white/80 font-medium leading-none mt-0.5">
              Supreme Audit Institution of India — Admin Access Desk
            </p>
          </div>
        </div>
        <p className="text-[10px] text-white/60 italic">
          Dedicated to Truth in Public Interest
        </p>
      </div>

      {/* Login Card Box */}
      <div className="bg-white border border-[#ced4da] rounded-none shadow-2xl w-full max-w-[520px] overflow-hidden">
        
        {/* Card Title */}
        <div 
          className="px-6 py-4 border-b border-[#5c102c] text-white"
          style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
        >
          <h2 className="text-lg font-bold">
            Administrator Portal Sign In
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-750 text-xs rounded-none p-3 mb-4 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Username field */}
            <div>
              <label className="block font-bold text-zinc-750 mb-1">
                Username / Email Id <span className="text-red-650 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email Id"
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block font-bold text-zinc-750 mb-1">
                Password <span className="text-red-650 font-bold">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>

            {/* Captcha row */}
            <div>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Captcha"
                  className="flex-grow bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-900 focus:outline-none focus:border-[#751639]"
                />
                
                {/* Styled Captcha Display */}
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-[#d2d7db] border border-zinc-300 select-none text-zinc-700 font-mono font-bold tracking-widest text-sm px-6 py-2 rounded-none flex items-center justify-center italic"
                    style={{
                      textDecoration: 'line-through',
                      textDecorationStyle: 'double',
                      background: 'repeating-linear-gradient(45deg, #e1e5e8, #e1e5e8 5px, #d2d7db 5px, #d2d7db 10px)'
                    }}
                  >
                    {captchaCode}
                  </div>
                  
                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 border border-zinc-300 text-[#751639] rounded-none hover:bg-zinc-100 transition-colors"
                    title="Generate new Captcha"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold text-sm py-2.5 rounded-none transition-all shadow-sm cursor-pointer"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-[#fafbfc] border-t border-[#e2e5e7] flex justify-between items-center text-[10px] text-zinc-500 font-medium">
          <span>Protected Area — Authorized Administrative Personnel Only</span>
          <span>Security v2.0</span>
        </div>
      </div>
    </div>
  );
}
