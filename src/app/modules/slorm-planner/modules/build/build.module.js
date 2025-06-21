"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildModule = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const build_routing_module_1 = require("./build-routing.module");
const build_component_1 = require("./build.component");
const ancestral_legacies_component_1 = require("./component/ancestral-legacies/ancestral-legacies.component");
const ancestral_legacy_map_component_1 = require("./component/ancestral-legacies/components/ancestral-legacy-map/ancestral-legacy-map.component");
const attributes_component_1 = require("./component/attributes/attributes.component");
const build_header_component_1 = require("./component/build-header/build-header.component");
const build_sidenav_component_1 = require("./component/build-sidenav/build-sidenav.component");
const compare_component_1 = require("./component/compare/compare.component");
const config_entry_component_1 = require("./component/config/components/config-entry/config-entry.component");
const config_component_1 = require("./component/config/config.component");
const inventory_component_1 = require("./component/inventory/inventory.component");
const settings_skills_component_1 = require("./component/skills/components/settings-skills/settings-skills.component");
const skills_component_1 = require("./component/skills/skills.component");
const stats_component_1 = require("./component/stats/stats.component");
let BuildModule = class BuildModule {
};
BuildModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            skills_component_1.SkillsComponent,
            ancestral_legacies_component_1.AncestralLegaciesComponent,
            inventory_component_1.InventoryComponent,
            build_component_1.BuildComponent,
            build_header_component_1.BuildHeaderComponent,
            settings_skills_component_1.SettingsSkillsComponent,
            ancestral_legacy_map_component_1.AncestralLegacyMapComponent,
            attributes_component_1.AttributesComponent,
            build_sidenav_component_1.BuildSidenavComponent,
            stats_component_1.StatsComponent,
            config_component_1.ConfigComponent,
            config_entry_component_1.ConfigEntryComponent,
            compare_component_1.CompareComponent,
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            build_routing_module_1.BuildRoutingModule,
        ]
    })
], BuildModule);
exports.BuildModule = BuildModule;
//# sourceMappingURL=build.module.js.map