import React, { useState } from 'react';
import { shortenUrl } from '../services/api';

export default function ShortenScreen({ onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customalias, setCustomalias] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const res = await shortenUrl({
        originalUrl,
        customalias,
        expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
      });

      setResult({
        shorturl: res.newItem.shorturl,
        shortcode: res.newItem.shortcode,
        originalUrl: res.newItem.originalUrl,
        customalias: customalias || 'Auto-generated',
        expiresIn: expiresIn ? `${expiresIn}s` : 'Never',
      });

      if (onCreated) {
        onCreated(res.newItem);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while shortening the URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.shorturl) return;
    navigator.clipboard.writeText(result.shorturl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-gutter py-stack-lg max-w-container-max mx-auto w-full relative">
      {/* Decorative Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-fixed-dim opacity-20 blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tertiary-fixed opacity-20 blur-[120px]"></div>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center mb-stack-lg">
        <h1 className="font-display text-display text-on-surface mb-stack-sm tracking-tight">
          Shorten your URL
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
          Create a simple, shareable link in seconds.
        </p>
      </div>

      {/* Form Card Bento */}
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05),_0_2px_4px_-2px_rgb(0_0_0_/_0.05)] p-gutter mb-stack-lg transition-shadow hover:shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
          {error && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm flex items-center gap-2 border border-error/20">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Original URL Field */}
          <div className="flex flex-col gap-unit">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="original-url">
              Original URL
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                link
              </span>
              <input
                id="original-url"
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                className="w-full bg-surface-bright border border-outline-variant rounded-xl pl-10 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Alias & Expiration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {/* Custom Alias */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="custom-alias">
                Custom alias <span className="text-outline font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  edit
                </span>
                <input
                  id="custom-alias"
                  type="text"
                  value={customalias}
                  onChange={(e) => setCustomalias(e.target.value)}
                  placeholder="my-link"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none"
                />
              </div>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Leave empty to generate one automatically.
              </p>
            </div>

            {/* Expiration */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="expiration">
                Expiration <span class="text-outline font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  timer
                </span>
                <input
                  id="expiration"
                  type="number"
                  min="1"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  placeholder="60"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none"
                />
              </div>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Enter expiration time in seconds.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-stack-sm flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-container text-on-primary hover:bg-primary transition-colors active:scale-95 duration-150 rounded-lg px-6 py-3 font-label-sm text-label-sm flex items-center gap-2 group shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Shortening...' : 'Shorten URL'}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Card (Visible when result exists) */}
      {result && (
        <div className="w-full max-w-2xl glass-panel rounded-xl p-gutter animate-fade-in-up border-primary-fixed-dim border-2 relative overflow-hidden shadow-lg">
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none"></div>

          <div className="flex justify-between items-center mb-stack-md relative z-10">
            <h2 className="font-headline-md text-headline-md text-on-surface">Your shortened URL</h2>
            <span className="bg-primary-fixed-dim/30 text-primary-container px-3 py-1 rounded-full font-label-sm text-xs uppercase flex items-center gap-1 border border-primary-fixed-dim font-medium">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Success
            </span>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg p-stack-sm flex items-center justify-between gap-4 mb-stack-md relative z-10 group">
            <div className="font-code text-code text-on-surface truncate flex-1 font-medium">
              {result.shorturl}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 font-label-sm text-label-sm p-2 rounded-md transition-all active:scale-95 ${
                copied
                  ? 'text-primary-container font-semibold bg-primary-fixed-dim/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-sm border-t border-outline-variant/50 pt-stack-sm relative z-10">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider">Original URL</span>
              <span className="font-body-md text-[14px] text-on-surface-variant truncate" title={result.originalUrl}>
                {result.originalUrl}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider">Custom alias</span>
              <span className="font-body-md text-[14px] text-on-surface-variant truncate">
                {result.customalias}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider">Expires in</span>
              <span className="font-body-md text-[14px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
                {result.expiresIn}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
