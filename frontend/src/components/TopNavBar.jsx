import React, { useState } from 'react';

export default function TopNavBar({ activeTab, setActiveTab }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="bg-surface dark:bg-background text-primary dark:text-primary-fixed-dim font-body-md text-body-md w-full top-0 sticky border-b border-outline-variant dark:border-outline flat no-shadows z-50">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
          {/* Logo / Brand */}
          <button 
            onClick={() => setActiveTab('shorten')} 
            className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-primary-fixed hover:opacity-80 transition-opacity active:scale-95 duration-150 cursor-pointer focus:outline-none text-left"
          >
            URL Shortener
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`font-body-md text-body-md pb-1 transition-colors hover:opacity-80 active:scale-95 duration-150 focus:outline-none ${
                activeTab === 'shorten'
                  ? 'text-primary dark:text-primary-fixed-dim font-semibold border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim'
              }`}
            >
              Shorten
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`font-body-md text-body-md pb-1 transition-colors hover:opacity-80 active:scale-95 duration-150 focus:outline-none ${
                activeTab === 'analytics'
                  ? 'text-primary dark:text-primary-fixed-dim font-semibold border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim'
              }`}
            >
              Analytics
            </button>
          </nav>

          {/* Action Button */}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-container text-on-primary hover:opacity-90 transition-opacity active:scale-95 duration-150 rounded-lg px-4 py-2 font-label-sm text-label-sm font-medium focus:ring-2 focus:ring-primary-container focus:ring-offset-2 outline-none"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Sign Up Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-headline-md text-on-surface">Developer Account</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-outline hover:text-on-surface transition-colors p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-md text-on-surface-variant mb-6">
              Sign up to save unlimited short links, custom domains, and view advanced real-time click analytics.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface block mb-1">Email address</label>
                <input 
                  type="email" 
                  placeholder="developer@example.com" 
                  required 
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg font-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-sm hover:opacity-90 transition-opacity"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
