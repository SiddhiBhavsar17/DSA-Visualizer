import React from 'react';
import { Layers, Package, Grid, Link2, ArrowRight, Terminal } from 'lucide-react';
import { ActiveModule } from '../../types/dsa';

interface HomeDashboardProps {
  onNavigate: (module: ActiveModule) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const cards = [
    {
      id: 'stack' as ActiveModule,
      title: 'STACK',
      subtitle: 'Last In, First Out (LIFO)',
      description: 'Push, pop, and peek elements from a vertical memory rail with overflow and underflow bounds.',
      icon: <Layers size={20} className="text-[#3B82F6]" />,
      command: '$ mount --type=stack',
      badge: 'LIFO_BUFFER',
    },
    {
      id: 'queue' as ActiveModule,
      title: 'QUEUE',
      subtitle: 'First In, First Out (FIFO)',
      description: 'Enqueue elements at the rear and dequeue from the front along a sequential queue rail.',
      icon: <Package size={20} className="text-[#3B82F6]" />,
      command: '$ mount --type=queue',
      badge: 'FIFO_BUFFER',
    },
    {
      id: 'array' as ActiveModule,
      title: 'ARRAY',
      subtitle: 'Fixed-Capacity Contiguous Storage',
      description: 'Inspect contiguous memory indices, observe bounds, and append elements into available slots.',
      icon: <Grid size={20} className="text-[#3B82F6]" />,
      command: '$ mount --type=array',
      badge: 'CONTIGUOUS_MEM',
    },
    {
      id: 'linkedlist' as ActiveModule,
      title: 'LINKED_LIST',
      subtitle: 'Singly, Doubly & Circular Chains',
      description: 'Dynamic memory nodes with permanent HEAD and TAIL pointers, real-time in-place pointer mutations.',
      icon: <Link2 size={20} className="text-[#3B82F6]" />,
      command: '$ mount --type=linkedlist',
      badge: '3_SUBTYPES_ACTIVE',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-mono">
      {/* Terminal Workspace Header */}
      <div className="terminal-panel p-6 bg-[#0B1018] border border-[#1E3A5F] rounded-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] border-b border-[#1E3A5F] pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#3B82F6]" />
            <span className="text-white font-bold">SESSION: DSA_WORKSPACE // INITIALIZED</span>
          </div>
          <span className="text-[#22C55E] flex items-center gap-1 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> READY
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#2563EB]">&gt;</span> DSA COMPUTING PLATFORM
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Interactive data structure computing environment. Select a memory structure to mount and inspect:
          </p>
        </div>
      </div>

      {/* Terminal Data Structure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="terminal-panel p-5 bg-[#0D1626] border border-[#1E3A5F] rounded-lg hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/15 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-[#0B1018] border border-[#1E3A5F] group-hover:border-[#3B82F6] text-[#3B82F6] transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
                      <span>[{idx + 1}]</span>
                      <span>{card.title}</span>
                    </h2>
                    <div className="text-[11px] text-[#94A3B8] font-medium">
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] px-2 py-0.5 rounded bg-[#0B1018] text-[#3B82F6] border border-[#1E3A5F] font-bold">
                  {card.badge}
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-[#3B82F6]">
              <span className="text-[11px] text-[#94A3B8] group-hover:text-white transition-colors">
                {card.command}
              </span>
              <span className="flex items-center gap-1 font-bold group-hover:text-white group-hover:translate-x-1 transition-all">
                <span>MOUNT</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
