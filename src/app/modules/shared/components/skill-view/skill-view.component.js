"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillViewComponent = void 0;
const core_1 = require("@angular/core");
let SkillViewComponent = class SkillViewComponent {
    constructor() {
        this.skill = null;
    }
};
__decorate([
    (0, core_1.Input)()
], SkillViewComponent.prototype, "skill", void 0);
SkillViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-skill-view',
        templateUrl: './skill-view.component.html',
        styleUrls: ['./skill-view.component.scss']
    })
], SkillViewComponent);
exports.SkillViewComponent = SkillViewComponent;
//# sourceMappingURL=skill-view.component.js.map