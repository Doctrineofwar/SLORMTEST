import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  AncestralLegacyNode, 
  AncestralLegacyBuild, 
  ValidationState,
  AdamProgression 
} from '../../../../core/interfaces/ancestral-legacy.interface';
import { AncestralLegacyValidationService } from '../../../../core/services/ancestral-legacy-validation.service';
import { AncestralLegacyDataService } from '../../../../core/services/ancestral-legacy-data.service';
import { AdamProgressionService } from '../../../../core/services/adam-progression.service';

@Component({
  selector: 'app-ancestral-legacy-tree',
  templateUrl: './ancestral-legacy-tree.component.html',
  styleUrls: ['./ancestral-legacy-tree.component.scss']
})
export class AncestralLegacyTreeComponent implements OnInit, OnDestroy {
  @Input() build: AncestralLegacyBuild = {
    activeNodes: [],
    adamProgression: {
      bossesDefeated: [],
      itemsDeliveredToAdam: [],
      adamDefeated: false,
      availableNodes: 0
    },
    validationState: {
      isValid: true,
      errors: [],
      warnings: []
    }
  };

  @Output() buildChange = new EventEmitter<AncestralLegacyBuild>();
  @Output() nodeSelected = new EventEmitter<number>();

  allNodes: AncestralLegacyNode[] = [];
  adamProgression: AdamProgression = {
    bossesDefeated: [],
    itemsDeliveredToAdam: [],
    adamDefeated: false,
    availableNodes: 0
  };
  validationState: ValidationState = {
    isValid: true,
    errors: [],
    warnings: []
  };

  selectedNode: AncestralLegacyNode | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private validationService: AncestralLegacyValidationService,
    private dataService: AncestralLegacyDataService,
    private adamService: AdamProgressionService
  ) {}

  ngOnInit(): void {
    this.loadNodes();
    this.subscribeToAdamProgression();
    this.validateCurrentBuild();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNodes(): void {
    this.dataService.getAllNodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: AncestralLegacyNode[]) => {
        this.allNodes = nodes;
      });
  }

  private subscribeToAdamProgression(): void {
    this.adamService.adamProgression$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progression: AdamProgression) => {
        this.adamProgression = progression;
        this.validateCurrentBuild();
      });
  }

  onNodeClick(nodeId: number): void {
    const node = this.allNodes.find(n => n.id === nodeId);
    if (node) {
      this.selectedNode = node;
      this.nodeSelected.emit(nodeId);
    }

    if (this.isNodeActive(nodeId)) {
      this.removeNode(nodeId);
    } else {
      this.addNode(nodeId);
    }
  }

  addNode(nodeId: number): void {
    if (this.canAddNode(nodeId)) {
      this.build.activeNodes.push(nodeId);
      this.updateFirstNode();
      this.emitBuildChange();
      this.validateCurrentBuild();
    }
  }

  removeNode(nodeId: number): void {
    const index = this.build.activeNodes.indexOf(nodeId);
    if (index > -1) {
      this.build.activeNodes.splice(index, 1);
      this.updateFirstNode();
      this.emitBuildChange();
      this.validateCurrentBuild();
    }
  }

  canAddNode(nodeId: number): boolean {
    if (this.isNodeActive(nodeId)) {
      return false;
    }

    if (this.build.activeNodes.length >= this.adamProgression.availableNodes) {
      return false;
    }

    return true;
  }

  isNodeActive(nodeId: number): boolean {
    return this.build.activeNodes.includes(nodeId);
  }

  getNodeClasses(node: AncestralLegacyNode): string[] {
    const classes = ['legacy-node', `type-${node.type}`];
    
    if (this.isNodeActive(node.id)) {
      classes.push('active');
    }
    
    if (node.isInnerRing) {
      classes.push('inner-ring');
    }
    
    if (!this.canAddNode(node.id) && !this.isNodeActive(node.id)) {
      classes.push('disabled');
    }

    return classes;
  }

  getNodeErrors(nodeId: number): string[] {
    return this.validationState.errors
      .filter((error: any) => error.nodeId === nodeId)
      .map((error: any) => error.message);
  }

  hasValidationErrors(): boolean {
    return !this.validationState.isValid;
  }

  getProgressionText(): string {
    const current = this.build.activeNodes.length;
    const available = this.adamProgression.availableNodes;
    return `${current}/${available} Ancestral Legacy Nodes`;
  }

  getAdamStatusText(): string {
    const itemsDelivered = this.adamProgression.itemsDeliveredToAdam.length;
    
    if (this.adamProgression.adamDefeated) {
      return 'Adam defeated - 7th node available';
    } else if (itemsDelivered >= 6) {
      return 'Adam can be challenged for 7th node';
    } else {
      return `${itemsDelivered}/6 items delivered to Adam`;
    }
  }

  getNodeById(nodeId: number): AncestralLegacyNode | undefined {
    return this.allNodes.find(n => n.id === nodeId);
  }

  private updateFirstNode(): void {
    this.build.activeFirstNode = this.build.activeNodes[0] || undefined;
  }

  private validateCurrentBuild(): void {
    this.validationService.validateBuild(this.build)
      .pipe(takeUntil(this.destroy$))
      .subscribe((validation: ValidationState) => {
        this.validationState = validation;
        this.build.validationState = validation;
      });
  }

  private emitBuildChange(): void {
    this.buildChange.emit({ ...this.build });
  }
}