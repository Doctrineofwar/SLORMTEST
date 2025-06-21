import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdamProgression } from '../interfaces/ancestral-legacy.interface';

@Injectable({
  providedIn: 'root'
})
export class AdamProgressionService {
  
  private adamProgressionSubject = new BehaviorSubject<AdamProgression>({
    bossesDefeated: [],
    itemsDeliveredToAdam: [],
    adamDefeated: false,
    availableNodes: 6 // Default: 6 nodes available before Adam
  });

  adamProgression$ = this.adamProgressionSubject.asObservable();

  updateProgression(progression: Partial<AdamProgression>): void {
    const current = this.adamProgressionSubject.value;
    const updated = { ...current, ...progression };
    
    // Calculate available nodes based on progression
    updated.availableNodes = this.calculateAvailableNodes(updated);
    
    this.adamProgressionSubject.next(updated);
  }

  private calculateAvailableNodes(progression: AdamProgression): number {
    let nodes = 6; // Base 6 nodes
    
    if (progression.adamDefeated) {
      nodes = 7; // 7th node available after defeating Adam
    }
    
    return nodes;
  }

  defeatBoss(bossName: string): void {
    const current = this.adamProgressionSubject.value;
    if (!current.bossesDefeated.includes(bossName)) {
      this.updateProgression({
        bossesDefeated: [...current.bossesDefeated, bossName]
      });
    }
  }

  deliverItemToAdam(itemName: string): void {
    const current = this.adamProgressionSubject.value;
    if (!current.itemsDeliveredToAdam.includes(itemName)) {
      this.updateProgression({
        itemsDeliveredToAdam: [...current.itemsDeliveredToAdam, itemName]
      });
    }
  }

  defeatAdam(): void {
    this.updateProgression({
      adamDefeated: true
    });
  }

  reset(): void {
    this.adamProgressionSubject.next({
      bossesDefeated: [],
      itemsDeliveredToAdam: [],
      adamDefeated: false,
      availableNodes: 6
    });
  }
}