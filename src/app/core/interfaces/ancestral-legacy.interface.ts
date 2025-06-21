export interface AncestralLegacyNode {
  id: number;
  name: string;
  description: string;
  type: AncestralLegacyType;
  position: { x: number; y: number };
  isInnerRing: boolean;
  effects: AncestralLegacyEffect[];
  requirements?: NodeRequirement[];
}

export interface AncestralLegacyEffect {
  type: string;
  value: number;
  description: string;
}

export interface NodeRequirement {
  type: 'boss' | 'item' | 'adam';
  value: string;
}

export interface AncestralLegacyBuild {
  activeNodes: number[];
  activeFirstNode?: number;
  adamProgression: AdamProgression;
  validationState: ValidationState;
}

export interface AdamProgression {
  bossesDefeated: string[];
  itemsDeliveredToAdam: string[];
  adamDefeated: boolean;
  availableNodes: number;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  message: string;
  nodeId?: number;
}

export interface ValidationWarning {
  message: string;
  nodeId?: number;
}

export enum AncestralLegacyType {
  OFFENSIVE = 'offensive',
  DEFENSIVE = 'defensive',
  UTILITY = 'utility'
}