import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Existing components
import { LegendaryListComponent } from './components/legendary-list/legendary-list.component';
import { LegendarySidenavComponent } from './components/legendary-sidenav/legendary-sidenav.component';
import { ListComponent } from './components/list/list.component';

// New component with correct import path
import { AncestralLegacyTreeComponent } from './components/ancestral-legacy-tree/ancestral-legacy-tree.component';

@NgModule({
  declarations: [
    // Existing components
    LegendaryListComponent,
    LegendarySidenavComponent,
    ListComponent,
    // New component
    AncestralLegacyTreeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Use SharedModule which includes all Material modules
    SharedModule
  ],
  exports: [
    LegendaryListComponent,
    LegendarySidenavComponent,
    ListComponent,
    AncestralLegacyTreeComponent
  ]
})
export class SlormLegendaryModule { }