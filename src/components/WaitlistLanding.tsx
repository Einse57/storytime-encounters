import { type FormEvent, useEffect, useState } from 'react';

const STORAGE_KEY = 'ste-waitlist-joined';

type Interest = 'kids' | 'tabletop' | 'both' | '';

function goToApp() {
  window.history.pushState({}, '', '/app');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function WaitlistLanding() {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<Interest>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        setStatus('done');
      }
    } catch {
      // ignore private-mode / blocked storage
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setStatus('submitting');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          interest: interest || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(typeof data.error === 'string' ? data.error : 'Something went wrong.');
        return;
      }
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // ignore
      }
      setStatus('done');
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-[#f5eedc] text-[#2c1810] font-sans pb-20">
      <header className="pt-6 pb-2 px-4 max-w-lg mx-auto flex items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg font-serif font-black tracking-wider uppercase text-[#451a03]">
          Storytime Encounters
        </h1>
        <button
          type="button"
          onClick={goToApp}
          className="text-[11px] font-serif font-bold uppercase tracking-wide text-amber-950/70 hover:text-amber-950 underline-offset-2 hover:underline cursor-pointer"
        >
          Open companion
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-4" aria-labelledby="hero-heading">
          <p className="text-[11px] font-serif font-bold uppercase tracking-[0.2em] text-amber-900/55">
            Soft launch · Family waitlist
          </p>
          <h2
            id="hero-heading"
            className="text-2xl sm:text-3xl font-serif font-black leading-snug text-[#451a03] drop-shadow-2xs"
          >
            Adventures you tell together. A storybook you keep.
          </h2>
          <p className="text-sm sm:text-base text-amber-950/75 leading-relaxed max-w-md mx-auto">
            A lightweight storytelling companion for parents and kids — seeds, sparks,
            dice, voice, and comic scenes for adventures you invent on the couch.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-xl bg-[#451a03] text-amber-100 px-5 py-3 text-sm font-serif font-black uppercase tracking-wider shadow-md hover:bg-[#5c2608] transition-colors"
            >
              Join family waitlist
            </a>
            <button
              type="button"
              onClick={goToApp}
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#d9c49e] bg-[#eae0cc]/80 text-[#451a03] px-5 py-3 text-sm font-serif font-black uppercase tracking-wider hover:bg-[#eae0cc] transition-colors cursor-pointer"
            >
              Try free companion
            </button>
          </div>
        </section>

        {/* Parent-operated trust */}
        <section
          className="rounded-2xl border border-[#d9c49e] bg-[#faf6ec]/90 px-4 py-4 shadow-sm space-y-2"
          aria-label="Built for parents"
        >
          <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#451a03]">
            Parent-operated by design
          </h3>
          <ul className="text-sm text-amber-950/80 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>You hold the device — kids join the story, not an account maze.</li>
            <li>No social feed, no stranger chat, no ads in the free companion.</li>
            <li>Session notes stay on your device unless you choose to share them.</li>
          </ul>
        </section>

        {/* Founding Family tease (no Stripe / no pricing) */}
        <section
          className="rounded-2xl border border-amber-800/15 bg-gradient-to-br from-[#fff8e8] to-[#f2ead9] px-4 py-4 shadow-sm space-y-2"
          aria-label="Founding Family"
        >
          <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#451a03]">
            Founding Family (coming soon)
          </h3>
          <p className="text-sm text-amber-950/80 leading-relaxed">
            Early waitlist families will be invited first when we open a small{' '}
            <span className="font-semibold">Founding Family</span> circle — early access,
            a say in what we build next, and a keepsake storybook path. No checkout here;
            we&apos;ll email when seats open.
          </p>
        </section>

        {/* Waitlist form */}
        <section
          id="waitlist"
          className="rounded-2xl border border-[#d9c49e] bg-white/60 px-4 py-5 shadow-sm space-y-4"
          aria-labelledby="waitlist-heading"
        >
          <div className="space-y-1">
            <h3
              id="waitlist-heading"
              className="text-base font-serif font-black uppercase tracking-wider text-[#451a03]"
            >
              Join the family waitlist
            </h3>
            <p className="text-xs text-amber-900/65">
              Soft launch — we&apos;ll ping you when Founding Family opens. No payment today.
            </p>
          </div>

          {status === 'done' ? (
            <div
              className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-900"
              role="status"
            >
              You&apos;re on the list — thanks for joining the family. Try the free companion
              anytime while we warm up the launch.
              <div className="mt-3">
                <button
                  type="button"
                  onClick={goToApp}
                  className="text-emerald-800 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Try free companion →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-serif font-bold uppercase tracking-wide text-[#451a03]">
                  Email <span className="text-amber-800/50">(required)</span>
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@family.email"
                  className="w-full rounded-xl border border-[#d9c49e] bg-[#fdfcf9] px-3 py-2.5 text-sm text-[#2c1810] placeholder:text-amber-900/35 focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </label>

              <fieldset className="space-y-2">
                <legend className="text-xs font-serif font-bold uppercase tracking-wide text-[#451a03]">
                  I&apos;m most interested in{' '}
                  <span className="text-amber-800/50 font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: 'kids', label: 'Kids / bedtime' },
                      { value: 'tabletop', label: 'Tabletop / GM' },
                      { value: 'both', label: 'Both' },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                        interest === opt.value
                          ? 'border-[#451a03] bg-[#451a03] text-amber-100'
                          : 'border-[#d9c49e] bg-[#faf6ec] text-amber-950/80 hover:bg-[#eae0cc]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={opt.value}
                        checked={interest === opt.value}
                        onChange={() => setInterest(opt.value)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {status === 'error' && errorMsg ? (
                <p className="text-sm text-red-800" role="alert">
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-xl bg-[#451a03] text-amber-100 px-5 py-3 text-sm font-serif font-black uppercase tracking-wider shadow-md hover:bg-[#5c2608] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {status === 'submitting' ? 'Joining…' : 'Join family waitlist'}
              </button>
            </form>
          )}
        </section>

        <p className="text-center text-[11px] font-serif text-amber-900/55 px-2">
          Built for storytellers, adventurers, and young imaginations — parents in the
          driver&apos;s seat.
        </p>
      </main>
    </div>
  );
}
