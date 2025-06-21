"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const build_component_1 = require("./build.component");
const ancestral_legacies_component_1 = require("./component/ancestral-legacies/ancestral-legacies.component");
const attributes_component_1 = require("./component/attributes/attributes.component");
const compare_component_1 = require("./component/compare/compare.component");
const config_component_1 = require("./component/config/config.component");
const inventory_component_1 = require("./component/inventory/inventory.component");
const skills_component_1 = require("./component/skills/skills.component");
const stats_component_1 = require("./component/stats/stats.component");
const routes = [
    {
        path: '',
        component: build_component_1.BuildComponent,
        children: [
            { path: 'inventory', component: inventory_component_1.InventoryComponent },
            { path: 'skills', component: skills_component_1.SkillsComponent },
            { path: 'ancestral-legacies', component: ancestral_legacies_component_1.AncestralLegaciesComponent },
            { path: 'attributes', component: attributes_component_1.AttributesComponent },
            { path: 'stats', component: stats_component_1.StatsComponent },
            { path: 'config', component: config_component_1.ConfigComponent },
            { path: 'compare', component: compare_component_1.CompareComponent },
            { path: '**', redirectTo: 'inventory' }
        ]
    }
];
let BuildRoutingModule = class BuildRoutingModule {
};
BuildRoutingModule = __decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
    })
], BuildRoutingModule);
exports.BuildRoutingModule = BuildRoutingModule;
//# sourceMappingURL=build-routing.module.js.map