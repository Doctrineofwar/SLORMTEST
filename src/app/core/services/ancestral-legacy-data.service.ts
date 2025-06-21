import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AncestralLegacyNode, AncestralLegacyType } from '../interfaces/ancestral-legacy.interface';

@Injectable({
  providedIn: 'root'
})
export class AncestralLegacyDataService {
  
  private mockNodes: AncestralLegacyNode[] = [
    {
      id: 1,
      name: 'Ancestral Knowledge',
      description: 'Increases experience gained from all sources',
      type: AncestralLegacyType.UTILITY,
      position: { x: 0, y: -100 },
      isInnerRing: false,
      effects: [
        { type: 'experience_bonus', value: 15, description: '+15% Experience gained' }
      ]
    },
    {
      id: 2,
      name: 'Ancestral Might',
      description: 'Increases damage dealt by all sources',
      type: AncestralLegacyType.OFFENSIVE,
      position: { x: 100, y: -50 },
      isInnerRing: false,
      effects: [
        { type: 'damage_bonus', value: 10, description: '+10% All damage' }
      ]
    },
    {
      id: 3,
      name: 'Ancestral Resilience',
      description: 'Increases health and resistances',
      type: AncestralLegacyType.DEFENSIVE,
      position: { x: 100, y: 50 },
      isInnerRing: false,
      effects: [
        { type: 'health_bonus', value: 20, description: '+20% Maximum Health' }
      ]
    },
    {
      id: 4,
      name: 'Ancestral Mastery',
      description: 'Increases skill effectiveness',
      type: AncestralLegacyType.UTILITY,
      position: { x: 0, y: 100 },
      isInnerRing: false,
      effects: [
        { type: 'skill_bonus', value: 12, description: '+12% Skill effectiveness' }
      ]
    },
    {
      id: 5,
      name: 'Ancestral Fury',
      description: 'Increases critical strike chance and damage',
      type: AncestralLegacyType.OFFENSIVE,
      position: { x: -100, y: 50 },
      isInnerRing: false,
      effects: [
        { type: 'critical_chance', value: 8, description: '+8% Critical strike chance' },
        { type: 'critical_damage', value: 25, description: '+25% Critical strike damage' }
      ]
    },
    {
      id: 6,
      name: 'Ancestral Wisdom',
      description: 'Increases mana and mana regeneration',
      type: AncestralLegacyType.UTILITY,
      position: { x: -100, y: -50 },
      isInnerRing: false,
      effects: [
        { type: 'mana_bonus', value: 30, description: '+30% Maximum Mana' },
        { type: 'mana_regen', value: 50, description: '+50% Mana regeneration' }
      ]
    },
    {
      id: 7,
      name: 'Adam\'s Legacy',
      description: 'The ultimate ancestral power unlocked by defeating Adam',
      type: AncestralLegacyType.OFFENSIVE,
      position: { x: 0, y: 0 },
      isInnerRing: true,
      effects: [
        { type: 'all_damage', value: 25, description: '+25% All damage' },
        { type: 'experience_bonus', value: 50, description: '+50% Experience gained' }
      ],
      requirements: [
        { type: 'adam', value: 'defeated' }
      ]
    }
  ];

  getAllNodes(): Observable<AncestralLegacyNode[]> {
    return of(this.mockNodes);
  }

  getNodeById(id: number): Observable<AncestralLegacyNode | undefined> {
    return of(this.mockNodes.find(node => node.id === id));
  }

  getAvailableNodes(adamProgression: any): Observable<AncestralLegacyNode[]> {
    // Filter nodes based on Adam progression
    const availableNodes = this.mockNodes.filter(node => {
      if (node.requirements) {
        return node.requirements.every(req => {
          if (req.type === 'adam' && req.value === 'defeated') {
            return adamProgression.adamDefeated;
          }
          return true;
        });
      }
      return true;
    });
    
    return of(availableNodes);
  }
}