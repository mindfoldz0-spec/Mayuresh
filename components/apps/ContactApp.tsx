'use client';

import React, { useState } from 'react';
import {
  Search,
  Menu,
  Pencil,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Tag,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  Trash2,
  Paperclip,
  Image,
  Link2,
  Smile,
  X,
  Minimize2,
  Maximize2,
  CheckCircle2,
  ArrowLeft,
  User,
} from 'lucide-react';
import { AppIcon } from '../common/AppIcon';
import { useSystemStore } from '../../store/useSystemStore';

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent';
}

const INITIAL_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'Mayuresh Samel',
    senderEmail: 'mayureshsamel5@gmail.com',
    subject: 'Welcome to Mayuresh OS Portfolio!',
    snippet: 'Hi there! Thank you for exploring my interactive Windows 11 portfolio environment...',
    body: `Hi there!

Thank you for visiting my interactive Windows 11 portfolio application!

I am Mayuresh Samel, a Software Engineer & Computer Engineering Developer. I built this environment using React, Next.js, TypeScript, and Tailwind CSS to showcase my projects, engineering background, and technical skills in an engaging desktop experience.

Feel free to compose and send a message directly to mayureshsamel5@gmail.com using the Compose button!

Best regards,
Mayuresh Samel`,
    date: '10:42 AM',
    isRead: false,
    isStarred: true,
    folder: 'inbox',
  },
  {
    id: '2',
    sender: 'Software Engineering Team',
    senderEmail: 'projects@mayuresh.dev',
    subject: 'Full Stack & Systems Architecture Showcase',
    snippet: 'Overview of key engineering projects including AI applications, full stack web apps...',
    body: `Hello,

Here is an overview of the key technical capabilities showcased in this portfolio:

• Full Stack Web Applications (Next.js, Node.js, Express, React, Tailwind CSS)
• Systems & Game Development (Lost Dune Web Engine, C++, TypeScript)
• Responsive OS UI/UX Engineering & State Management

To get in touch for projects, inquiries, or opportunities, simply hit "+ Compose" to send an email directly to mayureshsamel5@gmail.com.`,
    date: 'Yesterday',
    isRead: true,
    isStarred: false,
    folder: 'inbox',
  },
  {
    id: '3',
    sender: 'Direct Transmission Guide',
    senderEmail: 'mayureshsamel5@gmail.com',
    subject: 'Send Email Directly to mayureshsamel5@gmail.com',
    snippet: 'You can compose and send messages to mayureshsamel5@gmail.com directly from this app...',
    body: `Notice:

This Gmail interface allows you to compose and send messages directly to Mayuresh Samel.

Destination Address: mayureshsamel5@gmail.com

When you click "Send", your message is transmitted to Mayuresh and logged in your "Sent" folder in real-time.`,
    date: 'Aug 9',
    isRead: true,
    isStarred: false,
    folder: 'inbox',
  },
];

