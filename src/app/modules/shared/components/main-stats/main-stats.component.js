"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainStatsComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let MainStatsComponent = class MainStatsComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(slormancerTranslateService) {
        super();
        this.slormancerTranslateService = slormancerTranslateService;
        this.stats = null;
        this.selectedMergedStat = null;
        this.selected = new core_1.EventEmitter();
        this.SECTIONS = [
            {
                section: this.slormancerTranslateService.translate('cat_adventure'),
                stats: [
                    { name: this.slormancerTranslateService.translate('essence_find'), stat: 'essence_find', sign: true },
                    { name: this.slormancerTranslateService.translate('xp_find'), stat: 'xp_find', sign: true },
                    { name: this.slormancerTranslateService.translate('influence_gain'), stat: 'influence_gain', sign: true },
                    { name: this.slormancerTranslateService.translate('mf_find'), stat: 'mf_find', sign: true },
                    { name: this.slormancerTranslateService.translate('mf_qual'), stat: 'mf_qual', sign: true }
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_health'),
                stats: [
                    { name: this.slormancerTranslateService.translate('max_health'), stat: 'max_health', sign: false },
                    { name: this.slormancerTranslateService.translate('health_regeneration'), stat: 'health_regeneration', sign: false },
                    { name: this.slormancerTranslateService.translate('health_leech_percent'), stat: 'health_leech_percent', sign: false },
                    { name: this.slormancerTranslateService.translate('life_on_hit'), stat: 'life_on_hit', sign: true },
                    { name: this.slormancerTranslateService.translate('life_on_kill'), stat: 'life_on_kill', sign: true }
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_mana'),
                stats: [
                    { name: this.slormancerTranslateService.translate('max_mana'), stat: 'max_mana', sign: false },
                    { name: this.slormancerTranslateService.translate('mana_regeneration'), stat: 'mana_regeneration', sign: false },
                    { name: this.slormancerTranslateService.translate('mana_leech_percent'), stat: 'mana_leech_percent', sign: false },
                    { name: this.slormancerTranslateService.translate('mana_on_hit'), stat: 'mana_on_hit', sign: true },
                    { name: this.slormancerTranslateService.translate('mana_on_kill'), stat: 'mana_on_kill', sign: true }
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_movement'),
                stats: [
                    { name: this.slormancerTranslateService.translate('movement_speed'), stat: 'movement_speed', sign: false }
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_attack'),
                stats: [
                    { name: this.slormancerTranslateService.translate('cooldown_reduction'), stat: 'cooldown_reduction', sign: false },
                    { name: this.slormancerTranslateService.translate('attack_speed'), stat: 'attack_speed', sign: false },
                    { name: this.slormancerTranslateService.translate('basic_damage'), stat: 'basic_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('weapon_damage'), stat: 'weapon_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('physical_damage'), stat: 'physical_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('elemental_damage'), stat: 'elemental_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('critical_chance'), stat: 'critical_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('critical_damage'), stat: 'critical_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('ancestral_chance'), stat: 'ancestral_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('ancestral_damage'), stat: 'ancestral_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('armor_penetration'), stat: 'armor_penetration', sign: false },
                    { name: this.slormancerTranslateService.translate('elemental_penetration'), stat: 'elemental_penetration', sign: false },
                    { name: this.slormancerTranslateService.translate('dot_increased_damage'), stat: 'dot_increased_damage', sign: true },
                    { name: this.slormancerTranslateService.translate('increased_on_elite'), stat: 'increased_on_elite', sign: false },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_defense'),
                stats: [
                    { name: this.slormancerTranslateService.translate('armor'), stat: 'armor', sign: false },
                    { name: this.slormancerTranslateService.translate('elemental_resist'), stat: 'elemental_resist', sign: false },
                    { name: this.slormancerTranslateService.translate('fire_resistance'), stat: 'fire_resistance', sign: false },
                    { name: this.slormancerTranslateService.translate('ice_resistance'), stat: 'ice_resistance', sign: false },
                    { name: this.slormancerTranslateService.translate('lightning_resistance'), stat: 'lightning_resistance', sign: false },
                    { name: this.slormancerTranslateService.translate('light_resistance'), stat: 'light_resistance', sign: false },
                    { name: this.slormancerTranslateService.translate('shadow_resistance'), stat: 'shadow_resistance', sign: false },
                    { name: this.slormancerTranslateService.translate('dodge'), stat: 'dodge', sign: false },
                    { name: this.slormancerTranslateService.translate('thorns'), stat: 'thorns', sign: false },
                    { name: this.slormancerTranslateService.translate('retaliate'), stat: 'retaliate', sign: false },
                    { name: this.slormancerTranslateService.translate('tenacity'), stat: 'tenacity', sign: false },
                    { name: this.slormancerTranslateService.translate('reduced_on_all'), stat: 'reduced_on_all', sign: false },
                    { name: this.slormancerTranslateService.translate('reduced_by_elite'), stat: 'reduced_by_elite', sign: false },
                    { name: this.slormancerTranslateService.translate('reduced_on_melee'), stat: 'reduced_on_melee', sign: false },
                    { name: this.slormancerTranslateService.translate('reduced_on_projectile'), stat: 'reduced_on_projectile', sign: false },
                    { name: this.slormancerTranslateService.translate('reduced_on_area'), stat: 'reduced_on_area', sign: false },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_secondary_resources'),
                stats: [
                    { name: this.slormancerTranslateService.translate('gold_find'), stat: 'gold_find', sign: true },
                    { name: this.slormancerTranslateService.translate('scrap_find'), stat: 'scrap_find', sign: true },
                    { name: this.slormancerTranslateService.translate('slormite_find'), stat: 'slormite_find', sign: true },
                    { name: this.slormancerTranslateService.translate('slormeline_find'), stat: 'slormeline_find', sign: true },
                    { name: this.slormancerTranslateService.translate('reaper_find'), stat: 'reaper_find', sign: true },
                    { name: this.slormancerTranslateService.translate('skill_mastery_gain'), stat: 'skill_mastery_gain', sign: true },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_secondary_melee'),
                stats: [
                    { name: this.slormancerTranslateService.translate('inner_fire_chance'), stat: 'inner_fire_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('inner_fire_max_number'), stat: 'inner_fire_max_number', sign: false },
                    { name: this.slormancerTranslateService.translate('inner_fire_duration'), stat: 'inner_fire_duration', sign: false },
                    { name: this.slormancerTranslateService.translate('inner_fire_damage'), stat: 'inner_fire_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('overdrive_chance'), stat: 'overdrive_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('overdrive_bounce_number'), stat: 'overdrive_bounce_number', sign: false },
                    { name: this.slormancerTranslateService.translate('overdrive_damage'), stat: 'overdrive_damage', sign: false },
                    { name: this.slormancerTranslateService.translate('recast_chance'), stat: 'recast_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('knockback_melee'), stat: 'knockback_melee', sign: false },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_secondary_projectile'),
                stats: [
                    { name: this.slormancerTranslateService.translate('additional_projectile'), stat: 'additional_projectile', sign: true },
                    { name: this.slormancerTranslateService.translate('chance_to_pierce'), stat: 'chance_to_pierce', sign: false },
                    { name: this.slormancerTranslateService.translate('fork_chance'), stat: 'fork_chance', sign: false },
                    { name: this.slormancerTranslateService.translate('chance_to_rebound'), stat: 'chance_to_rebound', sign: false },
                    { name: this.slormancerTranslateService.translate('projectile_speed'), stat: 'projectile_speed', sign: true },
                    { name: this.slormancerTranslateService.translate('knockback_projectile'), stat: 'knockback_projectile', sign: false },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_secondary_aoe'),
                stats: [
                    { name: this.slormancerTranslateService.translate('aoe_increased_size'), stat: 'aoe_increased_size', sign: false },
                    { name: this.slormancerTranslateService.translate('aoe_increased_effect'), stat: 'aoe_increased_effect', sign: false },
                ]
            },
            {
                section: this.slormancerTranslateService.translate('cat_secondary_extras'),
                stats: [
                    { name: this.slormancerTranslateService.translate('totem_increased_effect'), stat: 'totem_increased_effect', sign: true },
                    { name: this.slormancerTranslateService.translate('aura_increased_effect'), stat: 'aura_increased_effect', sign: true },
                    { name: this.slormancerTranslateService.translate('minion_increased_damage'), stat: 'minion_increased_damage', sign: true },
                ]
            },
        ];
    }
    ngOnInit() {
    }
    valueToString(value, sign, suffix) {
        let result;
        if (typeof value === 'number') {
            result = (value < 0 ? '' : (sign ? '+' : '')) + (0, _slorm_api_1.numberToString)(value) + suffix;
        }
        else {
            result = (value.min < 0 ? '' : (sign ? '+' : '')) + (0, _slorm_api_1.numberToString)(value.min) + suffix
                + ' - ' + (value.max < 0 ? '' : (sign ? '+' : '')) + (0, _slorm_api_1.numberToString)(value.max) + suffix;
        }
        return result;
    }
    getValue(characterStats, format) {
        const found = characterStats.find(characterStat => characterStat.stat === format.stat);
        let result = '0';
        if (found) {
            result = this.valueToString(found.totalDisplayed, format.sign, found.suffix);
        }
        return result;
    }
    select(characterStats, format) {
        const found = characterStats.find(characterStat => characterStat.stat === format.stat);
        if (found) {
            this.selectedMergedStat = found;
            this.selected.emit(found);
        }
    }
    translate(key) {
        return this.slormancerTranslateService.translate(key);
    }
    isSelected(format) {
        return this.selectedMergedStat !== null && this.selectedMergedStat.stat === format.stat;
    }
};
__decorate([
    (0, core_1.Input)()
], MainStatsComponent.prototype, "stats", void 0);
__decorate([
    (0, core_1.Output)()
], MainStatsComponent.prototype, "selected", void 0);
MainStatsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-main-stats',
        templateUrl: './main-stats.component.html',
        styleUrls: ['./main-stats.component.scss']
    })
], MainStatsComponent);
exports.MainStatsComponent = MainStatsComponent;
//# sourceMappingURL=main-stats.component.js.map