
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Upload, Download, Settings } from 'lucide-react';
import { OutlinerNode, Persona, NodeType, PERSONA_CONFIGS } from '@/types/outliner';
import { PersonaSelector } from './PersonaSelector';
import { REPLEngine } from './REPLEngine';
import { storageService } from '@/services/storage';

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
        setEntries(nodes);
      } catch (error) {
        console.error('Failed to load data:', error);
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
  const parseEntryInput = (input: string, persona: Persona) => {
    const trimmed = input.trim();
    const typeMatch = trimmed.match(/^(\w+)::\s*(.*)/s);
    
    if (typeMatch) {
      const type = typeMatch[1] as NodeType;
      return {
        type: ['ctx', 'repl', 'insight', 'squirrel', 'ritual', 'narrative'].includes(type) ? type : 'log',
        content: typeMatch[2] || trimmed
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