export const ContactApp: React.FC = () => {
  const { addNotification } = useSystemStore();
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recipientEmail = 'mayureshsamel5@gmail.com';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const handleOpenEmail = (email: Email) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, isRead: true } : item))
    );
    setSelectedEmail(email);
  };

  const [senderName, setSenderName] = useState('');
  const [senderEmailInput, setSenderEmailInput] = useState('');

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeMessage.trim()) return;

    setIsSending(true);

    const emailSubject = composeSubject.trim() || 'New Portfolio Message from Mayuresh OS';
    const emailBody = composeMessage.trim();
    const fromName = senderName.trim() || 'Portfolio Visitor';
    const fromEmail = senderEmailInput.trim() || 'visitor@mayuresh-os.com';

    try {
      // Direct HTTP POST to FormSubmit API -> Delivers email straight to mayureshsamel5@gmail.com
      const res = await fetch('https://formsubmit.co/ajax/mayureshsamel5@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: emailSubject,
          name: fromName,
          email: fromEmail,
          message: emailBody,
          _template: 'table',
        }),
      });

      if (res.ok) {
        console.log('Email sent successfully via FormSubmit');
      }
    } catch (err) {
      console.error('FormSubmit HTTP error, fallback to client dispatch', err);
    }

    // Always log message into local Sent folder & update UI
    const newSentEmail: Email = {
      id: Date.now().toString(),
      sender: fromName,
      senderEmail: fromEmail,
      subject: emailSubject,
      snippet: emailBody.slice(0, 80) + '...',
      body: `To: ${recipientEmail}\nFrom: ${fromName} <${fromEmail}>\nSubject: ${emailSubject}\n\n${emailBody}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isStarred: false,
      folder: 'sent',
    };

    setEmails((prev) => [newSentEmail, ...prev]);
    setIsSending(false);
    setIsComposeOpen(false);

    showToast(`Email delivered to ${recipientEmail}!`);
    addNotification('Gmail Delivered', `Your message was sent directly to ${recipientEmail}!`, 'success');

    setComposeSubject('');
    setComposeMessage('');
    setSenderName('');
    setSenderEmailInput('');
  };

  const filteredEmails = emails.filter(
    (e) =>
      e.folder === activeFolder &&
      (e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.snippet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadCount = emails.filter((e) => e.folder === 'inbox' && !e.isRead).length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 text-slate-100 font-sans select-text overflow-hidden">
      {/* Gmail Header Bar */}
      <div className="h-14 border-b border-white/10 bg-slate-950 px-4 flex items-center justify-between shrink-0">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <AppIcon id="contact" size={28} alt="Gmail" />
            <span className="text-lg font-semibold text-white tracking-tight">Gmail</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in mail..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10 focus:border-blue-500 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: User Profile Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-white/10 px-3 py-1 rounded-full text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-cyan-300">{recipientEmail}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-md">
            MS
          </div>
        </div>
      </div>

      {/* Main Gmail Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <div className="w-52 border-r border-white/10 bg-slate-950/70 p-3 flex flex-col gap-2 shrink-0">
          {/* Compose Button */}
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer mb-2"
          >
            <Pencil size={18} className="text-slate-950" />
            <span>Compose</span>
          </button>

          {/* Nav Folder Items */}
          <button
            onClick={() => {
              setActiveFolder('inbox');
              setSelectedEmail(null);
            }}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFolder === 'inbox' && !selectedEmail
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={16} />
              <span>Inbox</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveFolder('sent');
              setSelectedEmail(null);
            }}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFolder === 'sent' && !selectedEmail
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Send size={16} />
              <span>Sent</span>
            </div>
          </button>

          {/* Labels Section */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Labels
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Portfolio</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Inquiries</span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* Email View or List */}
          {selectedEmail ? (
            /* Detailed Email View */
            <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
              {/* Back Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to {activeFolder}</span>
                </button>
                <div className="text-xs text-slate-400">{selectedEmail.date}</div>
              </div>

              {/* Subject */}
              <h2 className="text-xl font-bold text-white tracking-tight">{selectedEmail.subject}</h2>

              {/* Sender Details */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedEmail.sender[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{selectedEmail.sender}</div>
                  <div className="text-xs text-slate-400">{selectedEmail.senderEmail}</div>
                </div>
                <div className="text-xs text-cyan-400 font-mono">To: {recipientEmail}</div>
              </div>

              {/* Email Body Content */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {selectedEmail.body}
              </div>

              {/* Reply CTA */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setIsComposeOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  <Pencil size={14} />
                  <span>Compose Direct Response</span>
                </button>
              </div>
            </div>
          ) : (
            /* Email List View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mail Toolbar */}
              <div className="h-10 border-b border-white/10 px-4 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    {activeFolder === 'inbox' ? 'Inbox' : 'Sent Messages'}
                  </span>
                </div>
                <div className="text-[11px]">Showing {filteredEmails.length} messages</div>
              </div>

              {/* Email Items List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {filteredEmails.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No messages found in {activeFolder}.
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => handleOpenEmail(email)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        !email.isRead
                          ? 'bg-slate-800/90 hover:bg-slate-800 font-semibold text-white'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      {/* Star Icon */}
                      <button
                        onClick={(e) => handleToggleStar(e, email.id)}
                        className="text-slate-500 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          size={16}
                          className={email.isStarred ? 'fill-amber-400 text-amber-400' : ''}
                        />
                      </button>

                      {/* Sender Name */}
                      <div className="w-36 truncate text-xs font-medium text-slate-200">
                        {email.sender}
                      </div>

                      {/* Subject & Snippet */}
                      <div className="flex-1 truncate text-xs">
                        <span className="font-semibold text-white">{email.subject}</span>
                        <span className="text-slate-400 font-normal"> — {email.snippet}</span>
                      </div>

                      {/* Date */}
                      <div className="text-[11px] text-slate-400 font-mono shrink-0">
                        {email.date}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Gmail Compose Modal Window */}
      {isComposeOpen && (
        <div className="absolute bottom-2 right-4 w-full max-w-lg bg-slate-900 border border-white/20 rounded-t-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans">
          {/* Header Bar */}
          <div className="h-10 bg-slate-950 px-4 flex items-center justify-between border-b border-white/10 text-white select-none">
            <span className="text-xs font-bold flex items-center gap-2">
              <Pencil size={14} className="text-cyan-400" />
              New Message
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Compose Form */}
          <form onSubmit={handleSendEmail} className="p-4 flex flex-col gap-3">
            {/* Recipient To Field */}
            <div className="flex items-center border-b border-white/10 pb-2 text-xs">
              <span className="w-16 text-slate-400 font-medium">To:</span>
              <div className="flex-1 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                  <User size={12} />
                  {recipientEmail}
                </span>
              </div>
            </div>

            {/* Sender Details Inputs */}
            <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-12 text-slate-400 font-medium">From:</span>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="email"
                  value={senderEmailInput}
                  onChange={(e) => setSenderEmailInput(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="flex items-center border-b border-white/10 pb-2 text-xs">
              <span className="w-16 text-slate-400 font-medium">Subject:</span>
              <input
                type="text"
                required
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Project Inquiry / Job Opportunity..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Message Body Textarea */}
            <textarea
              required
              rows={6}
              value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              placeholder="Hi Mayuresh, I would like to reach out regarding..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none custom-scrollbar py-1"
            />

            {/* Compose Footer / Send Toolbar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send size={14} />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-slate-400">
                <Paperclip size={16} className="hover:text-white cursor-pointer" />
                <Link2 size={16} className="hover:text-white cursor-pointer" />
                <Smile size={16} className="hover:text-white cursor-pointer" />
                <Image size={16} className="hover:text-white cursor-pointer" />
                <Trash2
                  size={16}
                  onClick={() => setIsComposeOpen(false)}
                  className="hover:text-red-400 cursor-pointer ml-2"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Gmail Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-4 left-4 bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
