"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let ItemEditModalComponent = class ItemEditModalComponent {
    constructor(dialogRef, slormancerCharacterUpdaterService, slormancerItemService, slormancerAffixService, slormancerLegendaryEffectService, slormancerTranslationService, formOptionsService, buildStorageService, data) {
        this.dialogRef = dialogRef;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.slormancerItemService = slormancerItemService;
        this.slormancerAffixService = slormancerAffixService;
        this.slormancerLegendaryEffectService = slormancerLegendaryEffectService;
        this.slormancerTranslationService = slormancerTranslationService;
        this.formOptionsService = formOptionsService;
        this.buildStorageService = buildStorageService;
        this.MAX_NEITHER_ITEM_LEVEL = _slorm_api_1.MAX_NEITHER_ITEM_LEVEL;
        this.maxBasicStats = 0;
        this.alreadyUsedStats = [];
        this.possible = true;
        this.form = new forms_1.FormGroup({
            level: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(_slorm_api_1.MAX_NEITHER_ITEM_LEVEL), forms_1.Validators.pattern(/^[0-9]+$/)] }),
            reinforcement: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.pattern(/^[0-9]+$/)] }),
            hideGrafts: new forms_1.FormControl(false, { nonNullable: true }),
            affixes: new forms_1.FormArray([]),
            legendary: new forms_1.FormGroup({
                id: new forms_1.FormControl(null),
                value: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.pattern(/^[0-9]+$/)] })
            }),
            reaper: new forms_1.FormGroup({
                smith: new forms_1.FormControl(null),
                value: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.pattern(/^[0-9]+$/)] })
            }),
            attribute: new forms_1.FormGroup({
                attribute: new forms_1.FormControl(null),
                value: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.pattern(/^[0-9]+$/)] })
            }),
            skill: new forms_1.FormGroup({
                skill: new forms_1.FormControl(null),
                value: new forms_1.FormControl(0, { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.pattern(/^[0-9]+$/)] })
            }),
        });
        this.originalItem = data.item;
        this.maxLevel = data.maxLevel;
        this.form.valueChanges.subscribe(() => {
            this.updatePreview();
            this.alreadyUsedStats = this.form.controls.affixes.getRawValue().map(affix => affix.stat);
            this.possible = this.isItemPossible(this.form);
        });
        this.form.controls.affixes.valueChanges.subscribe(() => {
            this.sortAffixes();
        });
        this.character = data.character;
        this.reset();
    }
    reset() {
        this.item = this.slormancerItemService.getEquipableItemClone(this.originalItem);
        this.form.controls.affixes.clear({ emitEvent: false });
        for (const _ of this.item.affixes) {
            this.form.controls.affixes.push(this.getAffixForm(), { emitEvent: false });
        }
        this.form.reset({
            level: this.item.level,
            reinforcement: this.item.reinforcement,
            hideGrafts: false,
            affixes: this.item.affixes.map(affix => ({
                pure: affix.isPure,
                purity: affix.pure,
                rarity: affix.rarity,
                stat: affix.craftedEffect.effect.stat,
                value: affix.craftedEffect.craftedValue
            })),
            legendary: {
                id: this.item.legendaryEffect === null ? null : this.item.legendaryEffect.id,
                value: this.item.legendaryEffect === null ? 0 : this.item.legendaryEffect.value,
            },
            attribute: {
                attribute: this.item.attributeEnchantment === null ? null : this.item.attributeEnchantment.craftedAttribute,
                value: this.item.attributeEnchantment === null ? 0 : this.item.attributeEnchantment.craftedValue
            },
            reaper: {
                smith: this.item.reaperEnchantment === null ? null : this.item.reaperEnchantment.craftedReaperSmith,
                value: this.item.reaperEnchantment === null ? 0 : this.item.reaperEnchantment.craftedValue
            },
            skill: {
                skill: this.item.skillEnchantment === null ? null : this.item.skillEnchantment.craftedSkill,
                value: this.item.skillEnchantment === null ? 0 : this.item.skillEnchantment.craftedValue
            }
        });
        this.sortAffixes();
        this.updatePreview();
    }
    submit() {
        if (this.form.valid) {
            this.dialogRef.close(this.item);
        }
    }
    updatePreview() {
        const item = this.item;
        if (this.form.valid) {
            const value = this.form.getRawValue();
            item.level = value.level;
            item.reinforcement = value.reinforcement;
            item.affixes = value.affixes
                .map(affix => this.slormancerAffixService.getAffixFromStat(affix.stat, item.level, item.reinforcement, affix.rarity, affix.value, affix.pure ? affix.purity : 0))
                .filter(_slorm_api_1.isNotNullOrUndefined);
            item.legendaryEffect = value.legendary.id === null ? null
                : this.slormancerLegendaryEffectService.getLegendaryEffectById(value.legendary.id, value.legendary.value, item.reinforcement, item.heroClass);
            item.reaperEnchantment = value.reaper.smith === null ? null
                : this.slormancerItemService.getReaperEnchantment(value.reaper.smith, value.reaper.value);
            item.skillEnchantment = value.skill.skill === null ? null
                : this.slormancerItemService.getSkillEnchantment(value.skill.skill, value.skill.value);
            item.attributeEnchantment = value.attribute.attribute === null ? null
                : this.slormancerItemService.getAttributeEnchantment(value.attribute.attribute, value.attribute.value);
            const legendaryEffects = [...(0, _slorm_api_1.getAllLegendaryEffects)(this.character.gear), ...(item.legendaryEffect ? [item.legendaryEffect] : [])];
            const defensiveStatMultiplier = this.slormancerItemService.getDefensiveStatMultiplier(legendaryEffects);
            this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
            const build = this.buildStorageService.getBuild();
            this.slormancerCharacterUpdaterService.updateCharacter(this.character, build !== null ? build.configuration : _slorm_api_1.DEFAULT_CONFIG, false, item);
            this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
        }
    }
    sortAffixes() {
        this.form.controls.affixes.controls
            .sort((a, b) => (0, _slorm_api_1.compareString)(this.slormancerTranslationService.translate(a.controls.stat.value), this.slormancerTranslationService.translate(b.controls.stat.value)));
    }
    getAffixForm() {
        return new forms_1.FormGroup({
            pure: new forms_1.FormControl(false, { nonNullable: true, validators: forms_1.Validators.required }),
            purity: new forms_1.FormControl(0, { nonNullable: true, validators: forms_1.Validators.required }),
            rarity: new forms_1.FormControl(_slorm_api_1.Rarity.Normal, { nonNullable: true, validators: forms_1.Validators.required }),
            stat: new forms_1.FormControl('', { nonNullable: true, validators: forms_1.Validators.required }),
            value: new forms_1.FormControl(0, { nonNullable: true, validators: forms_1.Validators.required })
        });
    }
    affixToForm(affix) {
        const form = this.getAffixForm();
        form.reset({
            pure: affix.isPure,
            purity: affix.pure,
            rarity: affix.rarity,
            stat: affix.craftedEffect.effect.stat,
            value: affix.craftedEffect.craftedValue
        });
        return form;
    }
    hasBasicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isBasicStat(control)).length > 0;
    }
    hasMaximumBasicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isBasicStat(control)).length >= this.maxBasicStats;
    }
    hasDefensiveStats() {
        return this.form.controls.affixes.controls.filter(control => this.isDefensiveStat(control)).length > 0;
    }
    hasMaximumDefensiveStats() {
        return this.form.controls.affixes.controls.filter(control => this.isDefensiveStat(control)).length >= _slorm_api_1.MAX_DEFENSIVE_STATS;
    }
    hasMagicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isMagicStat(control)).length > 0;
    }
    hasMaximumMagicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isMagicStat(control)).length >= _slorm_api_1.MAX_MAGIC_STATS;
    }
    isBasicStat(control) {
        return control.controls.rarity.value === _slorm_api_1.Rarity.Normal;
    }
    isDefensiveStat(control) {
        return control.controls.rarity.value === _slorm_api_1.Rarity.Defensive;
    }
    isMagicStat(control) {
        return control.controls.rarity.value === _slorm_api_1.Rarity.Magic;
    }
    isRareStat(control) {
        return control.controls.rarity.value === _slorm_api_1.Rarity.Rare;
    }
    isEpicStat(control) {
        return control.controls.rarity.value === _slorm_api_1.Rarity.Epic;
    }
    hasRareStats() {
        return this.form.controls.affixes.controls.filter(control => this.isRareStat(control)).length > 0;
    }
    hasMaximumRareStats() {
        return this.form.controls.affixes.controls.filter(control => this.isRareStat(control)).length >= _slorm_api_1.MAX_RARE_STATS;
    }
    hasEpicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isEpicStat(control)).length > 0;
    }
    hasMaximumEpicStats() {
        return this.form.controls.affixes.controls.filter(control => this.isEpicStat(control)).length >= _slorm_api_1.MAX_EPIC_STATS;
    }
    getAffix(index) {
        return this.item === null ? null : (0, _slorm_api_1.valueOrNull)(this.item.affixes[index]);
    }
    removeAffix(affix) {
        this.form.controls.affixes.removeAt(this.form.controls.affixes.controls.indexOf(affix));
        this.updatePreview();
    }
    addAffix(rarity) {
        const possibleStats = this.formOptionsService.getStatsOptions(this.item.base, rarity)
            .filter(option => this.alreadyUsedStats.indexOf(option.value) === -1);
        const stat = possibleStats[0];
        if (stat) {
            const affix = this.slormancerAffixService.getAffixFromStat(stat.value, this.item.level, this.item.reinforcement, rarity, 1000);
            if (affix !== null) {
                this.form.controls.affixes.push(this.affixToForm(affix));
                this.updatePreview();
            }
        }
    }
    isItemPossible(form) {
        const itemLevel = form.controls.level.value;
        const neither = itemLevel > _slorm_api_1.MAX_ITEM_LEVEL;
        let possible = true;
        if (!neither) {
            for (const affixForm of form.controls.affixes.controls) {
                const options = this.formOptionsService.getStatsOptions(this.item.base, affixForm.controls.rarity.value);
                if (!options.some(option => option.value === affixForm.controls.stat.value)) {
                    possible = false;
                    break;
                }
            }
            if (possible && form.controls.legendary.value !== null && form.controls.legendary.value.id !== null) {
                const legendary = form.controls.legendary.value.id;
                const options = this.formOptionsService.getLegendaryOptions(this.item.base, this.item.heroClass);
                if (!options.some(option => option.value === legendary)) {
                    possible = false;
                }
            }
        }
        return possible;
    }
    addBasicAffix() {
        this.addAffix(_slorm_api_1.Rarity.Normal);
    }
    addDefensiveAffix() {
        this.addAffix(_slorm_api_1.Rarity.Defensive);
    }
    addMagicAffix() {
        this.addAffix(_slorm_api_1.Rarity.Magic);
    }
    addRareAffix() {
        this.addAffix(_slorm_api_1.Rarity.Rare);
    }
    addEpicAffix() {
        this.addAffix(_slorm_api_1.Rarity.Epic);
    }
};
ItemEditModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-modal',
        templateUrl: './item-edit-modal.component.html',
        styleUrls: ['./item-edit-modal.component.scss']
    }),
    __param(8, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], ItemEditModalComponent);
exports.ItemEditModalComponent = ItemEditModalComponent;
//# sourceMappingURL=item-edit-modal.component.js.map