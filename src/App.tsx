import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { StackView } from './components/StackView';
import { QueueView } from './components/QueueView';

type ViewMode = 'home' | 'stack' | 'queue';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#stack') return 'stack';
    if (hash === '#queue') return 'queue';
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#stack') {
        setCurrentView('stack');
      } else if (hash === '#queue') {
        setCurrentView('queue');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
  };

  if (currentView === 'stack') {
    return <StackView onBack={() => navigateTo('home')} />;
  }

  if (currentView === 'queue') {
    return <QueueView onBack={() => navigateTo('home')} />;
  }

  return <Home onNavigate={navigateTo} />;
};

export default App;
