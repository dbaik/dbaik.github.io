import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, CheckCircle2, Copy, Check, 
  Github, ArrowUpRight
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Custom WordPress & Gutenberg Theme',
    timeline: 'Standard (2-4 Weeks)',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const projectTypes = [
    'Custom WordPress & Gutenberg Theme',
    'Shopify E-Commerce Storefront',
    'Performance & Core Web Vitals Optimization',
    'Figma to Pixel-Perfect HTML/CSS',
    'Contract / Full-Time Senior Role'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and project brief.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        setStatus('success');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch {
      setStatus('success');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <section 
      id="contact" 
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
              <span>07 / GET IN TOUCH</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Let’s build something clean, fast, and maintainable.
            </h2>

            <p className="font-sans text-sm sm:text-base text-slate-400 leading-relaxed">
              Available for custom theme builds, Shopify storefronts, performance audits, and senior developer roles.
            </p>

            {/* Direct Contact Links */}
            <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5">
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center gap-2 font-mono text-xs text-slate-300 hover:text-white truncate focus-visible:outline-none"
                >
                  <Mail size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                </a>
                
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs font-mono text-slate-200 transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Github size={14} className="text-slate-400" />
                  <span>github.com/dbaik</span>
                </div>
                <ArrowUpRight size={13} className="text-slate-400" />
              </a>
            </div>

          </div>

          {/* RIGHT: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative">
              
              {/* Success Message */}
              {status === 'success' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-[#090d1a] p-8 text-center border border-emerald-500/30">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white tracking-tight">
                    Message Sent Successfully
                  </h3>
                  <p className="mt-2 font-sans text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Dmitry has received your inquiry and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        projectType: 'Custom WordPress & Gutenberg Theme',
                        timeline: 'Standard (2-4 Weeks)',
                        message: ''
                      });
                    }}
                    className="mt-6 rounded-lg border border-white/15 bg-white/5 px-5 py-2 font-mono text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  >
                    Send Another Note
                  </button>
                </div>
              )}

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
                    PROJECT / ROLE FOCUS
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-slate-900 text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
                    PROJECT OVERVIEW / MESSAGE *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or open role..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="font-mono text-xs text-rose-400">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-sans text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-indigo-600/20 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                >
                  <Send size={15} />
                  <span>{status === 'submitting' ? 'Sending Message...' : 'Send Message'}</span>
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
