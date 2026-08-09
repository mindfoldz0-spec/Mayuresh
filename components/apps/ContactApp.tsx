'use client';

import React, { useState } from 'react';
import { MAYURESH_PROFILE } from '../../data/portfolio';
import { Mail, Send, CheckCircle2, Copy, MapPin, MessageSquare, User, AtSign } from 'lucide-react';
import { useSystemStore } from '../../store/useSystemStore';

export const ContactApp: React.FC = () => {
  const { addNotification } = useSystemStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(MAYURESH_PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification('Email Copied', `${MAYURESH_PROFILE.email} copied to clipboard!`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      addNotification(
        'Message Sent!',
        `Thank you ${formData.name}, Mayuresh will respond shortly!`,
        'success'
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 select-text">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Mail className="text-cyan-400" size={22} />
          Get In Touch With Mayuresh
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Have a project proposal, technical inquiry, or opportunity? Send a direct message!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column: Direct Info Card */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Direct Contact Channels
            </h3>

            {/* Email item */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">DIRECT EMAIL</div>
                  <div className="text-xs font-semibold text-white">{MAYURESH_PROFILE.email}</div>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                title="Copy Email"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Location */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                <MapPin size={16} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">LOCATION</div>
                <div className="text-xs font-semibold text-white">{MAYURESH_PROFILE.location}</div>
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Usual response time within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-3">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={16} />
              Send Message
            </h3>

            {isSent ? (
              <div className="p-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                <h4 className="text-base font-bold text-white">Message Delivered Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. Mayuresh has received your transmission and will respond promptly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <User size={12} className="text-cyan-400" /> Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <AtSign size={12} className="text-cyan-400" /> Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <label>Message *</label>
                    <span className="text-slate-500 font-mono">{formData.message.length}/500</span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={500}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hello Mayuresh, I would like to discuss..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none custom-scrollbar"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
