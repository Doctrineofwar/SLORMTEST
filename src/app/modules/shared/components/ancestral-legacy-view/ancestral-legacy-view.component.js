"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncestralLegacyViewComponent = void 0;
const core_1 = require("@angular/core");
let AncestralLegacyViewComponent = class AncestralLegacyViewComponent {
    constructor(slormancerTranslateService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.ancestralLegacy = null;
        this.hideNextRank = false;
        this.NEXT_RANK_LABEL = this.slormancerTranslateService.translate('tt_next_rank');
        this.MAX_RANK_LABEL = this.slormancerTranslateService.translate('tt_max_rank');
    }
};
__decorate([
    (0, core_1.Input)()
], AncestralLegacyViewComponent.prototype, "ancestralLegacy", void 0);
__decorate([
    (0, core_1.Input)()
], AncestralLegacyViewComponent.prototype, "hideNextRank", void 0);
AncestralLegacyViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-ancestral-legacy-view',
        templateUrl: './ancestral-legacy-view.component.html',
        styleUrls: ['./ancestral-legacy-view.component.scss']
    })
], AncestralLegacyViewComponent);
exports.AncestralLegacyViewComponent = AncestralLegacyViewComponent;
//# sourceMappingURL=ancestral-legacy-view.component.js.map