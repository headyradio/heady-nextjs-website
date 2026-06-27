'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrorMsg(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus('error');
      setErrorMsg('Form is not configured. Please email us directly.');
      return;
    }

    data.append('access_key', accessKey);
    data.append('subject', `HEADY.FM contact: ${data.get('name') || 'anonymous'}`);
    data.append('from_name', 'HEADY.FM Contact Form');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-200">
        <p className="font-bold text-emerald-100">Message sent.</p>
        <p className="mt-1 text-emerald-200/80">
          Thanks for reaching out — we&apos;ll get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-3 text-xs text-emerald-300 underline hover:text-emerald-200"
        >
          Send another
        </button>
      </div>
    );
  }

  const isSending = status === 'sending';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot — Web3Forms ignores submissions where this is non-empty */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/70">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={120}
          disabled={isSending}
          autoComplete="name"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/70">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          disabled={isSending}
          autoComplete="email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/70">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          disabled={isSending}
          defaultValue="General"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
        >
          <option className="bg-gray-950">General</option>
          <option className="bg-gray-950">Music submission</option>
          <option className="bg-gray-950">Press / partnership</option>
          <option className="bg-gray-950">Bug / site issue</option>
          <option className="bg-gray-950">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/70">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          disabled={isSending}
          className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          placeholder="What's up?"
        />
      </div>

      {status === 'error' && errorMsg && (
        <p className="text-sm text-red-400" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
