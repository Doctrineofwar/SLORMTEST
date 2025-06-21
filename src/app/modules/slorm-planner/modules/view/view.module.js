"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewModule = void 0;
const overlay_1 = require("@angular/cdk/overlay");
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const view_character_component_1 = require("./component/view-character/view-character.component");
const view_routing_module_1 = require("./view-routing.module");
const view_component_1 = require("./view.component");
let ViewModule = class ViewModule {
};
ViewModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            view_component_1.ViewComponent,
            view_character_component_1.ViewCharacterComponent
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            view_routing_module_1.ViewRoutingModule,
            overlay_1.OverlayModule,
        ],
        providers: [],
    })
], ViewModule);
exports.ViewModule = ViewModule;
//# sourceMappingURL=view.module.js.map