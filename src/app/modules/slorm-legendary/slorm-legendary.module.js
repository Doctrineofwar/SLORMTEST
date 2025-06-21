"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormLegendaryModule = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const legendary_list_component_1 = require("./components/legendary-list/legendary-list.component");
const legendary_sidenav_component_1 = require("./components/legendary-sidenav/legendary-sidenav.component");
const list_component_1 = require("./components/list/list.component");
const slorm_legendary_routing_module_1 = require("./slorm-legendary-routing.module");
let SlormLegendaryModule = class SlormLegendaryModule {
};
SlormLegendaryModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            legendary_list_component_1.LegendaryListComponent,
            list_component_1.ListComponent,
            legendary_sidenav_component_1.LegendarySidenavComponent
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            slorm_legendary_routing_module_1.SlormLegendaryRoutingModule
        ]
    })
], SlormLegendaryModule);
exports.SlormLegendaryModule = SlormLegendaryModule;
//# sourceMappingURL=slorm-legendary.module.js.map