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
exports.OptimizeItemsAffixesModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let OptimizeItemsAffixesModalComponent = class OptimizeItemsAffixesModalComponent {
    constructor(dialogRef, data, slormancerItemService, slormancerDataService, slormancerAffixService, formOptionsService) {
        this.dialogRef = dialogRef;
        this.slormancerItemService = slormancerItemService;
        this.slormancerDataService = slormancerDataService;
        this.slormancerAffixService = slormancerAffixService;
        this.formOptionsService = formOptionsService;
        this.AFFIX_OPTIONS = [];
        this.selectedAffixes = [];
        this.defensiveStatMultiplier = 0;
        this.RARITY_OPTIONS = this.formOptionsService.getAllRaritiesOptions()
            .filter(option => option.value !== _slorm_api_1.Rarity.Legendary)
            .sort((a, b) => (0, _slorm_api_1.compareRarities)(a.value, b.value));
        this.items = data.items;
        this.defensiveStatMultiplier = this.slormancerItemService.getDefensiveStatMultiplier(data.items
            .map(item => item.legendaryEffect)
            .filter(_slorm_api_1.isNotNullOrUndefined));
        const affixControl = new forms_1.FormControl();
        this.form = new forms_1.FormGroup({
            rarity: new forms_1.FormControl(_slorm_api_1.Rarity.Epic, forms_1.Validators.required),
            affix: affixControl
        });
        affixControl.valueChanges.subscribe((value) => {
            const affixOption = this.AFFIX_OPTIONS.find(option => option.value === value);
            if (affixOption !== undefined) {
                this.selectedAffixes.push({ affix: affixOption, purity: false });
                this.updateOptions();
                affixControl.setValue(null);
            }
        });
        this.updateOptions();
    }
    updateOptions() {
        this.AFFIX_OPTIONS = this.formOptionsService.getAllStatsOptions().filter(option => !this.selectedAffixes.map(a => a.affix).includes(option));
    }
    applyStatsToItem(item) {
        const highestRarity = this.form.value.rarity;
        const allowedRarities = _slorm_api_1.ALL_RARITIES.filter(rarity => (0, _slorm_api_1.compareRarities)(rarity, highestRarity) <= 0);
        const maxStats = {
            [_slorm_api_1.Rarity.Normal]: this.slormancerDataService.getBaseMaxBasicStat(item.base),
            [_slorm_api_1.Rarity.Defensive]: 1,
            [_slorm_api_1.Rarity.Magic]: 1,
            [_slorm_api_1.Rarity.Rare]: 1,
            [_slorm_api_1.Rarity.Epic]: 3,
            [_slorm_api_1.Rarity.Legendary]: 0,
            [_slorm_api_1.Rarity.Neither]: 0
        };
        const options = {
            [_slorm_api_1.Rarity.Normal]: this.formOptionsService.getStatsOptions(item.base, _slorm_api_1.Rarity.Normal),
            [_slorm_api_1.Rarity.Defensive]: this.formOptionsService.getStatsOptions(item.base, _slorm_api_1.Rarity.Defensive),
            [_slorm_api_1.Rarity.Magic]: this.formOptionsService.getStatsOptions(item.base, _slorm_api_1.Rarity.Magic),
            [_slorm_api_1.Rarity.Rare]: this.formOptionsService.getStatsOptions(item.base, _slorm_api_1.Rarity.Rare),
            [_slorm_api_1.Rarity.Epic]: this.formOptionsService.getStatsOptions(item.base, _slorm_api_1.Rarity.Epic),
            [_slorm_api_1.Rarity.Legendary]: [],
            [_slorm_api_1.Rarity.Neither]: []
        };
        item.affixes = [];
        for (const stat of this.selectedAffixes) {
            for (const rarity of allowedRarities) {
                const hasRoomForMoreAffixes = item.affixes.filter(affix => affix.rarity === rarity).length < maxStats[rarity];
                const availableOptions = options[rarity];
                if (hasRoomForMoreAffixes && availableOptions.includes(stat.affix)) {
                    console.log('Pure ? ', stat.purity);
                    const affix = this.slormancerAffixService.getAffixFromStat(stat.affix.value, item.level, item.reinforcement, rarity, undefined, stat.purity ? 200 : 100);
                    if (affix !== null) {
                        item.affixes.push(affix);
                        break;
                    }
                }
            }
        }
        const maxAffixRarityIndex = Math.max(...item.affixes.map(affix => _slorm_api_1.ALL_RARITIES.indexOf(affix.rarity)));
        const raritiesToFill = _slorm_api_1.ALL_RARITIES.filter(rarity => rarity === _slorm_api_1.Rarity.Normal || _slorm_api_1.ALL_RARITIES.indexOf(rarity) < maxAffixRarityIndex);
        for (const rarity of raritiesToFill) {
            let noAffixFound = false;
            while (!noAffixFound && item.affixes.filter(affix => affix.rarity === rarity).length < maxStats[rarity]) {
                const firstAvailable = options[rarity].find(option => item.affixes.find(affix => affix.craftedEffect.effect.stat === option.value) === undefined);
                noAffixFound = true;
                if (firstAvailable !== undefined) {
                    const affix = this.slormancerAffixService.getAffixFromStat(firstAvailable.value, item.level, item.reinforcement, rarity);
                    if (affix !== null) {
                        item.affixes.push(affix);
                        noAffixFound = false;
                    }
                }
            }
        }
        this.slormancerItemService.updateEquipableItemModel(item, this.defensiveStatMultiplier);
        this.slormancerItemService.updateEquipableItemView(item, this.defensiveStatMultiplier);
    }
    removeStat(index) {
        this.selectedAffixes.splice(index, 1);
        this.updateOptions();
    }
    getAffixControl() {
        return this.form.get('affix');
    }
    submit() {
        this.form.markAllAsTouched();
        if (this.selectedAffixes.length > 0 && this.form.valid) {
            for (const item of this.items) {
                this.applyStatsToItem(item);
            }
            this.dialogRef.close(true);
        }
    }
};
OptimizeItemsAffixesModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-optimize-items-affixes-modal',
        templateUrl: './optimize-items-affixes-modal.component.html',
        styleUrls: ['./optimize-items-affixes-modal.component.scss']
    }),
    __param(1, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], OptimizeItemsAffixesModalComponent);
exports.OptimizeItemsAffixesModalComponent = OptimizeItemsAffixesModalComponent;
//# sourceMappingURL=optimize-items-affixes-modal.component.js.map