"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendaryListComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
const html_to_image_1 = require("html-to-image");
const rxjs_1 = require("rxjs");
let LegendaryListComponent = class LegendaryListComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(slormancerDataService, searchService, slormancerLegendaryEffectService, slormancerItemService, slormancerEffectValueService, messageService, clipboardService, slormancerTranslateService) {
        super();
        this.slormancerDataService = slormancerDataService;
        this.searchService = searchService;
        this.slormancerLegendaryEffectService = slormancerLegendaryEffectService;
        this.slormancerItemService = slormancerItemService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.messageService = messageService;
        this.clipboardService = clipboardService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.HERO_CLASSES = [_slorm_api_1.HeroClass.Warrior, _slorm_api_1.HeroClass.Huntress, _slorm_api_1.HeroClass.Mage];
        this.allLegendaries = [];
        this.filteredLegendaries = [];
        this.form = new forms_1.FormGroup({
            search: new forms_1.FormControl('', { nonNullable: true }),
            heroClasses: new forms_1.FormControl([], { nonNullable: true }),
            bases: new forms_1.FormControl([], { nonNullable: true }),
            maxReinforcement: new forms_1.FormControl(false, { nonNullable: true }),
        });
        this.trackLegendary = (index, item) => item.legendaryEffect?.id;
        this.form.controls.search.valueChanges.subscribe(value => this.searchService.setSearch(value));
        this.buildLegendaryList();
        this.form.controls.maxReinforcement.valueChanges
            .subscribe(maxReinforcement => this.updateLegendaryEffects(maxReinforcement));
        this.form.controls.heroClasses.valueChanges
            .subscribe(() => this.filterLegendaryList());
        this.form.controls.bases.valueChanges
            .subscribe(() => this.filterLegendaryList());
        this.baseOptions = _slorm_api_1.EQUIPABLE_ITEM_BASE_VALUES.map(base => ({
            label: this.slormancerTranslateService.translate('PIECE_' + base).split('(')[0] ?? base,
            value: base
        }));
        this.classSpecificLabels = this.HERO_CLASSES.reduce((result, heroClass) => ({ ...result, [heroClass]: 'Only available for ' + this.slormancerTranslateService.translate('hero_' + heroClass) }), {});
    }
    ngOnInit() {
        this.reset();
        this.searchService.searchChanged
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
            .subscribe(() => this.filterLegendaryList());
    }
    buildLegendaryList() {
        this.allLegendaries = this.slormancerDataService.getGameDataAvailableLegendaries()
            .filter(legendaryData => legendaryData.REF !== 0)
            .sort((a, b) => (0, _slorm_api_1.compareString)(a.EN_NAME, b.EN_NAME))
            .map(legendaryData => this.buildLegendaryItem(legendaryData))
            .filter(_slorm_api_1.isNotNullOrUndefined);
        this.filterLegendaryList();
    }
    updateLegendaryEffects(maxReinforcement) {
        for (const item of this.allLegendaries) {
            item.reinforcement = maxReinforcement ? 15 : 0;
            if (item.legendaryEffect !== null) {
                for (const effect of item.legendaryEffect.effects) {
                    effect.craftedValue = maxReinforcement ? effect.maxPossibleCraftedValue : effect.minPossibleCraftedValue;
                    this.slormancerEffectValueService.updateEffectValue(effect.effect, item.reinforcement);
                }
                this.slormancerLegendaryEffectService.updateLegendaryEffectModel(item.legendaryEffect);
            }
            this.slormancerItemService.updateEquipableItemModel(item, 0);
            this.slormancerItemService.updateEquipableItemView(item, 0);
        }
    }
    buildLegendaryItem(legendaryData, maxed = false) {
        let result = null;
        const heroClass = [0, 1, 2].includes(legendaryData.HERO) ? legendaryData.HERO : _slorm_api_1.HeroClass.Huntress;
        const legendaryEffect = this.slormancerLegendaryEffectService.getLegendaryEffectById(legendaryData.REF, 100, 0, heroClass);
        if (legendaryData !== null) {
            result = this.slormancerItemService.getEquipableItem(legendaryData.ITEM, heroClass, 100, [], maxed ? 15 : 0, 0, legendaryEffect, null, null, null, 0);
        }
        return result;
    }
    filterLegendaryList() {
        const bases = this.form.controls.bases.value;
        const heroClasses = this.form.controls.heroClasses.value;
        this.filteredLegendaries = this.allLegendaries
            .filter(item => this.searchService.itemMatchSearch(item)
            && (bases.length === 0 || bases.includes(item.base))
            && (heroClasses.length === 0 || item.legendaryEffect !== null
                && (item.legendaryEffect.classSpecific === null || heroClasses.includes(item.legendaryEffect.classSpecific))));
    }
    reset() {
        this.form.reset({
            search: '',
            heroClasses: [],
            bases: [],
            maxReinforcement: false,
        });
    }
    hasSearch() {
        return this.searchService.hasSearch();
    }
    removeSearch() {
        this.form.patchValue({ search: '' });
    }
    toggleClass(heroClass) {
        let heroClasses = this.form.controls.heroClasses.value;
        const index = heroClasses.indexOf(heroClass);
        if (index === -1) {
            heroClasses.push(heroClass);
        }
        else {
            heroClasses.splice(index, 1);
        }
        this.form.patchValue({ heroClasses });
    }
    isSelectedClass(heroClass) {
        return this.form.controls.heroClasses.value.includes(heroClass);
    }
    copy(reaperDom) {
        (0, html_to_image_1.toBlob)(reaperDom).then(value => {
            const copySuccess = value !== null && this.clipboardService.copyImageToClipboard(value);
            if (copySuccess) {
                this.messageService.message('Reaper image copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy reaper image to clipboard');
            }
        }, () => this.messageService.error('Failed to copy reaper image to clipboard'));
    }
    isNotAvailable(reaper) {
        return false;
    }
    isCopyable() {
        return this.clipboardService.canCopyImage();
    }
    debug(item) {
        console.log(item.legendaryEffect);
    }
};
LegendaryListComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-legendary-list',
        templateUrl: './legendary-list.component.html',
        styleUrls: ['./legendary-list.component.scss']
    })
], LegendaryListComponent);
exports.LegendaryListComponent = LegendaryListComponent;
//# sourceMappingURL=legendary-list.component.js.map