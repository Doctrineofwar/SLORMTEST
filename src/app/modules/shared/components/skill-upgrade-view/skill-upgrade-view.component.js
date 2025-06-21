"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillUpgradeViewComponent = void 0;
const core_1 = require("@angular/core");
let SkillUpgradeViewComponent = class SkillUpgradeViewComponent {
    constructor(slormancerTranslateService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.upgrade = null;
        this.mouseOverElement = null;
        this.RANK_LABEL = this.slormancerTranslateService.translate('tt_rank');
        this.MASTERY_LABEL = this.slormancerTranslateService.translate('tt_mastery');
    }
    getTypeLabel(type) {
        return this.slormancerTranslateService.translate('tt_' + type);
    }
    showMechanicOverlay(mechanic) {
        this.mouseOverElement = mechanic;
    }
    hideMechanicOverlay() {
        this.mouseOverElement = null;
    }
};
__decorate([
    (0, core_1.Input)()
], SkillUpgradeViewComponent.prototype, "upgrade", void 0);
SkillUpgradeViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-skill-upgrade-view',
        templateUrl: './skill-upgrade-view.component.html',
        styleUrls: ['./skill-upgrade-view.component.scss']
    })
], SkillUpgradeViewComponent);
exports.SkillUpgradeViewComponent = SkillUpgradeViewComponent;
//# sourceMappingURL=skill-upgrade-view.component.js.map