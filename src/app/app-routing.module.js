"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const slorm_tools_component_1 = require("./core/components/slorm-tools/slorm-tools.component");
const appRoutes = [
    {
        path: 'beta/:path',
        redirectTo: ':path'
    },
    {
        path: 'slorm-planner',
        loadChildren: () => Promise.resolve().then(() => __importStar(require('./modules/slorm-planner/slorm-planner.module'))).then((m) => m.SlormPlannerModule),
        data: { title: 'Slorm-Planner' }
    },
    {
        path: 'slorm-reaper',
        loadChildren: () => Promise.resolve().then(() => __importStar(require('./modules/slorm-reaper/slorm-reaper.module'))).then((m) => m.SlormReaperModule),
        data: { title: 'Slorm-Reaper' }
    },
    {
        path: 'slorm-legendary',
        loadChildren: () => Promise.resolve().then(() => __importStar(require('./modules/slorm-legendary/slorm-legendary.module'))).then((m) => m.SlormLegendaryModule),
        data: { title: 'Slorm-Legendary' }
    },
    {
        path: '',
        component: slorm_tools_component_1.SlormToolsComponent,
        data: { title: 'Slorm-Tools' }
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/'
    }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forRoot(appRoutes)],
        exports: [router_1.RouterModule],
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map