"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const view_character_component_1 = require("./component/view-character/view-character.component");
const character_path_resolver_1 = require("./resolver/character-path.resolver");
const routes = [
    { path: 'build/:key', component: view_character_component_1.ViewCharacterComponent, resolve: { sharedData: character_path_resolver_1.CharacterPathResolver } }
];
let ViewRoutingModule = class ViewRoutingModule {
};
ViewRoutingModule = __decorate([
    (0, core_1.NgModule)({
        providers: [
            character_path_resolver_1.CharacterPathResolver
        ],
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
    })
], ViewRoutingModule);
exports.ViewRoutingModule = ViewRoutingModule;
//# sourceMappingURL=view-routing.module.js.map