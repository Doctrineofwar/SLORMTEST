"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormApiModule = void 0;
const core_1 = require("@angular/core");
const services_1 = require("./services");
const slormancer_activable_service_1 = require("./services/content/slormancer-activable.service");
const slormancer_affix_service_1 = require("./services/content/slormancer-affix.service");
const slormancer_ancestral_legacy_service_1 = require("./services/content/slormancer-ancestral-legacy.service");
const slormancer_attribute_service_1 = require("./services/content/slormancer-attribute.service");
const slormancer_buff_service_1 = require("./services/content/slormancer-buff.service");
const slormancer_class_mechanic_service_1 = require("./services/content/slormancer-class-mechanic.service");
const slormancer_data_service_1 = require("./services/content/slormancer-data.service");
const slormancer_effect_value_service_1 = require("./services/content/slormancer-effect-value.service");
const slormancer_item_value_service_1 = require("./services/content/slormancer-item-value.service");
const slormancer_item_service_1 = require("./services/content/slormancer-item.service");
const slormancer_legendary_effect_service_1 = require("./services/content/slormancer-legendary-effect.service");
const slormancer_mechanic_service_1 = require("./services/content/slormancer-mechanic.service");
const slormancer_merged_stat_updater_service_1 = require("./services/content/slormancer-merged-stat-updater.service");
const slormancer_reaper_value_service_1 = require("./services/content/slormancer-reaper-value.service");
const slormancer_reaper_service_1 = require("./services/content/slormancer-reaper.service");
const slormancer_rune_service_1 = require("./services/content/slormancer-rune.service");
const slormancer_skill_service_1 = require("./services/content/slormancer-skill.service");
const slormancer_stat_mapping_service_1 = require("./services/content/slormancer-stat-mapping.service");
const slormancer_stats_extractor_service_1 = require("./services/content/slormancer-stats-extractor.service");
const slormancer_stats_service_1 = require("./services/content/slormancer-stats.service");
const slormancer_synergy_resolver_service_1 = require("./services/content/slormancer-synergy-resolver.service");
const slormancer_template_service_1 = require("./services/content/slormancer-template.service");
const slormancer_translate_service_1 = require("./services/content/slormancer-translate.service");
const slormancer_ultimatum_service_1 = require("./services/content/slormancer-ultimatum.service");
const slormancer_value_updater_service_1 = require("./services/content/slormancer-value-updater.service");
const slormancer_item_parser_service_1 = require("./services/parser/slormancer-item-parser.service");
const slormancer_save_parser_service_1 = require("./services/parser/slormancer-save-parser.service");
const slormancer_binary_character_service_1 = require("./services/short-data/slormancer-binary-character.service");
const slormancer_binary_item_service_1 = require("./services/short-data/slormancer-binary-item.service");
const slormancer_binary_reaper_service_1 = require("./services/short-data/slormancer-binary-reaper.service");
const slormancer_binary_rune_service_1 = require("./services/short-data/slormancer-binary-rune.service");
const slormancer_binary_ultimatum_service_1 = require("./services/short-data/slormancer-binary-ultimatum.service");
const slormancer_compressor_service_1 = require("./services/short-data/slormancer-compressor.service");
const slormancer_short_data_service_1 = require("./services/short-data/slormancer-short-data.service");
const slormancer_character_builder_service_1 = require("./services/slormancer-character-builder.service");
const slormancer_character_comparator_service_1 = require("./services/slormancer-character-comparator.service");
const slormancer_character_modifier_service_1 = require("./services/slormancer-character-modifier.service");
const slormancer_character_updater_service_1 = require("./services/slormancer-character-updater.service");
const slormancer_dps_service_1 = require("./services/slormancer-dps.service");
let SlormApiModule = class SlormApiModule {
};
SlormApiModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [],
        imports: [],
        providers: [
            slormancer_legendary_effect_service_1.SlormancerLegendaryEffectService,
            slormancer_save_parser_service_1.SlormancerSaveParserService,
            slormancer_item_parser_service_1.SlormancerItemParserService,
            slormancer_item_value_service_1.SlormancerItemValueService,
            slormancer_data_service_1.SlormancerDataService,
            slormancer_item_service_1.SlormancerItemService,
            slormancer_template_service_1.SlormancerTemplateService,
            slormancer_activable_service_1.SlormancerActivableService,
            slormancer_skill_service_1.SlormancerSkillService,
            slormancer_reaper_service_1.SlormancerReaperService,
            slormancer_effect_value_service_1.SlormancerEffectValueService,
            slormancer_reaper_value_service_1.SlormancerReaperValueService,
            slormancer_mechanic_service_1.SlormancerMechanicService,
            slormancer_class_mechanic_service_1.SlormancerClassMechanicService,
            slormancer_buff_service_1.SlormancerBuffService,
            slormancer_ancestral_legacy_service_1.SlormancerAncestralLegacyService,
            slormancer_attribute_service_1.SlormancerAttributeService,
            slormancer_affix_service_1.SlormancerAffixService,
            slormancer_translate_service_1.SlormancerTranslateService,
            slormancer_character_updater_service_1.SlormancerCharacterUpdaterService,
            slormancer_stats_service_1.SlormancerStatsService,
            slormancer_stats_extractor_service_1.SlormancerStatsExtractorService,
            slormancer_character_updater_service_1.SlormancerCharacterUpdaterService,
            slormancer_character_builder_service_1.SlormancerCharacterBuilderService,
            slormancer_synergy_resolver_service_1.SlormancerSynergyResolverService,
            slormancer_merged_stat_updater_service_1.SlormancerMergedStatUpdaterService,
            slormancer_character_modifier_service_1.SlormancerCharacterModifierService,
            slormancer_value_updater_service_1.SlormancerValueUpdaterService,
            slormancer_stat_mapping_service_1.SlormancerStatMappingService,
            slormancer_dps_service_1.SlormancerDpsService,
            slormancer_character_comparator_service_1.SlormancerCharacterComparatorService,
            slormancer_ultimatum_service_1.SlormancerUltimatumService,
            slormancer_short_data_service_1.SlormancerShortDataService,
            slormancer_binary_character_service_1.SlormancerBinaryCharacterService,
            slormancer_compressor_service_1.SlormancerCompressorService,
            slormancer_binary_reaper_service_1.SlormancerBinaryReaperService,
            slormancer_binary_item_service_1.SlormancerBinaryItemService,
            slormancer_binary_ultimatum_service_1.SlormancerBinaryUltimatumService,
            slormancer_rune_service_1.SlormancerRuneService,
            slormancer_binary_rune_service_1.SlormancerBinaryRuneService,
            services_1.SlormancerAncestralLegacyNodesService,
            services_1.SlormancerBinaryConfigurationService,
            services_1.SlormancerMightService,
        ],
        bootstrap: []
    })
], SlormApiModule);
exports.SlormApiModule = SlormApiModule;
//# sourceMappingURL=slorm-api.module.js.map