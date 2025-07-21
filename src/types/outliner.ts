
export type Persona = 'lf1m' | 'sysop' | 'karen' | 'qtb' | 'evna';

export type NodeType = 'log' | 'ctx' | 'repl' | 'output' | 'insight' | 'squirrel' | 'ritual' | 'narrative';

export type VisibilityLevel = 'private' | 'team' | 'public';

export interface ExecutionContext {
  code: string;
  output: string;
  error?: string;
  timing: number;
  timestamp: Date;
}

export interface NodeMetadata {
  tags: string[];
  visibility: VisibilityLevel;
  ritualMarkers?: string[];
  connections?: string[]; // IDs of related nodes
  soundtrack?: string; // URL for qtb's performance mode
}

export interface OutlinerNode {
  id: string;
  content: string;
  timestamp: Date;
  updatedAt?: Date;
  indent: number;
  parentId?: string;
  type: NodeType;
  persona: Persona;
  executionContext?: ExecutionContext;
  metadata: NodeMetadata;
  contextScope?: Record<string, any>; // Inherited context variables
}

export interface PersonaConfig {
  name: string;
  color: string;
  bgColor: string;
  description: string;
  defaultType: NodeType;
  templates: string[];
}

export const PERSONA_CONFIGS: Record<Persona, PersonaConfig> = {
  lf1m: {
    name: 'lf1m',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    description: 'Little fucker - Chaos navigator, ADHD patterns',
    defaultType: 'log',
    templates: ['squirrel:: ', 'realization:: ', 'connection:: ']
  },
  sysop: {
    name: 'sysop',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    description: 'System operator - Infrastructure, debugging',
    defaultType: 'ctx',
    templates: ['ctx:: ', 'repl:: ', 'debug:: ']
  },
  karen: {
    name: 'karen',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Professional boundaries, team handoffs',
    defaultType: 'ctx',
    templates: ['decision:: ', 'handoff:: ', 'boundary:: ']
  },
  qtb: {
    name: 'qtb',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    description: 'Queer techno bard - Rituals, narratives',
    defaultType: 'ritual',
    templates: ['ritual:: ', 'narrative:: ', 'soundtrack:: ']
  },
  evna: {
    name: 'evna',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    description: 'Flow states, temporal patterns, rhythms',
    defaultType: 'narrative',
    templates: ['pattern:: ', 'rhythm:: ', 'insight:: ']
  }
};
