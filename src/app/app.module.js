"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const animations_1 = require("@angular/platform-browser/animations");
const app_routing_module_1 = require("./app-routing.module");
const app_component_1 = require("./app.component");
const slorm_tools_component_1 = require("./core/components/slorm-tools/slorm-tools.component");
const material_module_1 = require("./modules/shared/material.module");
const slorm_api_module_1 = require("./modules/slorm-api/slorm-api.module");
const error_handler_1 = require("./modules/slorm-planner/handler/error-handler");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            app_component_1.AppComponent,
            slorm_tools_component_1.SlormToolsComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            slorm_api_module_1.SlormApiModule,
            app_routing_module_1.AppRoutingModule,
            material_module_1.MaterialModule,
            http_1.HttpClientModule,
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: [
            { provide: core_1.ErrorHandler, useClass: error_handler_1.BuildErrorHandler }
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map