import React, { useState } from 'react';
import { api } from '@/lib/api';

interface GrievanceFormTemplateProps {
  isHindi?: boolean;
  stateSlug?: string;
}

export default function GrievanceFormTemplate({ isHindi = false, stateSlug = 'andhra-pradesh' }: GrievanceFormTemplateProps) {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [serviceType, setServiceType] = useState('GPF');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gpfAcNo, setGpfAcNo] = useState('');
  const [ppoNo, setPpoNo] = useState('');
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.submitGrievance(stateSlug, {
        full_name: fullName,
        mobile,
        email,
        complaint_related_to: serviceType,
        gpf_ac_no: gpfAcNo,
        pension_appln_ppo_no: ppoNo,
        subject: `Grievance regarding ${serviceType}`,
        suggestion_complaint: description
      });

      if (res && res.success) {
        setTicketId(res.ticket_id || `CAG-AE-${stateSlug.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`);
        setSubmitted(true);
      } else {
        setErrorMsg(res?.message || 'Failed to submit grievance. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] font-['Noto_Sans',sans-serif] text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-[#1F2937] mb-2">
          {isHindi ? 'शिकायत सफलतापूर्वक दर्ज की गई!' : 'Grievance Submitted Successfully!'}
        </h2>
        <p className="text-[#4B5563] text-[15px] mb-6">
          {isHindi
            ? 'आपका शिकायत संदर्भ टोकन नंबर: '
            : 'Your grievance reference token number is: '}
          <strong className="text-[#751639]">{ticketId}</strong>
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFullName('');
            setMobile('');
            setEmail('');
            setDescription('');
            setGpfAcNo('');
            setPpoNo('');
          }}
          className="bg-[#751639] hover:bg-[#5E112E] text-white text-[14px] font-semibold px-6 py-2.5 rounded-[6px] transition-colors cursor-pointer"
        >
          {isHindi ? 'नई शिकायत दर्ज करें' : 'Submit Another Grievance'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[8px] p-6 lg:p-8 border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] font-['Noto_Sans',sans-serif]">
      <h1 className="text-[26px] md:text-[30px] font-bold text-[#751639] border-b border-[#F0F0F0] pb-4 mb-6">
        {isHindi ? 'नागरिक शिकायत एवं प्रतिपुष्टि पोर्टल' : 'Citizen Grievance & Feedback Portal'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 text-[14px] text-[#374151]">
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-[13px] border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Row 1: Full Name & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">
              {isHindi ? 'पूरा नाम *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isHindi ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">
              {isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
            />
          </div>
        </div>

        {/* Row 2: Email & Service Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">
              {isHindi ? 'ईमेल आईडी' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">
              {isHindi ? 'शिकायत का विषय / सेवा प्रकार *' : 'Complaint Relating to / Service Type *'}
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639] bg-white"
            >
              <option value="GPF">GPF (General Provident Fund)</option>
              <option value="Pension">Pension & Retirement Benefits</option>
              <option value="Accounts">State Accounts & Compilation</option>
              <option value="Gazetted">Gazetted Entitlement</option>
              <option value="General">General Administrative Query</option>
            </select>
          </div>
        </div>

        {/* Conditional Fields based on Service Type */}
        {serviceType === 'GPF' && (
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">GPF Account Number</label>
            <input
              type="text"
              value={gpfAcNo}
              onChange={(e) => setGpfAcNo(e.target.value)}
              placeholder="e.g. AP/EDN/12345"
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
            />
          </div>
        )}

        {serviceType === 'Pension' && (
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#1F2937]">PPO Number / Application Reference Number</label>
            <input
              type="text"
              value={ppoNo}
              onChange={(e) => setPpoNo(e.target.value)}
              placeholder="e.g. PPO/2026/9821"
              className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
            />
          </div>
        )}

        {/* Grievance Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center font-semibold text-[#1F2937]">
            <label>{isHindi ? 'शिकायत का विवरण *' : 'Grievance / Complaint Description *'}</label>
            <span className="text-[12px] font-normal text-[#6B7280]">
              {charCount} / 1000 {isHindi ? 'अक्षर' : 'chars'}
            </span>
          </div>
          <textarea
            required
            rows={4}
            maxLength={1000}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder={isHindi ? 'अपनी शिकायत का विस्तृत विवरण यहां लिखें...' : 'Describe your grievance in detail...'}
            className="border border-[#D1D5DB] rounded-[6px] px-3.5 py-2.5 outline-none focus:border-[#751639]"
          />
        </div>

        {/* File Attachment */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[#1F2937]">
            {isHindi ? 'संबंधित दस्तावेज़ संलग्न करें (वैकल्पिक, केवल PDF)' : 'Attach Supporting Document (Optional, PDF only max 5MB)'}
          </label>
          <input
            type="file"
            accept=".pdf"
            className="border border-[#D1D5DB] rounded-[6px] p-2 text-[13px] text-[#4B5563]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#751639] hover:bg-[#5E112E] disabled:opacity-50 text-white font-semibold text-[15px] px-8 py-3 rounded-[6px] shadow-sm transition-colors cursor-pointer"
          >
            {loading ? (isHindi ? 'प्रसंस्करण...' : 'Submitting...') : (isHindi ? 'शिकायत दर्ज करें' : 'Submit Grievance')}
          </button>
        </div>
      </form>
    </div>
  );
}
