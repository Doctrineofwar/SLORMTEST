"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncestralLegaciesComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
let AncestralLegaciesComponent = class AncestralLegaciesComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerAncestralLegacyService, slormancerTranslateService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerAncestralLegacyService = slormancerAncestralLegacyService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.ANCESTRAL_LEGACY_POINTS = (0, _slorm_api_1.list)(_slorm_api_1.MAXIMUM_ANCESTRAL_LEGACY_POINTS);
        this.character = null;
        this.selectedAncestralLegacy = null;
        this.MIGHT_MESSAGE = this.slormancerTranslateService.translate('bonus_elemental_damage');
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => {
            this.character = layer === null ? null : layer.character;
            this.selectDefaultAncestralLegacy();
        });
    }
    selectDefaultAncestralLegacy() {
        this.selectedAncestralLegacy = null;
        if (this.character !== null) {
            if (this.character.ancestralLegacies.activeAncestralLegacies.length > 0) {
                const first = (0, _slorm_api_1.valueOrNull)(this.character.ancestralLegacies.activeAncestralLegacies[0]);
                this.selectedAncestralLegacy = first === null ? null : (0, _slorm_api_1.valueOrNull)(this.character.ancestralLegacies.ancestralLegacies[first]);
            }
            if (this.selectedAncestralLegacy === null) {
                this.selectedAncestralLegacy = (0, _slorm_api_1.valueOrNull)(this.character.ancestralLegacies.ancestralLegacies[0]);
            }
        }
    }
    optimizeAncestralLegacies() {
        if (this.character !== null) {
            for (const ancestralLegacy of this.character.ancestralLegacies.ancestralLegacies) {
                ancestralLegacy.baseRank = ancestralLegacy.baseMaxRank;
                this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy, ancestralLegacy.baseMaxRank, ancestralLegacy.bonusRank, ancestralLegacy.forcedRank);
                this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
            }
            this.buildStorageService.saveLayer();
        }
    }
    isStoneUsed(index) {
        const usedStones = this.character === null ? 0 : this.character.ancestralLegacies.activeNodes.length;
        return _slorm_api_1.MAXIMUM_ANCESTRAL_LEGACY_POINTS - index <= usedStones;
    }
    isAncestralStoneUsed() {
        return this.character !== null && this.character.ancestralLegacies.activeFirstNode !== null;
    }
};
AncestralLegaciesComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-ancestral-legacies',
        templateUrl: './ancestral-legacies.component.html',
        styleUrls: ['./ancestral-legacies.component.scss']
    })
], AncestralLegaciesComponent);
exports.AncestralLegaciesComponent = AncestralLegaciesComponent;
//# sourceMappingURL=ancestral-legacies.component.js.map