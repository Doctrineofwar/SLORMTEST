"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendarySidenavComponent = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("@shared/constants");
const environment_1 = require("../../../../../environments/environment");
let LegendarySidenavComponent = class LegendarySidenavComponent {
    constructor() {
        this.SHORTCUTS = [
            { link: '/slorm-planner', icon: 'assets/img/character/icon/1/head.png', label: 'Slorm planner' },
            { link: '/slorm-reaper', icon: 'assets/img/reaper/0/0.png', label: 'Slorm reapers' },
        ];
        this.VERSION = environment_1.environment.version;
        this.GITHUB_PROJECT_LINK = constants_1.GITHUB_PROJECT_LINK;
        this.GAME_LINK = constants_1.GAME_LINK;
    }
};
LegendarySidenavComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-legendary-sidenav',
        templateUrl: './legendary-sidenav.component.html',
        styleUrls: ['./legendary-sidenav.component.scss']
    })
], LegendarySidenavComponent);
exports.LegendarySidenavComponent = LegendarySidenavComponent;
//# sourceMappingURL=legendary-sidenav.component.js.map