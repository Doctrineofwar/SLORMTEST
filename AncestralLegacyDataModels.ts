
export interface AncestralLegacyNode {
  id: number;
  type: AncestralLegacyType;
  name: string;
  description: string;
  position: NodePosition;
  isInnerRing: boolean;
  connections: number[];
  effects: LegacyEffect[];
}

export interface NodePosition {
  x: number;
  y: number;
  ring: 'inner' | 'middle' | 'outer';
}

export interface LegacyEffect {
  type: string;
  value: number;
  condition?: string;
}

export interface AdamProgression {
  bossesDefeated: BossDefeatedRecord[];
  itemsDeliveredToAdam: BossItemDelivery[];
  adamDefeated: boolean;
  availableNodes: number; // 0-7
}

export interface BossDefeatedRecord {
  bossId: string;
  bossName: string;
  defeated: boolean;
  itemDropped: string;
}

export interface BossItemDelivery {
  itemId: string;
  itemName: string;
  fromBoss: string;
  deliveredToAdam: boolean;
  deliveryDate?: Date;
}

export interface AncestralLegacyBuild {
  activeNodes: number[];
  activeFirstNode?: number;
  adamProgression: AdamProgression;
  validationState: ValidationState;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  nodeId?: number;
  severity: 'error' | 'warning';
}

export interface ValidationWarning extends ValidationError {
  suggestion?: string;
}

export interface NodePlacementValidation {
  nodeId: number;
  valid: boolean;
  reason?: string;
  availableConnections?: number[];
}

export enum AncestralLegacyType {
  Aura = 'aura',
  Seal = 'seal',
  Active = 'active',
  Ancestral = 'ancestral',
  Imbue = 'imbue',
  Upgrade = 'upgrade',
  Stat = 'stat',
  Passive = 'passive',
  Elemental = 'elemental'
}