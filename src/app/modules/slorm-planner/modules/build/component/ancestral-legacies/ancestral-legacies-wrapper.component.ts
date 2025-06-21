import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FeatureFlagsService } from '../../../../../../core/services/feature-flags.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ancestral-legacies-wrapper',
  template: `
    <div class="ancestral-legacies-container">
      <!-- Feature Flag Toggle (DEV ONLY - remove in production) -->
      <div class="dev-controls" *ngIf="showDevControls">
        <button (click)="toggleNewComponent()" 
                [class.active]="useNewComponent$ | async"
                class="toggle-btn">
          {{ (useNewComponent$ | async) ? 'Revert to Original' : 'Use New Component' }}
        </button>
      </div>

      <!-- Original Component -->
      <app-ancestral-legacies 
        *ngIf="!(useNewComponent$ | async)"
        [build]="build"
        (buildChange)="onBuildChange($event)">
      </app-ancestral-legacies>

      <!-- New Enhanced Component -->
      <app-ancestral-legacy-tree 
        *ngIf="useNewComponent$ | async"
        [build]="enhancedBuild"
        (buildChange)="onEnhancedBuildChange($event)">
      </app-ancestral-legacy-tree>
    </div>
  `,
  styles: [`
    .dev-controls {
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
      border-left: 4px solid #2196F3;
    }
    .toggle-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #e0e0e0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .toggle-btn.active {
      background: #4CAF50;
      color: white;
    }
    .toggle-btn:hover {
      background: #d0d0d0;
    }
    .toggle-btn.active:hover {
      background: #45a049;
    }
  `]
})
export class AncestralLegaciesWrapperComponent implements OnInit {
  @Input() build: any; // Original build format
  @Output() buildChange = new EventEmitter<any>();

  useNewComponent$: Observable<boolean>;
  enhancedBuild: any; // Enhanced build format
  showDevControls = true; // Set to false in production

  constructor(private featureFlags: FeatureFlagsService) {
    this.useNewComponent$ = this.featureFlags.flags$.pipe(
      map(flags => flags.useNewAncestralLegacyComponent)
    );
  }

  ngOnInit(): void {
    // Convert build format if needed
    this.enhancedBuild = this.convertToEnhancedFormat(this.build);
  }

  toggleNewComponent(): void {
    const currentValue = this.featureFlags.getFlag('useNewAncestralLegacyComponent');
    if (currentValue) {
      this.featureFlags.revertToOriginal();
    } else {
      this.featureFlags.enableNewSystem();
    }
  }

  onBuildChange(build: any): void {
    this.buildChange.emit(build);
  }

  onEnhancedBuildChange(enhancedBuild: any): void {
    // Convert back to original format for compatibility
    const originalFormat = this.convertToOriginalFormat(enhancedBuild);
    this.buildChange.emit(originalFormat);
  }

  private convertToEnhancedFormat(originalBuild: any): any {
    // Convert original build to our enhanced format
    return {
      activeNodes: originalBuild?.ancestralLegacies || [],
      adamProgression: {
        bossesDefeated: [],
        itemsDeliveredToAdam: [],
        adamDefeated: false,
        availableNodes: 6 // Default
      },
      validationState: {
        isValid: true,
        errors: [],
        warnings: []
      }
    };
  }

  private convertToOriginalFormat(enhancedBuild: any): any {
    // Convert our enhanced build back to original format
    return {
      ...this.build,
      ancestralLegacies: enhancedBuild.activeNodes
    };
  }
}