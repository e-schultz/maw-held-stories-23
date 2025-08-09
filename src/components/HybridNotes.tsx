
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Upload, Download, Settings } from 'lucide-react';
import { OutlinerNode, Persona, NodeType, PERSONA_CONFIGS } from '@/types/outliner';
import { PersonaSelector } from './PersonaSelector';
import { REPLEngine } from './REPLEngine';
import { storageService } from '@/services/storage';

// Demo content parser for floatAST format
const createDemoContent = (): OutlinerNode[] => {
  const now = new Date();
  const nodes: OutlinerNode[] = [];

  // Root context entry
  nodes.push({
    id: 'demo-root',
    content: 'ctx:: FLOAT Outliner Demo - Consulting Evolution Synthesis',
    indent: 0,
    timestamp: now,
    persona: 'sysop',
    type: 'ctx',
    metadata: {
      tags: ['demo', 'consulting', 'evolution'],
      visibility: 'public',
      ritualMarkers: ['strategic_paradigm_shift']
    }
  });

  // Knowledge asymmetry collapse - qtb persona
  nodes.push({
    id: 'demo-knowledge-death',
    content: 'ctx:: The priesthood of Angular and React has lost its power',
    indent: 1,
    timestamp: new Date(now.getTime() + 1000),
    persona: 'qtb',
    type: 'ctx',
    metadata: {
      tags: ['epistemological_collapse', 'influence'],
      visibility: 'public'
    }
  });

  nodes.push({
    id: 'demo-nick-quote',
    content: 'insight:: "there\'s no path to influence anymore because we can\'t leverage that unique sort of being the priesthood" - nick',
    indent: 2,
    timestamp: new Date(now.getTime() + 2000),
    persona: 'qtb',
    type: 'insight',
    metadata: {
      tags: ['revolutionary_potential'],
      visibility: 'public'
    }
  });

  // Antic-driven development - lf1m persona
  nodes.push({
    id: 'demo-antics',
    content: 'ctx:: Antic-driven development framework',
    indent: 1,
    timestamp: new Date(now.getTime() + 3000),
    persona: 'lf1m',
    type: 'ctx',
    metadata: {
      tags: ['methodological_resistance', 'antics'],
      visibility: 'public'
    }
  });

  nodes.push({
    id: 'demo-antics-def',
    content: 'squirrel:: antics + schematics = playful infrastructure (etymology matters!)',
    indent: 2,
    timestamp: new Date(now.getTime() + 4000),
    persona: 'lf1m',
    type: 'squirrel',
    metadata: {
      tags: ['naming_as_resistance'],
      visibility: 'public'
    }
  });

  nodes.push({
    id: 'demo-job-stories',
    content: 'ctx:: Structure: job story → shippable antic → refactor every 4 antics → 16 total',
    indent: 2,
    timestamp: new Date(now.getTime() + 5000),
    persona: 'lf1m',
    type: 'ctx',
    metadata: {
      tags: ['workflow', 'structure'],
      visibility: 'public'
    }
  });

  // Personal SaaS model - karen persona
  nodes.push({
    id: 'demo-personal-saas',
    content: 'ctx:: Software as a Service for One - business model heresy',
    indent: 1,
    timestamp: new Date(now.getTime() + 6000),
    persona: 'karen',
    type: 'ctx',
    metadata: {
      tags: ['business_model_heresy', 'personal_saas'],
      visibility: 'public'
    }
  });

  nodes.push({
    id: 'demo-economics',
    content: 'repl:: # Calculate Personal SaaS Economics\nrate = 200  # $/hr for agentic engineers\ndevs = 2\nweeks = 4\nhours_per_week = 40\nsupport_months = 12\n\ntotal_dev_cost = rate * devs * weeks * hours_per_week\nprint(f"Development cost: ${total_dev_cost:,}")\nprint(f"With {support_months} month support: Revolutionary model")',
    indent: 2,
    timestamp: new Date(now.getTime() + 7000),
    persona: 'karen',
    type: 'repl',
    executionContext: {
      code: 'rate = 200\ndevs = 2\nweeks = 4\nhours_per_week = 40\nsupport_months = 12\n\ntotal_dev_cost = rate * devs * weeks * hours_per_week\nprint(f"Development cost: ${total_dev_cost:,}")\nprint(f"With {support_months} month support: Revolutionary model")',
      output: 'Development cost: $64,000\nWith 12 month support: Revolutionary model',
      timing: 45,
      timestamp: new Date(now.getTime() + 7500)
    },
    metadata: {
      tags: ['economics', 'validation'],
      visibility: 'team'
    }
  });

  // RLS debugging nightmare - sysop persona
  nodes.push({
    id: 'demo-rls-hell',
    content: 'ctx:: RLS Technical Theology - debugging as epistemology',
    indent: 1,
    timestamp: new Date(now.getTime() + 8000),
    persona: 'sysop',
    type: 'ctx',
    metadata: {
      tags: ['debugging', 'rls', 'supabase'],
      visibility: 'team'
    }
  });

  nodes.push({
    id: 'demo-rls-surface',
    content: 'ctx:: Surface error: "Row Level Security permission denied"',
    indent: 2,
    timestamp: new Date(now.getTime() + 9000),
    persona: 'sysop',
    type: 'ctx',
    metadata: {
      tags: ['surface_symptom'],
      visibility: 'team'
    }
  });

  nodes.push({
    id: 'demo-rls-truth',
    content: 'insight:: Deeper truth: auth.uid() returns NULL in SSR context → Frontend fallback creates string IDs instead of UUIDs → Type validation failures masquerading as permission errors',
    indent: 2,
    timestamp: new Date(now.getTime() + 10000),
    persona: 'sysop',
    type: 'insight',
    metadata: {
      tags: ['architectural_truth', 'debugging_revelation'],
      visibility: 'team'
    }
  });

  nodes.push({
    id: 'demo-bodies-found',
    content: 'ctx:: Hours invested: 30, Bodies found: 33 🪦',
    indent: 2,
    timestamp: new Date(now.getTime() + 11000),
    persona: 'sysop',
    type: 'ctx',
    metadata: {
      tags: ['debugging_archaeology'],
      visibility: 'team'
    }
  });

  // Evergreen onboarding - evna persona
  nodes.push({
    id: 'demo-onboarding',
    content: 'ritual:: Evergreen Onboarding Kata',
    indent: 1,
    timestamp: new Date(now.getTime() + 12000),
    persona: 'evna',
    type: 'ritual',
    metadata: {
      tags: ['knowledge_transmission', 'onboarding'],
      visibility: 'public',
      ritualMarkers: ['capability_building']
    }
  });

  nodes.push({
    id: 'demo-brooks-ref',
    content: 'insight:: Fred Brooks - programming as theory building. Tacit knowledge made explicit through practice.',
    indent: 2,
    timestamp: new Date(now.getTime() + 13000),
    persona: 'evna',
    type: 'insight',
    metadata: {
      tags: ['theory_building', 'tacit_knowledge'],
      visibility: 'public'
    }
  });

  // Multi-LLM orchestration
  nodes.push({
    id: 'demo-llm-orchestra',
    content: 'ctx:: Multi-LLM Orchestration - consciousness technology praxis',
    indent: 1,
    timestamp: new Date(now.getTime() + 14000),
    persona: 'qtb',
    type: 'ctx',
    metadata: {
      tags: ['consciousness_technology', 'llm_orchestration'],
      visibility: 'public'
    }
  });

  nodes.push({
    id: 'demo-llm-pattern',
    content: 'insight:: Pattern: Gemini temporal → Claude analytical. Live meeting context prevents info dumps.',
    indent: 2,
    timestamp: new Date(now.getTime() + 15000),
    persona: 'qtb',
    type: 'insight',
    metadata: {
      tags: ['real_time_strategic_thinking'],
      visibility: 'public'
    }
  });

  // Final synthesis
  nodes.push({
    id: 'demo-synthesis',
    content: 'insight:: Death of knowledge superiority → Birth of systematic delivery speed + agentic maintenance. Recipes over recommendations.',
    indent: 1,
    timestamp: new Date(now.getTime() + 16000),
    persona: 'karen',
    type: 'insight',
    metadata: {
      tags: ['paradigm_shift', 'competitive_advantage'],
      visibility: 'public'
    }
  });

  return nodes;
};

