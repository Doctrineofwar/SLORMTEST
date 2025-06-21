"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
let SearchService = class SearchService {
    constructor() {
        this.search = null;
        this.dom = document.createElement("div");
        this.searchChanged = new rxjs_1.BehaviorSubject(null);
    }
    hasSearch() {
        return this.search !== null;
    }
    setSearch(value) {
        this.search = value !== null ? (value.length > 0 ? value : null) : null;
        this.searchChanged.next(this.search);
    }
    getCleanSearchValue() {
        return this.search === null ? null : this.search.toLowerCase().trim();
    }
    removeHtmlTags(value, classesToRemove = []) {
        let result = value;
        if (result !== null) {
            this.dom.innerHTML = result.toLowerCase();
            if (classesToRemove.length > 0) {
                for (const classToRemove of classesToRemove) {
                    const items = this.dom.getElementsByClassName(classToRemove);
                    for (let i = 0, len = items.length; i < len; i++) {
                        const item = items.item(i);
                        if (item) {
                            item.remove();
                        }
                    }
                }
            }
            result = this.dom.textContent;
        }
        return result;
    }
    stringsMatchSearch(values) {
        let result = true;
        const search = this.getCleanSearchValue();
        if (search !== null) {
            result = this.search === null ? true : values
                .find(value => (0, _slorm_api_1.isNotNullOrUndefined)(value) && value.toLowerCase().indexOf(search) !== -1) !== undefined;
        }
        return result;
    }
    itemMatchSearch(item) {
        return this.stringsMatchSearch([
            item.level.toString(),
            item.name,
            item.base,
            item.rarity,
            ...item.affixes.map(affix => [affix.isPure ? 'pure' : null, this.removeHtmlTags(affix.valueLabel + ' ' + affix.statLabel, ['details'])]).flat(),
            item.legendaryEffect === null ? null : this.removeHtmlTags(item.legendaryEffect.description, ['details']),
            item.legendaryEffect === null || item.legendaryEffect.reaperName === null ? null : item.legendaryEffect.reaperName,
            item.reaperEnchantment !== null ? this.removeHtmlTags(item.reaperEnchantment.label, ['details']) : null,
            item.skillEnchantment !== null ? this.removeHtmlTags(item.skillEnchantment.label, ['details']) : null,
            item.attributeEnchantment !== null ? this.removeHtmlTags(item.attributeEnchantment.label, ['details']) : null
        ]) || (item.legendaryEffect !== null && item.legendaryEffect.activable !== null && this.activableMatchSearch(item.legendaryEffect.activable));
    }
    runeMatchSearch(rune) {
        return this.stringsMatchSearch([
            rune.level.toString(),
            rune.name,
            this.removeHtmlTags(rune.constraintLabel),
            this.removeHtmlTags(rune.description),
            rune.flavor,
            rune.smithLabel,
            rune.typeLabel
        ]);
    }
    ultimatumMatchSearch(ultimatum) {
        return this.stringsMatchSearch([
            ultimatum.title,
            ultimatum.levelLabel,
            ultimatum.bonusTitle,
            this.removeHtmlTags(ultimatum.bonusLabel),
            ultimatum.malusTitle,
            ultimatum.malusLabel
        ]);
    }
    upgradeMatchSearch(upgrade) {
        return this.stringsMatchSearch([
            upgrade.name,
            upgrade.type,
            this.removeHtmlTags(upgrade.description),
            ...upgrade.genres,
            upgrade.genresLabel,
            this.removeHtmlTags(upgrade.costLabel),
            this.removeHtmlTags(upgrade.costType),
            ...upgrade.relatedBuffs.map(buff => buff.name),
            ...upgrade.relatedClassMechanics.map(buff => buff.name),
            ...upgrade.relatedMechanics.map(buff => buff.name)
        ]);
    }
    ancestralLegacyMatchSearch(ancestralLegacy) {
        return this.stringsMatchSearch([
            ancestralLegacy.name,
            ancestralLegacy.costType,
            ...ancestralLegacy.genres,
            ancestralLegacy.isActivable ? 'activable' : null,
            this.removeHtmlTags(ancestralLegacy.description),
            ...ancestralLegacy.relatedBuffs.map(buff => buff.name),
            ...ancestralLegacy.relatedMechanics.map(mechanic => mechanic.name),
            ...ancestralLegacy.types,
            ancestralLegacy.typeLabel,
            ancestralLegacy.genresLabel,
            ancestralLegacy.costLabel
        ]);
    }
    reaperMatchSearch(reaper) {
        return this.stringsMatchSearch([
            reaper.name,
            reaper.description,
            reaper.benediction,
            reaper.malediction,
            reaper.smith.name,
            reaper.smithLabel,
            reaper.victimsLabel,
            reaper.levelLabel,
            reaper.damageTypeLabel,
            reaper.benediction !== null ? reaper.benedictionTitleLabel : '',
            reaper.malediction !== null ? reaper.maledictionTitleLabel : '',
            reaper.activables.length !== 0 ? reaper.activablesTitleLabel : '',
            reaper.damagesLabel,
            reaper.maxDamagesLabel,
            reaper.affinityLabel,
            reaper.lore,
        ]) || reaper.activables.some(activable => this.activableMatchSearch(activable));
    }
    activableMatchSearch(activable) {
        return this.stringsMatchSearch([
            activable.name,
            activable.genresLabel,
            activable.cooldownLabel,
            activable.costLabel,
            activable.description,
        ]);
    }
    traitMatchSearch(trait) {
        return this.stringsMatchSearch([
            trait.rankLabel,
            this.removeHtmlTags(trait.cumulativeStats),
            this.removeHtmlTags(trait.description),
            trait.traitLevelLabel,
        ]);
    }
};
SearchService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map