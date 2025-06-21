import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SlormPlannerSharedModule } from '../../shared/slorm-planner-shared.module';

import { BuildRoutingModule } from './build-routing.module';
import { BuildHeaderComponent } from './component/build-header/build-header.component';
import { BuildSidenavComponent } from './component/build-sidenav/build-sidenav.component';
import { BuildComponent } from './component/build/build.component';
import { AncestralLegaciesComponent } from './component/ancestral-legacies/ancestral-legacies.component';
import { AncestralLegaciesWrapperComponent } from './component/ancestral-legacies/ancestral-legacies-wrapper.component';
import { AttributesComponent } from './component/attributes/attributes.component';
import { CompareComponent } from './component/compare/compare.component';
import { ConfigComponent } from './component/config/config.component';
import { InventoryComponent } from './component/inventory/inventory.component';
import { SkillsComponent } from './component/skills/skills.component';
import { StatsComponent } from './component/stats/stats.component';
import { SlormLegendaryModule } from '../../../slorm-legendary/slorm-legendary.module';

@NgModule({
  declarations: [
    BuildHeaderComponent,
    BuildSidenavComponent,
    BuildComponent,
    AncestralLegaciesComponent,
    AncestralLegaciesWrapperComponent,
    AttributesComponent,
    CompareComponent,
    ConfigComponent,
    InventoryComponent,
    SkillsComponent,
    StatsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SlormPlannerSharedModule,
    BuildRoutingModule,
    SlormLegendaryModule
  ]
})
export class BuildModule { }