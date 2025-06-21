"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerTranslateService = void 0;
const core_1 = require("@angular/core");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const parse_util_1 = require("../../util/parse.util");
const utils_1 = require("../../util/utils");
let SlormancerTranslateService = class SlormancerTranslateService {
    constructor(slormancerDataService) {
        this.slormancerDataService = slormancerDataService;
        this.REGEXP_REMOVE_GENRE = /(.*)\((MS|MP|FS|FP)\)$/g;
        this.REGEXP_KEEP_GENRE = /.*\((MS|MP|FS|FP)\)$/g;
        this.TRANSLATION_CACHE = {};
        this.TRANSLATION_KEY_MAPPING = {
            training_lance_additional_damage_add: 'physical_damage',
            wandering_arrow_damage: 'physical_damage',
            percent_missing_mana_base_100: 'percent_missing_mana',
            damage_taken_to_mana: 'damage',
            atk_arcanic: 'school_0',
            atk_temporal: 'school_1',
            atk_obliteration: 'school_2',
            chance_to_rebound_orb: 'chance_to_rebound',
            health_regen: 'health_regeneration',
            living_inferno_burn_increased_damage: 'increased_damage',
            enduring_blorms_blorm_increased_damage: 'increased_damage',
            electrify_increased_lightning_damage: 'increased_damage',
            elemental_damage_percent_per_active_aura: 'elemental_damage',
            shadow_imbued_skill_increased_damage: 'increased_damage',
            avatar_of_shadow_basic_damage_percent: 'basic_damage',
            avatar_of_shadow_elemental_damage_percent: 'elemental_damage',
            shadow_shield_armor_percent: 'armor',
            shadow_shield_elemental_resist_percent: 'elemental_resist',
            shadow_shield_health_leech_percent: 'health_leech_percent',
            shadow_bargain_cooldown_reduction_global_mult: 'cooldown_reduction_global_mult',
            flawless_defense_projectile_damage_reduction: 'reduced_on_projectile',
            crit_chance_percent_against_burning: 'crit_chance',
            frostfire_armor_res_phy_percent: 'armor',
            frostfire_armor_fire_resistance_percent: 'fire_resistance',
            frostfire_armor_ice_resistance_percent: 'ice_resistance',
            focus_mana_regen_percent: 'mana_regen_percent',
            mana_on_hit_ancestral_strike: 'mana_on_hit',
            elemental_resources_min_elemental_damage_add_on_low_mana: 'elemental_damage',
            aura_air_conditionner_enemy_cooldown_reduction_global_mult: 'attack_speed',
            aura_neriya_shield_res_mag_add: 'elemental_resist',
            raw_emergency_min_raw_damage_add_on_low_life: 'basic_damage',
            elemental_temper_buff_elemental_damage_percent: 'elemental_damage',
            aura_elemental_swap_elemental_damage_percent: 'elemental_damage',
            wild_slap_stun_chance: 'chance',
            aura_risk_of_pain_trigger_all_equipped_ancestral_strike_effect_on_hit_taken_chance: 'chance',
            increased_damage_per_negative_effect: 'increased_damage',
            elemental_spirit_stack_elemental_damage_percent: 'elemental_damage',
            aurelon_bargain_stack_increased_attack_speed: 'cooldown_reduction_global_mult',
            cleansing_surge_stack_movement_speed_percent: 'movement_speed',
            ancestral_instability_crit_damage_percent: 'crit_damage_percent',
            ancestral_instability_brut_damage_percent: 'brut_damage_percent',
            overcharged_stack_cooldown_reduction_global_mult: 'cooldown_reduction_global_mult',
            burning_shadow_buff_basic_damage_percent: 'basic_damage_percent',
            burning_shadow_buff_crit_damage_percent: 'crit_damage_percent',
            flashing_dart_additional_damage: 'additional_damage',
        };
    }
    getTextGenre(textWithGenre, genre) {
        let result = textWithGenre;
        const splitedData = (0, utils_1.splitData)(textWithGenre, '/');
        if (splitedData.length === 4) {
            if (genre === 'MS') {
                result = splitedData[0];
            }
            else if (genre === 'FS') {
                result = splitedData[1];
            }
            else if (genre === 'MP') {
                result = splitedData[2];
            }
            else {
                result = splitedData[3];
            }
        }
        return result;
    }
    splitTextAndGenre(text) {
        const genre = text.replace(this.REGEXP_KEEP_GENRE, '$1');
        return {
            text: this.removeGenre(text),
            genre: genre.length !== 2 ? 'MS' : genre
        };
    }
    removeGenre(text) {
        return text.replace(this.REGEXP_REMOVE_GENRE, '$1');
    }
    translate(key, genre = null) {
        key = key.startsWith('*') ? key.slice(1) : key;
        let result = key;
        const cache = (0, utils_1.valueOrNull)(this.TRANSLATION_CACHE[key]);
        if (cache !== null) {
            result = cache;
        }
        else {
            const replacment = this.TRANSLATION_KEY_MAPPING[key];
            if (replacment) {
                key = replacment;
            }
            const gameData = this.slormancerDataService.getTranslation(key);
            if (gameData !== null) {
                result = gameData.EN;
            }
            else if (key.startsWith('victims_reaper_')) {
                const reaper = this.slormancerDataService.getGameDataReaper((0, parse_util_1.strictParseInt)(key.substr(15)));
                if (reaper !== null) {
                    result = reaper.EN_NAME;
                }
            }
            else if (key === 'RAR_loot_defensive') {
                result = 'Defensive';
            }
            else if (key === 'RAR_loot_neither') {
                result = 'Neither';
            }
            this.TRANSLATION_CACHE[key] = result;
        }
        if (genre !== null) {
            result = this.getTextGenre(result, genre);
        }
        return result;
    }
    translateCostType(costType) {
        return this.translate(costType === skill_cost_type_1.SkillCostType.ManaLockFlat ? costType : ('tt_' + costType));
    }
};
SlormancerTranslateService = __decorate([
    (0, core_1.Injectable)()
], SlormancerTranslateService);
exports.SlormancerTranslateService = SlormancerTranslateService;
//# sourceMappingURL=slormancer-translate.service.js.map