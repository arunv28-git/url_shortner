import React, { useState, useEffect } from 'react';
import { getLocalHistory, updateLocalHistory } from '../services/api';

export default function AnalyticsScreen({ history, setHistory }) {
  const [filterCode, setFilterCode] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filter list by short code search
  const filteredList = history.filter(item => {
    if (!filterCode.trim()) return true;
    const term = filterCode.trim().toLowerCase();
    return (
      item.shortcode.toLowerCase().includes(term) ||
      item.originalUrl.toLowerCase().includes(term)
    );
  });

  // Calculate stats
  const totalLinks = history.length;
  const totalClicks = history.reduce((sum, item) => sum + (item.clicks || 0), 0);
  
  const mostUsed = history.length > 0
    ? [...history].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    : null;

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.shorturl);
    setCopiedId(item.shortcode);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSimulateClick = (shortcode) => {
    const updated = history.map(item => {
      if (item.shortcode === shortcode) {
        return { ...item, clicks: (item.clicks || 0) + 1 };
      }
      return item;
    });
    setHistory(updated);
    updateLocalHistory(updated);
  };

  const formatExpiration = (item) => {
    if (!item.expiresAt) return <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-xs uppercase font-medium">Never</span>;
    
    const expDate = new Date(item.expiresAt);
    const now = new Date();
    const diffSec = Math.floor((expDate.getTime() - now.getTime()) / 1000);

    if (diffSec <= 0) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-xs uppercase font-medium">Expired</span>;
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-fixed-dim/40 text-primary-container font-label-sm text-xs uppercase font-medium">
        {diffSec < 60 ? `${diffSec} sec` : `${Math.ceil(diffSec / 60)} min`}
      </span>
    );
  };

  const formatCreated = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-stack-lg">
      {/* Header Section */}
      <div className="mb-stack-lg">
        <h1 className="font-display text-display text-on-surface mb-stack-sm">URL Analytics</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Track how your shortened links are performing.
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-stack-md mb-stack-lg p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
        <div className="flex-grow">
          <label className="sr-only" htmlFor="short-code-filter">Short code</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input
              id="short-code-filter"
              type="text"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              placeholder="Search by short code or original URL..."
              className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface-bright text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent font-body-md text-body-md transition-shadow"
            />
          </div>
        </div>
        <button 
          onClick={() => {}}
          className="bg-primary-container text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 whitespace-nowrap active:scale-95 duration-150"
        >
          View Analytics
        </button>
      </div>

      {/* Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-stack-md text-on-secondary-container">
            <span className="material-symbols-outlined">link</span>
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Total Links</h3>
          </div>
          <div className="font-display text-display text-on-surface">{totalLinks}</div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-stack-md text-on-secondary-container">
            <span className="material-symbols-outlined">ads_click</span>
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Total Clicks</h3>
          </div>
          <div className="font-display text-display text-on-surface">{totalClicks}</div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-stack-md text-on-secondary-container">
            <span className="material-symbols-outlined">trending_up</span>
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Most Used Link</h3>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary-container truncate font-code">
            {mostUsed ? `/${mostUsed.shortcode}` : '-'}
          </div>
        </div>
      </div>

      {/* Analytics Table List */}
      {filteredList.length > 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-semibold">Short Code</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-semibold">Original URL</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">Clicks</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-semibold">Created</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-semibold">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredList.map((item) => (
                  <tr key={item.shortcode} className="hover:bg-surface-bright transition-colors group">
                    <td className="py-4 px-4 align-top">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded font-code text-code text-sm font-medium">
                        <a 
                          href={item.shorturl} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={() => handleSimulateClick(item.shortcode)}
                          className="hover:underline text-primary-container"
                        >
                          {item.shortcode}
                        </a>
                        <button
                          onClick={() => handleCopy(item)}
                          className="text-on-secondary-container hover:text-primary-container focus:outline-none transition-colors p-0.5"
                          title="Copy short link"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedId === item.shortcode ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body-md text-body-md text-on-surface hover:text-primary transition-colors truncate max-w-xs md:max-w-md lg:max-w-lg block"
                        title={item.originalUrl}
                      >
                        {item.originalUrl}
                      </a>
                    </td>
                    <td className="py-4 px-4 align-top text-right font-headline-md text-headline-md text-on-surface font-semibold">
                      {item.clicks || 0}
                    </td>
                    <td className="py-4 px-4 align-top text-on-surface-variant font-body-md text-body-md">
                      {formatCreated(item.createdAt)}
                    </td>
                    <td className="py-4 px-4 align-top">
                      {formatExpiration(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant bg-surface-bright flex items-center justify-between sm:px-6">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Showing <span className="font-medium text-on-surface">{filteredList.length}</span> of <span className="font-medium text-on-surface">{history.length}</span> shortened link{history.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="mt-stack-lg p-stack-lg border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-center bg-surface-bright">
          <div className="bg-surface-container-highest p-4 rounded-full mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">analytics</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No analytics available yet.</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Create a shortened link and share it to start tracking clicks and performance data.
          </p>
        </div>
      )}
    </main>
  );
}
