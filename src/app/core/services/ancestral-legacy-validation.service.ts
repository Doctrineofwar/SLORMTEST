import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AncestralLegacyBuild, ValidationState, ValidationError, ValidationWarning } from '../interfaces/ancestral-legacy.interface';

@Injectable({
  providedIn: 'root'
})
export class AncestralLegacyValidationService {
  
  validateBuild(build: AncestralLegacyBuild): Observable<ValidationState> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if too many nodes are selected
    if (build.activeNodes.length > build.adamProgression.availableNodes) {
      errors.push({
        message: `Too many nodes selected. Maximum allowed: ${build.adamProgression.availableNodes}`,
      });
    }

    // Check if Adam's legacy is selected without defeating Adam
    if (build.activeNodes.includes(7) && !build.adamProgression.adamDefeated) {
      errors.push({
        message: 'Adam\'s Legacy requires defeating Adam first',
        nodeId: 7
      });
    }

    // Warning for unoptimized builds
    if (build.activeNodes.length < build.adamProgression.availableNodes) {
      warnings.push({
        message: `You have ${build.adamProgression.availableNodes - build.activeNodes.length} unused node(s)`
      });
    }

    return of({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }
}