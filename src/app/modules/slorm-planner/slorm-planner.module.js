"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormPlannerModule = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const build_module_1 = require("./modules/build/build.module");
const create_module_1 = require("./modules/create/create.module");
const view_module_1 = require("./modules/view/view.module");
const slorm_planner_routing_module_1 = require("./slorm-planner-routing.module");
let SlormPlannerModule = class SlormPlannerModule {
};
SlormPlannerModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            slorm_planner_routing_module_1.SlormPlannerRoutingModule,
            build_module_1.BuildModule,
            view_module_1.ViewModule,
            create_module_1.CreateModule
        ],
        providers: []
    })
], SlormPlannerModule);
exports.SlormPlannerModule = SlormPlannerModule;
//# sourceMappingURL=slorm-planner.module.js.map