"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormReaperModule = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const list_component_1 = require("./components/list/list.component");
const reaper_list_component_1 = require("./components/reaper-list/reaper-list.component");
const reaper_sidenav_component_1 = require("./components/reaper-sidenav/reaper-sidenav.component");
const slorm_reaper_routing_module_1 = require("./slorm-reaper-routing.module");
let SlormReaperModule = class SlormReaperModule {
};
SlormReaperModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            reaper_list_component_1.ReaperListComponent,
            list_component_1.ListComponent,
            reaper_sidenav_component_1.ReaperSidenavComponent
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            slorm_reaper_routing_module_1.SlormReaperRoutingModule
        ]
    })
], SlormReaperModule);
exports.SlormReaperModule = SlormReaperModule;
//# sourceMappingURL=slorm-reaper.module.js.map