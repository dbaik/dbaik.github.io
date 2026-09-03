import { useEffect, useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { Mail, Send, CheckCircle2, Copy, Check } from 'lucide-react'
import { PERSONAL_INFO } from '../data/portfolioData'
import { CONTACT_TYPE_EVENT, consumePendingContactType } from '../utils/scroll'

const FORMSPREE_FORM_ID = 'xaeywwjb'

const projectTypes = [
  { value: 'WordPress development', label: 'WordPress' },
  { value: 'Shopify development', label: 'Shopify' },
  { value: 'Frontend / performance', label: 'Frontend / Performance' },
  { value: 'Other', label: 'Other' },
] as const

const inputClassName =
  'contact-field w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors'

const labelClassName = 'font-mono text-xs font-semibold text-slate-300 tracking-wider'

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Clipboard API can fail outside a secure context or without permission.
  }

  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.left = '-9999px'
  document.body.appendChild(field)
  field.select()
  field.setSelectionRange(0, text.length)

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }

  field.remove()
  return copied
}

function InquiryForm({ onReset }: { onReset: () => void }) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID)
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    const applyType = (type: string) => {
      if (projectTypes.some((option) => option.value === type)) {
        setSelectedType(type)
      }
    }

    const pending = consumePendingContactType()
    if (pending) applyType(pending)

    const onContactType = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (typeof detail === 'string') applyType(detail)
    }

    window.addEventListener(CONTACT_TYPE_EVENT, onContactType)
    return () => window.removeEventListener(CONTACT_TYPE_EVENT, onContactType)
  }, [])

  if (state.succeeded) {
    return (
      <div className="flex min-h-[437px] flex-col items-center justify-center px-2 py-10 text-center sm:py-12">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">Message sent successfully</h3>
        <p className="mt-2 font-sans text-sm text-slate-400 max-w-sm leading-relaxed">
          Thank you for reaching out.
          <br />
          I usually reply within 24 hours.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          Send Another Note
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className={labelClassName}>
            YOUR NAME *
          </label>
          <input id="contact-name" type="text" name="name" autoComplete="name" placeholder="Jane Doe" className={inputClassName} required />
          <ValidationError prefix="Name" field="name" errors={state.errors} className="font-mono text-xs text-rose-400" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className={labelClassName}>
            EMAIL ADDRESS *
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className={inputClassName}
            required
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="font-mono text-xs text-rose-400" />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClassName}>PROJECT TYPE</legend>
        <div className="grid grid-cols-2 gap-2">
          {projectTypes.map((type) => (
            <label
              key={type.value}
              className={`contact-type-chip${selectedType === type.value ? ' is-selected' : ''}`}
            >
              <input
                type="radio"
                name="project_type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={() => setSelectedType(type.value)}
                required
                className="visually-hidden"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
        <ValidationError
          prefix="Project type"
          field="project_type"
          errors={state.errors}
          className="font-mono text-xs text-rose-400"
        />
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className={labelClassName}>
          PROJECT OVERVIEW / MESSAGE *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Brief, Figma link, existing site, or contract requirements…"
          className={`${inputClassName} resize-none`}
          required
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="font-mono text-xs text-rose-400" />
      </div>

      <ValidationError errors={state.errors} className="font-mono text-xs text-rose-400" />

      <p className="font-sans text-sm text-slate-400">
        {PERSONAL_INFO.replyNote}
      </p>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-sans text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-indigo-600/20 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
      >
        <Send size={15} />
        <span>{state.submitting ? 'Sending…' : 'Send Project Details'}</span>
      </button>
    </form>
  )
}

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleCopyEmail = async () => {
    const copied = await copyText(PERSONAL_INFO.email)
    if (!copied) return

    setCopiedEmail(true)
    window.setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <section id="contact" className="relative bg-[#070b15] pt-14 pb-6 sm:pt-20 sm:pb-8 lg:pt-24 lg:pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
              <span>05 / CONTACT</span>
            </div>

            <h2 className="contact-heading font-display text-[1.625rem] sm:text-[1.75rem] lg:text-[1.8125rem] font-extrabold text-white tracking-tight leading-[1.2]">
              Have a WordPress or Shopify project that needs senior execution?
            </h2>

            <p className="font-sans text-sm sm:text-base text-slate-400 leading-relaxed">
              Available for B2B and contract engagements. Send the brief, Figma link, existing site, or contract requirements.
            </p>

            <div className="pt-2 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-2 font-mono text-xs text-slate-300 hover:text-white truncate focus-visible:outline-none"
              >
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <span className="truncate">{PERSONAL_INFO.email}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 rounded border border-white/10 bg-white/3 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30 transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-mono text-xs text-slate-400 hover:text-indigo-400 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              LinkedIn →
            </a>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div key={formKey}>
                <InquiryForm onReset={() => setFormKey((key) => key + 1)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
