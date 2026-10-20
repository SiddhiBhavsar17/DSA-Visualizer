import React, { useState } from 'react';
import { Copy, Check, Code2, BookOpen, Layers } from 'lucide-react';
import { CodeSnippets, DSAFullImplementation } from '../../data/dsaCodeRepository';

export type { CodeSnippets };

interface CodeComplexityPanelProps {
  operationName: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityNote?: string;
  codeSnippets: CodeSnippets;
  fullImplementation?: DSAFullImplementation;
}

export const CodeComplexityPanel: React.FC<CodeComplexityPanelProps> = ({
  operationName,
  timeComplexity,
  spaceComplexity,
  complexityNote,
  codeSnippets,
  fullImplementation,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');
  const [viewMode, setViewMode] = useState<'full' | 'operation'>('full');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSnippet =
    viewMode === 'full' && fullImplementation
      ? fullImplementation.fullCode[selectedLanguage]
      : codeSnippets[selectedLanguage];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-panel p-4 bg-[#0D1626] border border-[#1E3A5F] rounded-lg space-y-4">
      {/* Top Header with Implementation Mode & Language Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E3A5F]">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-[#3B82F6]" />
          <div>
            <span className="font-mono text-xs font-bold text-[#EAF2FF] uppercase tracking-wider block">
              {viewMode === 'full' && fullImplementation
                ? fullImplementation.title
                : `${operationName} — Implementation`}
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              {viewMode === 'full' && fullImplementation
                ? 'Complete, compilable data structure class with driver demo'
                : 'Focused algorithm method for the active operation'}
            </span>
          </div>
        </div>

        {/* View Mode Toggle & Language Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {fullImplementation && (
            <div className="flex items-center bg-[#05070B] p-0.5 rounded border border-[#1E3A5F] text-xs font-mono">
              <button
                onClick={() => setViewMode('full')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-colors ${
                  viewMode === 'full'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
                title="View complete, compilable class code"
              >
                <BookOpen size={13} />
                <span>Full Class</span>
              </button>
              <button
                onClick={() => setViewMode('operation')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-colors ${
                  viewMode === 'operation'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#EAF2FF]'
                }`}
                title="View focused method code"
              >
                <Layers size={13} />
                <span>Operation</span>
              </button>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#0B1018] p-1 rounded border border-[#1E3A5F]">
            <button
              onClick={() => setSelectedLanguage('cpp')}
              className={`px-2 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                selectedLanguage === 'cpp'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:text-[#EAF2FF]'
              }`}
            >
              C++
            </button>
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`px-2 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                selectedLanguage === 'python'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:text-[#EAF2FF]'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLanguage('java')}
              className={`px-2 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                selectedLanguage === 'java'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:text-[#EAF2FF]'
              }`}
            >
              Java
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#15243D] ml-1 transition-colors"
              title="Copy code"
            >
              {copied ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative">
        <pre className="font-mono text-xs text-[#EAF2FF] overflow-x-auto p-4 rounded bg-[#05070B] border border-[#1E3A5F] leading-relaxed max-h-80 select-text">
          {activeSnippet}
        </pre>
        {copied && (
          <div className="absolute top-2 right-3 px-2 py-1 bg-[#102A1E] text-[#22C55E] border border-[#22C55E]/40 font-mono text-[10px] rounded font-bold">
            Copied to clipboard!
          </div>
        )}
      </div>

      {/* Complexity Breakdown Section */}
      <div className="pt-2 border-t border-[#1E3A5F]/70">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-[#0B1018] border border-[#1E3A5F] flex items-center justify-between">
            <span className="text-[#94A3B8]">Time Complexity:</span>
            <span className="text-[#22C55E] font-bold text-sm">{timeComplexity}</span>
          </div>
          <div className="p-2.5 rounded bg-[#0B1018] border border-[#1E3A5F] flex items-center justify-between">
            <span className="text-[#94A3B8]">Auxiliary Space:</span>
            <span className="text-[#3B82F6] font-bold text-sm">{spaceComplexity}</span>
          </div>
        </div>
        {complexityNote && (
          <p className="text-[11px] font-mono text-[#94A3B8] mt-2 italic">
            * {complexityNote}
          </p>
        )}
      </div>
    </div>
  );
};
