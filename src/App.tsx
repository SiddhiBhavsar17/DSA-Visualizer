import React, { useState, useEffect } from 'react';
import { DSAProvider } from './context/DSAContext';
import { Shell } from './components/layout/Shell';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { StackLab } from './components/stack/StackLab';
import { QueueLab } from './components/queue/QueueLab';
import { ArrayLab } from './components/array/ArrayLab';
import { LinkedListLab } from './components/linkedlist/LinkedListLab';
import { ActiveModule } from './types/dsa';

const AppContent: React.FC = () => {
  const validModules: ActiveModule[] = ['dashboard', 'stack', 'queue', 'array', 'linkedlist'];

  const [currentModule, setCurrentModule] = useState<ActiveModule>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (validModules.includes(hash as ActiveModule)) {
      return hash as ActiveModule;
    }
    return 'dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (validModules.includes(hash as ActiveModule)) {
        setCurrentModule(hash as ActiveModule);
      } else {
        setCurrentModule('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (mod: ActiveModule) => {
    setCurrentModule(mod);
    window.location.hash = mod === 'dashboard' ? '' : mod;
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'stack':
        return <StackLab />;
      case 'queue':
        return <QueueLab />;
      case 'array':
        return <ArrayLab />;
      case 'linkedlist':
        return <LinkedListLab />;
      case 'dashboard':
      default:
        return <HomeDashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <Shell currentModule={currentModule} onNavigate={navigateTo}>
      {renderModule()}
    </Shell>
  );
};

export const App: React.FC = () => {
  return (
    <DSAProvider>
      <AppContent />
    </DSAProvider>
  );
};

export default App;
