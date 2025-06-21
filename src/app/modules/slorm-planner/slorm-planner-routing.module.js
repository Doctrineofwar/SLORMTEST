"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormPlannerRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const has_build_guard_1 = require("src/app/modules/slorm-planner/guard/has-build.guard");
const has_no_build_guard_1 = require("src/app/modules/slorm-planner/guard/has-no-build.guard");
const build_module_1 = require("./modules/build/build.module");
const create_module_1 = require("./modules/create/create.module");
const view_module_1 = require("./modules/view/view.module");
const routes = [
    { path: 'build', canActivate: [has_build_guard_1.HasBuildGuard], loadChildren: () => build_module_1.BuildModule },
    { path: 'view', loadChildren: () => view_module_1.ViewModule },
    { path: 'create', canActivate: [has_no_build_guard_1.HasNoBuildGuard], loadChildren: () => create_module_1.CreateModule },
    { path: '**', pathMatch: 'full', redirectTo: 'build' }
];
let SlormPlannerRoutingModule = class SlormPlannerRoutingModule {
};
SlormPlannerRoutingModule = __decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule],
        providers: [
            has_build_guard_1.HasBuildGuard,
            has_no_build_guard_1.HasNoBuildGuard
        ]
    })
], SlormPlannerRoutingModule);
exports.SlormPlannerRoutingModule = SlormPlannerRoutingModule;
//# sourceMappingURL=slorm-planner-routing.module.js.map