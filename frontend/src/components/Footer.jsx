import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-dim text-primary dark:text-primary-fixed-dim font-label-sm text-label-sm w-full py-stack-lg border-t border-outline-variant dark:border-outline flat no-shadows mt-auto">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center px-gutter gap-4">
        <div className="font-label-sm text-on-surface-variant text-center md:text-left">
          © 2024 URL Shortener. Built for speed.
        </div>
        <nav className="flex gap-6">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary hover:underline transition-all">
            Privacy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary hover:underline transition-all">
            Terms
          </a>
          <a href="#api" onClick={(e) => e.preventDefault()} className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary hover:underline transition-all">
            API
          </a>
        </nav>
      </div>
    </footer>
  );
}
