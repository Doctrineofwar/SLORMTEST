import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FeatureFlags {
    useNewAncestralLegacyComponent: boolean;
    enableAdamProgressionTracking: boolean;
    enableAdvancedValidation: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FeatureFlagsService {
    private defaultFlags: FeatureFlags = {
        useNewAncestralLegacyComponent: false, // Start with false for safety
        enableAdamProgressionTracking: false,
        enableAdvancedValidation: false
    };

    private flagsSubject = new BehaviorSubject<FeatureFlags>(this.defaultFlags);
    public flags$ = this.flagsSubject.asObservable();

    updateFlag(key: keyof FeatureFlags, value: boolean): void {
        const currentFlags = this.flagsSubject.value;
        this.flagsSubject.next({
            ...currentFlags,
            [key]: value
        });
    }

    getFlag(key: keyof FeatureFlags): boolean {
        return this.flagsSubject.value[key];
    }

    // Easy revert method
    revertToOriginal(): void {
        this.updateFlag('useNewAncestralLegacyComponent', false);
        this.updateFlag('enableAdamProgressionTracking', false);
        this.updateFlag('enableAdvancedValidation', false);
    }

    // Enable new system
    enableNewSystem(): void {
        this.updateFlag('useNewAncestralLegacyComponent', true);
        this.updateFlag('enableAdamProgressionTracking', true);
        this.updateFlag('enableAdvancedValidation', true);
    }
}