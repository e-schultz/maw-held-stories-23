
import React from 'react';
import { Button } from '@/components/ui/button';
import { Persona, PERSONA_CONFIGS } from '@/types/outliner';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  compact?: boolean;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  currentPersona,
  onPersonaChange,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex gap-1">
        {Object.entries(PERSONA_CONFIGS).map(([key, config]) => (
          <Button
            key={key}
            size="sm"
            variant={currentPersona === key ? "default" : "outline"}
            className={`w-8 h-8 p-0 ${config.color} ${
              currentPersona === key ? config.bgColor : ''
            }`}
            onClick={() => onPersonaChange(key as Persona)}
            title={config.description}
          >
            {config.name[0].toUpperCase()}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-terminal-fg">Active Persona</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(PERSONA_CONFIGS).map(([key, config]) => (
          <Button
            key={key}
            size="sm"
            variant={currentPersona === key ? "default" : "outline"}
            className={`${config.color} ${
              currentPersona === key ? config.bgColor : ''
            } text-xs flex flex-col h-auto py-2`}
            onClick={() => onPersonaChange(key as Persona)}
          >
            <span className="font-bold">{config.name}</span>
            <span className="text-xs opacity-70 hidden md:block">
              {config.description.split(' - ')[1]}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
