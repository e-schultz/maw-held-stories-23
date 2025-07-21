
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Loader2 } from 'lucide-react';
import { ExecutionContext } from '@/types/outliner';

interface REPLEngineProps {
  code: string;
  onExecutionComplete: (context: ExecutionContext) => void;
  disabled?: boolean;
}

export const REPLEngine: React.FC<REPLEngineProps> = ({
  code,
  onExecutionComplete,
  disabled = false
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState<ExecutionContext | null>(null);

  const executeCode = async () => {
    if (!code.trim() || isExecuting) return;
    
    setIsExecuting(true);
    const startTime = performance.now();
    
    try {
      // For now, we'll simulate Python execution
      // In Phase 1, this will be replaced with Pyodide integration
      const result = await simulatePythonExecution(code);
      const timing = performance.now() - startTime;
      
      const context: ExecutionContext = {
        code,
        output: result.output,
        error: result.error,
        timing,
        timestamp: new Date()
      };
      
      setLastExecution(context);
      onExecutionComplete(context);
    } catch (error) {
      const timing = performance.now() - startTime;
      const context: ExecutionContext = {
        code,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        timing,
        timestamp: new Date()
      };
      
      setLastExecution(context);
      onExecutionComplete(context);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Button
        size="sm"
        variant="outline"
        onClick={executeCode}
        disabled={disabled || isExecuting || !code.trim()}
        className="h-6 px-2"
      >
        {isExecuting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        {isExecuting ? 'Running...' : 'Execute'}
      </Button>
      
      {lastExecution && (
        <span className="text-terminal-gray">
          {lastExecution.timing.toFixed(1)}ms
          {lastExecution.error && (
            <span className="text-red-400 ml-2">Error</span>
          )}
        </span>
      )}
    </div>
  );
};

// Simulate Python execution for Phase 1
// This will be replaced with Pyodide in later phases
async function simulatePythonExecution(code: string): Promise<{output: string, error?: string}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple simulation based on code patterns
      if (code.includes('print(')) {
        const match = code.match(/print\(['"](.+?)['"]\)/);
        resolve({ output: match ? match[1] : 'Hello, World!' });
      } else if (code.includes('1/0') || code.includes('undefined') || code.includes('error')) {
        resolve({ output: '', error: 'ZeroDivisionError: division by zero' });
      } else if (code.includes('import')) {
        resolve({ output: '# Module imported successfully' });
      } else if (code.includes('=')) {
        const match = code.match(/(\w+)\s*=/);
        resolve({ output: match ? `# Variable '${match[1]}' assigned` : '# Assignment complete' });
      } else {
        resolve({ output: '# Code executed successfully' });
      }
    }, 100 + Math.random() * 500); // Simulate variable execution time
  });
}
