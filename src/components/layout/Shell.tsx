import React, { useState } from 'react';
import { ActiveModule } from '../../types/dsa';
import {
  Terminal,
  Layers,
  Package,
  Grid,
  Link2,
  Menu,
  X,
  Cpu,
  Activity,
} from 'lucide-react';

interface ShellProps {
  currentModule: ActiveModule;
  onNavigate: (module: ActiveModule) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ currentModule, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems: { id: ActiveModule; label: string; code: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      code: 'HOME',
      icon: <Terminal size={15} />,
    },
    {
      id: 'stack',
      label: 'Stack',
      code: 'STACK',
      icon: <Layers size={15} />,
    },
    {
      id: 'queue',
      label: 'Queue',
      code: 'QUEUE',
      icon: <Package size={15} />,
    },
    {
      id: 'array',
      label: 'Array',
      code: 'ARRAY',
      icon: <Grid size={15} />,
    },
    {
      id: 'linkedlist',
      label: 'Linked List',
      code: 'LINKED_LIST',
      icon: <Link2 size={15} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#05070B] text-[#EAF2FF] font-mono selection:bg-[#2563EB] selection:text-white">
      {/* Terminal Title Bar / Top Header */}
      <header className="sticky top-0 z-40 bg-[#0B1018] border-b border-[#1E3A5F]">
        {/* Upper Micro Bar: Terminal Window Decorators & Session Meta */}
        <div className="h-7 px-4 bg-[#05070B] border-b border-[#1E3A5F]/60 flex items-center justify-between text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-2">
            {/* Terminal Window Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A5F] border border-[#2563EB]/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A5F] border border-[#3B82F6]/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#102A1E] border border-[#22C55E]/60 inline-block" />
            </div>
            <span className="text-[#3B82F6] font-bold select-none">&gt;_</span>
            <span className="text-white font-bold tracking-wider">DSA_COMPUTING_PLATFORM</span>
            <span className="text-[#94A3B8] hidden sm:inline">// v2.5.0-term</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="hidden md:inline-flex items-center gap-1 text-[#94A3B8]">
              <Cpu size={11} className="text-[#3B82F6]" />
              <span>TTY: /dev/pts/0</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#102A1E] text-[#22C55E] border border-[#22C55E]/40 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
        </div>

        {/* Main Header & Nav Tabs */}
        <div className="h-12 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-[#15243D] border border-[#1E3A5F]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Brand Title */}
            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="px-2 py-1 rounded bg-[#0D1626] border border-[#1E3A5F] group-hover:border-[#3B82F6] text-[#3B82F6] font-bold text-xs transition-colors flex items-center gap-1.5">
                <span className="text-[#22C55E]">$</span>
                <span className="text-white">dsa-term</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Terminal Style) */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {navItems.map((item, idx) => {
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-colors border ${
                    isActive
                      ? 'bg-[#15243D] text-white border-[#3B82F6] shadow-sm font-bold'
                      : 'text-[#94A3B8] border-transparent hover:text-[#EAF2FF] hover:bg-[#0D1626] hover:border-[#1E3A5F]'
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-[#22C55E]' : 'text-[#3B82F6]'}`}>
                    [{idx}]
                  </span>
                  <span>{item.code}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1018] border-b border-[#1E3A5F] p-3 space-y-1 text-xs">
          {navItems.map((item, idx) => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded border ${
                  isActive
                    ? 'bg-[#15243D] text-white border-[#3B82F6] font-bold'
                    : 'text-[#94A3B8] border-[#1E3A5F]/40 hover:text-[#EAF2FF] hover:bg-[#0D1626]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#3B82F6]">[{idx}]</span>
                  <span>{item.code}</span>
                </div>
                {item.icon}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Terminal Workspace Footer Status Bar */}
      <footer className="h-7 bg-[#0B1018] border-t border-[#1E3A5F] px-4 flex items-center justify-between text-[11px] text-[#94A3B8] select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#3B82F6]">
            <Activity size={12} />
            <span className="text-white">WORKSPACE_ACTIVE:</span>
            <span className="text-[#22C55E] uppercase">{currentModule}</span>
          </span>
          <span className="hidden sm:inline text-[#1E3A5F]">|</span>
          <span className="hidden sm:inline">MEMORY: ALLOCATED</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[#94A3B8]">THEME: BLACK_BLUE_GREEN</span>
          <span className="text-[#1E3A5F]">|</span>
          <span className="text-[#22C55E]">POINTER_ENGINE: OK</span>
        </div>
      </footer>
    </div>
  );
};
