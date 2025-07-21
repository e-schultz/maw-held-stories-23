
import { OutlinerNode } from '@/types/outliner';

const STORAGE_KEY = 'float_outliner_data';

export interface StorageData {
  nodes: OutlinerNode[];
  lastModified: string;
  version: string;
}

class StorageService {
  private data: StorageData = {
    nodes: [],
    lastModified: new Date().toISOString(),
    version: '1.0.0'
  };

  async load(): Promise<OutlinerNode[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StorageData;
        this.data = parsed;
        
        // Convert timestamp strings back to Date objects
        this.data.nodes = this.data.nodes.map(node => ({
          ...node,
          timestamp: new Date(node.timestamp),
          updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
          executionContext: node.executionContext ? {
            ...node.executionContext,
            timestamp: new Date(node.executionContext.timestamp)
          } : undefined
        }));
        
        return this.data.nodes;
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
    return [];
  }

  async save(nodes: OutlinerNode[]): Promise<void> {
    try {
      this.data = {
        nodes,
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };
      
      // Atomic write using localStorage
      const serialized = JSON.stringify(this.data);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save data to storage:', error);
      throw error;
    }
  }

  async backup(): Promise<string> {
    return JSON.stringify(this.data, null, 2);
  }

  async restore(backup: string): Promise<void> {
    try {
      const parsed = JSON.parse(backup) as StorageData;
      await this.save(parsed.nodes);
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      throw error;
    }
  }

  async export(): Promise<Blob> {
    const backup = await this.backup();
    return new Blob([backup], { type: 'application/json' });
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.data = {
      nodes: [],
      lastModified: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

export const storageService = new StorageService();
