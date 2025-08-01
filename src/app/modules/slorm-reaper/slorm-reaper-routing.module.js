"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormReaperRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const list_component_1 = require("./components/list/list.component");
const routes = [
    { path: 'list', component: list_component_1.ListComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'list' }
];
let SlormReaperRoutingModule = class SlormReaperRoutingModule {
};
SlormReaperRoutingModule = __decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
    })
], SlormReaperRoutingModule);
exports.SlormReaperRoutingModule = SlormReaperRoutingModule;
//# sourceMappingURL=slorm-reaper-routing.module.js.map