"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerUltimatumService = void 0;
const core_1 = require("@angular/core");
const data_ultimatum_1 = require("../../constants/content/data/data-ultimatum");
const utils_1 = require("../../util/utils");
let SlormancerUltimatumService = class SlormancerUltimatumService {
    constructor(slormancerTranslateService, slormancerTemplateService, slormancerEffectValueService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.LEVEL_LABEL = this.slormancerTranslateService.translate('level');
        this.BONUS_TITLE_LABEL = this.slormancerTranslateService.translate('ultimatum_bonus');
        this.MALUS_TITLE_LABEL = this.slormancerTranslateService.translate('ultimatum_malus');
    }
    getUltimatumClone(ultimatum) {
        return {
            ...ultimatum,
            value: this.slormancerEffectValueService.getEffectValueClone(ultimatum.value)
        };
    }
    getUltimatum(type, baseLevel, bonusLevel) {
        const value = data_ultimatum_1.DATA_ULTIMATUM[type].value();
        const result = {
            type,
            baseLevel,
            bonusLevel,
            level: 0,
            icon: 'ultimatum/' + type,
            locked: false,
            value,
            title: this.slormancerTranslateService.translate('ultimatum_' + type),
            levelLabel: '',
            bonusTitle: this.BONUS_TITLE_LABEL,
            bonusLabel: '',
            bonusLabelTemplate: this.slormancerTemplateService.prepareUltimatumTemplate(this.slormancerTranslateService.translate('ultimatum_tt'), value.stat),
            malusTitle: this.MALUS_TITLE_LABEL,
            malusLabel: [
                this.slormancerTemplateService.prepareUltimatumTemplate(this.slormancerTranslateService.translate('ultimatum_tt_help'), value.stat),
                data_ultimatum_1.DATA_ULTIMATUM[type].extendedMalus
                    ? this.slormancerTemplateService.prepareUltimatumTemplate(this.slormancerTranslateService.translate('ultimatum_tt_help_ext'), value.stat)
                    : null
            ].filter(utils_1.isNotNullOrUndefined).join('<br/><br/>'),
            levelIcon: '',
        };
        this.updateUltimatumModel(result, baseLevel, bonusLevel);
        this.updateUltimatumView(result);
        return result;
    }
    updateUltimatumModel(ultimatum, baseLevel, bonusLevel) {
        ultimatum.baseLevel = baseLevel;
        ultimatum.bonusLevel = bonusLevel;
        ultimatum.level = ultimatum.baseLevel + ultimatum.bonusLevel;
        this.slormancerEffectValueService.updateEffectValue(ultimatum.value, ultimatum.level);
    }
    updateUltimatumView(ultimatum) {
        ultimatum.levelLabel = this.LEVEL_LABEL + ' ' + ultimatum.level;
        ultimatum.levelIcon = 'level/' + Math.min(15, ultimatum.level);
        ultimatum.bonusLabel = this.slormancerTemplateService.formatUltimatumTemplate(ultimatum.bonusLabelTemplate, ultimatum.value);
    }
};
SlormancerUltimatumService = __decorate([
    (0, core_1.Injectable)()
], SlormancerUltimatumService);
exports.SlormancerUltimatumService = SlormancerUltimatumService;
//# sourceMappingURL=slormancer-ultimatum.service.js.map