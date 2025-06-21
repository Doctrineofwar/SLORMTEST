"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateModule = void 0;
const overlay_1 = require("@angular/cdk/overlay");
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const shared_module_1 = require("@shared/shared.module");
const create_first_build_component_1 = require("./component/create-first-build/create-first-build.component");
const create_routing_module_1 = require("./create-routing.module");
const create_component_1 = require("./create.component");
let CreateModule = class CreateModule {
};
CreateModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            create_component_1.CreateComponent,
            create_first_build_component_1.CreateFirstBuildComponent,
        ],
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            create_routing_module_1.CreateRoutingModule,
            overlay_1.OverlayModule,
        ],
        providers: [],
    })
], CreateModule);
exports.CreateModule = CreateModule;
//# sourceMappingURL=create.module.js.map