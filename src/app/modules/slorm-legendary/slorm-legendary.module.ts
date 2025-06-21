import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AncestralLegacyTreeComponent } from './components/ancestral-legacy-tree.component';

@NgModule({
  declarations: [
    AncestralLegacyTreeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AncestralLegacyTreeComponent
  ]
})
export class SlormLegendaryModule { }