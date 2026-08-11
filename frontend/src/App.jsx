import React, { useState, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
import ShortenScreen from './components/ShortenScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import Footer from './components/Footer';
import { getLocalHistory } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('shorten');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  const handleLinkCreated = (newItem) => {
    setHistory((prev) => [newItem, ...prev.filter(x => x.shortcode !== newItem.shortcode)]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <TopNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'shorten' ? (
        <ShortenScreen onCreated={handleLinkCreated} />
      ) : (
        <AnalyticsScreen history={history} setHistory={setHistory} />
      )}

      <Footer />
    </div>
  );
}