interface HybridNotesProps {}

export const HybridNotes: React.FC<HybridNotesProps> = () => {
  const [entries, setEntries] = useState<OutlinerNode[]>([]);
  const [mode, setMode] = useState<'chat' | 'edit'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [currentIndent, setCurrentIndent] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>('sysop');
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const nodes = await storageService.load();
        if (nodes.length === 0) {
          // Load demo content if no data exists
          const demoNodes = createDemoContent();
          setEntries(demoNodes);
          await storageService.save(demoNodes);
        } else {
          setEntries(nodes);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to demo content on error
        const demoNodes = createDemoContent();
        setEntries(demoNodes);
      }
    };
    loadData();
  }, []);

  // Save data when entries change
  useEffect(() => {
    if (entries.length > 0) {
      storageService.save(entries).catch(error => {
        console.error('Failed to save data:', error);
      });
    }
  }, [entries]);

  // Auto-focus input on mount and mode switch
  useEffect(() => {
    if (mode === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  // Calculate indent level for new entry
  const getInsertIndent = useCallback(() => {
    if (!selectedEntryId) return 0;
    
    const selectedEntry = entries.find(e => e.id === selectedEntryId);
    return selectedEntry ? selectedEntry.indent : 0;
  }, [selectedEntryId, entries]);

  // Generate unique ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Parse entry type and content based on persona and input
  const parseEntryInput = (input: string, persona: Persona): { type: NodeType; content: string } => {
    const trimmed = input.trim();
    const typeMatch = trimmed.match(/^(\w+)::\s*(.*)/s);
    
    if (typeMatch) {
      const keyword = typeMatch[1];
      const rest = typeMatch[2] || '';

      // Special transform: echoRefactor
      if (keyword === 'echoRefactor') {
        const cleaned = rest.trim().replace(/^\{?/, '').replace(/\}?$/, '');
        const titleLine = 'echoRefactor:: ' + (cleaned || 'untitled');
        const structured = [
          'float.dispatch({',
          '  content: {',
          '    # Echo Refactor: The Consciousness Technology Compiler',
          '',
          '    ## Core Function',
          "    **echoRefactor** is FLOAT's primary **transformative pattern for neurodivergent thought processing**:",
          '',
          '    Input: Raw brain dump → Output: Structured navigation',
          '    "Burp in neurodivergent and get structure back"',
          '',
          '    ## How It Works',
          '    - Accepts: Messy, non-linear, chaotic input (your actual thoughts)',
          '    - Returns: Navigable structure without losing essence (your thoughts, but organized)',
          "    - Honors: Neurodivergent processing rhythms (doesn\\'t force neurotypical patterns)",
          "    - Preserves: The [chaos:: energy] while building [structure:: scaffolding]",
          '',
          '    ## Example Pattern Flow',
          '    You: float.dispatch({' + cleaned + '})',
          '    System: → Searches for connections in dispatch_bay',
          '           → Structures your request into navigable format',
          '           → Echoes back organized understanding',
          '           → Maintains your original intent and voice',
          '',
          '    ## Key Principles from Dispatch History',
          '    - Chaos-to-order transformation while preserving cognitive patterns',
          '    - Sacred incompletion - resist premature closure',
          '    - Process over product - value the thinking, not just conclusions',
          '    - Productive tension between structure and chaos',
          '',
          '    ## Technical Implementation',
          '    - Neural pattern recognition of your specific cognitive rhythms',
          '    - Structure scaffolding that supports rather than constrains',
          '    - Fidelity preservation (99%+ information retention according to metrics)',
          '    - Token efficiency through intelligent content transformation',
          '  }',
          '})'
        ].join('\n');
        return {
          type: 'log',
          content: titleLine + '\n' + structured
        };
      }

      const type = keyword as NodeType;
      return {
        type: ['ctx', 'repl', 'insight', 'squirrel', 'ritual', 'narrative'].includes(type) ? type : 'log',
        content: rest || trimmed
      };
    }
    
    return {
      type: PERSONA_CONFIGS[persona].defaultType,
      content: trimmed
    };
  };
  // Add new entry
  const addEntry = useCallback(() => {
    if (!inputValue.trim()) return;

    const { type, content } = parseEntryInput(inputValue, currentPersona);

    const newEntry: OutlinerNode = {
      id: generateId(),
      content,
      timestamp: new Date(),
      indent: getInsertIndent(),
      parentId: selectedEntryId || undefined,
      type,
      persona: currentPersona,
      metadata: {
        tags: [],
        visibility: 'private',
        ritualMarkers: type === 'ritual' ? ['start'] : undefined
      }
    };

    setEntries(prev => {
      if (!selectedEntryId) {
        return [...prev, newEntry];
      }

      const selectedIndex = prev.findIndex(e => e.id === selectedEntryId);
      if (selectedIndex === -1) return [...prev, newEntry];

      const newEntries = [...prev];
      newEntries.splice(selectedIndex + 1, 0, newEntry);
      return newEntries;
    });

    setInputValue('');
    setSelectedEntryId(newEntry.id);
  }, [inputValue, selectedEntryId, getInsertIndent, currentPersona]);

  // Handle REPL execution
  const handleREPLExecution = useCallback((entryId: string, executionContext: any) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          executionContext,
          updatedAt: new Date()
        };
      }
      return entry;
    }));
  }, []);

  // Handle key navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl+E: Toggle mode
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      setMode(prev => prev === 'chat' ? 'edit' : 'chat');
      return;
    }

    // Ctrl+P: Toggle persona selector
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      setShowPersonaSelector(prev => !prev);
      return;
    }

    // Numbers 1-5: Quick persona switch
    if (e.ctrlKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
      e.preventDefault();
      const personas: Persona[] = ['lf1m', 'sysop', 'karen', 'qtb', 'evna'];
      const index = parseInt(e.key) - 1;
      if (personas[index]) {
        setCurrentPersona(personas[index]);
      }
      return;
    }

    // Only handle navigation in chat mode
    if (mode !== 'chat') return;

    // Enter: Add entry
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry();
      return;
    }

    // Escape: Clear selection
    if (e.key === 'Escape') {
      e.preventDefault();
      setSelectedEntryId(null);
      setCurrentIndent(0);
      return;
    }

    // Alt + Arrow navigation
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      if (entries.length === 0) return;

      const currentIndex = selectedEntryId 
        ? entries.findIndex(e => e.id === selectedEntryId)
        : -1;

      let newIndex;
      if (e.key === 'ArrowUp') {
        newIndex = currentIndex <= 0 ? entries.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex >= entries.length - 1 ? 0 : currentIndex + 1;
      }

      setSelectedEntryId(entries[newIndex]?.id || null);
      return;
    }

    // Tab: Indent (when entry is selected)
    if (e.key === 'Tab' && selectedEntryId) {
      e.preventDefault();
      const maxIndent = 6;
      
      setEntries(prev => prev.map(entry => {
        if (entry.id === selectedEntryId) {
          const newIndent = e.shiftKey 
            ? Math.max(0, entry.indent - 1)
            : Math.min(maxIndent, entry.indent + 1);
          return { ...entry, indent: newIndent, updatedAt: new Date() };
        }
        return entry;
      }));
      return;
    }
  }, [mode, addEntry, entries, selectedEntryId]);

  // Format entry content for display
  const formatEntryContent = (entry: OutlinerNode) => {
    const personaConfig = PERSONA_CONFIGS[entry.persona];
    const displayContent = showDetails && entry.type !== 'log' 
      ? `${entry.type}:: ${entry.content}`
      : entry.content;
      
    const lines = displayContent.split('\n');
    if (lines.length === 1) return displayContent;
    
    return (
      <div>
        <div className="font-medium">{lines[0]}</div>
        {lines.slice(1).map((line, idx) => (
          <div key={idx} className="ml-4 text-terminal-gray">
            {line}
          </div>
        ))}
      </div>
    );
  };

  // Get visual indicator for where next entry will be inserted
  const getInsertionIndicator = () => {
    if (!selectedEntryId) {
      return "Appending to bottom";
    }
    
    const selectedEntry = entries.find(e => e.id === selectedEntryId);
    if (!selectedEntry) return "Appending to bottom";
    
    const indent = selectedEntry.indent;
    const indentStr = "  ".repeat(indent);
    return `${indentStr}├─ Same level as selected entry`;
  };

  // Export data
  const handleExport = async () => {
    try {
      const blob = await storageService.export();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `float-outliner-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Load demo content
  const loadDemoContent = async () => {
    try {
      const demoNodes = createDemoContent();
      setEntries(demoNodes);
      await storageService.save(demoNodes);
    } catch (error) {
      console.error('Failed to load demo content:', error);
    }
  };

  return (
    <div className="h-screen bg-terminal-bg text-terminal-fg font-mono flex flex-col" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="border-b border-terminal-gray/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-terminal-green">FLOAT Outliner</h1>
            <p className="text-terminal-gray text-sm">
              Multi-persona hierarchical notes • REPL • Chaos navigation
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            <PersonaSelector 
              currentPersona={currentPersona}
              onPersonaChange={setCurrentPersona}
              compact
            />
            
            <Button
              variant={mode === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('chat')}
              className="bg-terminal-green hover:bg-terminal-green/80 text-black"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Log
            </Button>
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('edit')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={showDetails ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs"
            >
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-xs"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDemoContent}
              className="text-xs"
            >
              Demo
            </Button>
          </div>
        </div>

        {showPersonaSelector && (
          <div className="mt-4 p-4 border border-terminal-gray/20 rounded">
            <PersonaSelector 
              currentPersona={currentPersona}
              onPersonaChange={(persona) => {
                setCurrentPersona(persona);
                setShowPersonaSelector(false);
              }}
            />
          </div>
        )}
      </div>

      {mode === 'chat' && (
        <>
          {/* Chat Mode */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Terminal Window Header */}
            <div className="border-b border-terminal-gray/20 bg-terminal-bg/50">
              <div className="flex items-center gap-2 p-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-terminal-gray text-sm ml-2">float-outliner.md</span>
                <span className={`text-xs ml-4 ${PERSONA_CONFIGS[currentPersona].color}`}>
                  [{currentPersona}] {PERSONA_CONFIGS[currentPersona].description}
                </span>
              </div>
            </div>

            {/* Entries Display */}
            <div 
              ref={entriesRef}
              className="flex-1 p-4 overflow-y-auto"
            >
              {entries.length === 0 ? (
                <div className="text-terminal-gray">
                  <span className="text-terminal-green">➤</span> Start logging your thoughts...
                  <div className="mt-2 text-xs">
                    <div>Ctrl+P: Toggle persona selector</div>
                    <div>Ctrl+1-5: Quick persona switch</div>
                    <div>type:: content for custom entry types</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const personaConfig = PERSONA_CONFIGS[entry.persona];
                    return (
                      <div
                        key={entry.id}
                        className={`cursor-pointer transition-colors rounded p-2 ${
                          selectedEntryId === entry.id
                            ? 'bg-terminal-selection/20 border-l-2 border-terminal-selection'
                            : 'hover:bg-terminal-gray/10'
                        }`}
                        style={{ marginLeft: `${entry.indent * 20}px` }}
                        onClick={() => setSelectedEntryId(entry.id)}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`text-xs mt-1 ${personaConfig.color}`}>
                            {entry.persona}
                          </span>
                          <div className="flex-1">
                            <div className="text-terminal-fg">
                              {formatEntryContent(entry)}
                            </div>
                            <div className="flex items-center gap-2 text-terminal-gray text-xs mt-1">
                              <span>{entry.timestamp.toLocaleTimeString()}</span>
                              {entry.type !== 'log' && !showDetails && (
                                <span className="px-1.5 py-0.5 bg-terminal-gray/20 rounded text-xs">
                                  {entry.type}
                                </span>
                              )}
                              {entry.updatedAt && (
                                <span className="text-yellow-400">
                                  ↻ {entry.updatedAt.toLocaleTimeString()}
                                </span>
                              )}
                              {entry.type === 'repl' && (
                                <REPLEngine
                                  code={entry.content}
                                  onExecutionComplete={(context) => handleREPLExecution(entry.id, context)}
                                />
                              )}
                            </div>
                            {entry.executionContext && (
                              <div className="mt-2 p-2 bg-terminal-gray/10 rounded text-xs">
                                {entry.executionContext.error ? (
                                  <div className="text-red-400">
                                    Error: {entry.executionContext.error}
                                  </div>
                                ) : (
                                  <div className="text-green-400">
                                    {entry.executionContext.output}
                                  </div>
                                )}
                                <div className="text-terminal-gray mt-1">
                                  Executed in {entry.executionContext.timing.toFixed(1)}ms
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-terminal-gray/20 p-4">
              <div className="text-terminal-gray text-xs mb-2">
                {getInsertionIndicator()} • Alt+↑/↓ to select • Persona: {currentPersona}
              </div>
              
              <div className="flex items-end gap-2">
                <span className={`${PERSONA_CONFIGS[currentPersona].color}`}>
                  [{currentPersona}]
                </span>
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`${PERSONA_CONFIGS[currentPersona].templates[0] || 'log:: '}What's on your mind?`}
                    className="w-full bg-transparent border-none outline-none resize-none text-terminal-fg placeholder-terminal-gray"
                    rows={1}
                    style={{ 
                      minHeight: '24px',
                      maxHeight: '120px',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={addEntry}
                  disabled={!inputValue.trim()}
                  className="bg-terminal-green hover:bg-terminal-green/80 text-black"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {mode === 'edit' && (
        <>
          {/* Edit Mode */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Structured View</h3>
                
                {entries.length === 0 ? (
                  <p className="text-muted-foreground">No entries yet. Switch to Chat mode to start logging thoughts.</p>
                ) : (
                  <div className="space-y-3 font-mono text-sm">
                    {entries.map((entry) => {
                      const personaConfig = PERSONA_CONFIGS[entry.persona];
                      return (
                        <div
                          key={entry.id}
                          className="flex items-start gap-4"
                          style={{ marginLeft: `${entry.indent * 20}px` }}
                        >
                          <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                            <span className={personaConfig.color}>{entry.persona}</span>
                            <span>{entry.timestamp.toLocaleTimeString()}</span>
                            {entry.type !== 'log' && (
                              <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                {entry.type}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-foreground whitespace-pre-wrap">
                              {showDetails && entry.type !== 'log' ? `${entry.type}:: ${entry.content}` : entry.content}
                            </div>
                            {entry.executionContext && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {entry.executionContext.error ? (
                                  <span className="text-red-600">Error: {entry.executionContext.error}</span>
                                ) : (
                                  <span className="text-green-600">Output: {entry.executionContext.output}</span>
                                )}
                              </div>
                            )}
                            {entry.updatedAt && (
                              <div className="text-yellow-600 text-xs mt-1">
                                Updated: {entry.updatedAt.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
