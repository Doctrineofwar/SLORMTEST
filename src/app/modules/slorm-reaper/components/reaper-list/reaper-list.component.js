"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaperListComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
const html_to_image_1 = require("html-to-image");
const rxjs_1 = require("rxjs");
let ReaperListComponent = class ReaperListComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(slormancerDataService, searchService, slormancerReaperService, messageService, clipboardService) {
        super();
        this.slormancerDataService = slormancerDataService;
        this.searchService = searchService;
        this.slormancerReaperService = slormancerReaperService;
        this.messageService = messageService;
        this.clipboardService = clipboardService;
        this.HERO_CLASSES = [_slorm_api_1.HeroClass.Warrior, _slorm_api_1.HeroClass.Huntress, _slorm_api_1.HeroClass.Mage];
        this.allReapers = [];
        this.filteredReapers = [];
        this.heroClass = _slorm_api_1.HeroClass.Huntress;
        this.primordial = false;
        this.form = new forms_1.FormGroup({
            search: new forms_1.FormControl('', { nonNullable: true }),
            heroClass: new forms_1.FormControl(_slorm_api_1.HeroClass.Huntress, { nonNullable: true }),
            primordial: new forms_1.FormControl(false, { nonNullable: true }),
            maxLevelAndAffinity: new forms_1.FormControl(false, { nonNullable: true }),
            onlyMaxEvolve: new forms_1.FormControl(false, { nonNullable: true })
        });
        this.form.controls.search.valueChanges.subscribe(value => this.searchService.setSearch(value));
        (0, rxjs_1.combineLatest)([
            this.form.controls.heroClass.valueChanges,
            this.form.controls.primordial.valueChanges,
            this.form.controls.maxLevelAndAffinity.valueChanges,
            this.form.controls.onlyMaxEvolve.valueChanges
        ])
            .subscribe(([heroClass, primordial, maxLevelAndAffinity, onlyMaxEvolve]) => this.buildReaperList(heroClass, primordial, maxLevelAndAffinity, onlyMaxEvolve));
    }
    ngOnInit() {
        this.form.patchValue({
            search: '',
            heroClass: _slorm_api_1.HeroClass.Huntress,
            primordial: false,
            maxLevelAndAffinity: false,
            onlyMaxEvolve: false
        });
        this.searchService.searchChanged
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
            .subscribe(() => this.filterReaperList(this.form.controls.onlyMaxEvolve.value));
    }
    buildReaperList(heroClass, primordial, maxLevelAndAffinity, onlyMaxEvolve) {
        this.allReapers = this.slormancerDataService.getGameDataAvailableReaper()
            .map(reaperData => this.slormancerReaperService.getReaper(reaperData, heroClass, primordial, maxLevelAndAffinity ? (0, _slorm_api_1.valueOrDefault)(reaperData.MAX_LVL, 0) : 1, 0, 0, 0, maxLevelAndAffinity ? _slorm_api_1.MAX_REAPER_AFFINITY_BASE : 0, maxLevelAndAffinity ? (this.slormancerReaperService.useDifferentAffinityForEffects({ id: reaperData.REF, primordial: primordial }) ? _slorm_api_1.MAX_EFFECT_AFFINITY_BASE : _slorm_api_1.MAX_REAPER_AFFINITY_BASE) : 0, maxLevelAndAffinity ? _slorm_api_1.MAX_REAPER_AFFINITY_BONUS : 0, maxLevelAndAffinity ? _slorm_api_1.MAX_REAPER_LEVEL : 0));
        this.filterReaperList(onlyMaxEvolve);
    }
    filterReaperList(onlyMaxEvolve) {
        this.filteredReapers = this.allReapers
            .filter(reaper => this.searchService.reaperMatchSearch(reaper))
            .filter(reaper => onlyMaxEvolve ? (reaper.evolveInto === null) : true);
    }
    hasSearch() {
        return this.searchService.hasSearch();
    }
    removeSearch() {
        this.form.patchValue({ search: '' });
    }
    selectClass(heroClass) {
        this.form.patchValue({ heroClass });
    }
    isSelectedClass(heroClass) {
        const control = this.form.get('heroClass');
        return control !== null && control.value === heroClass;
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
    debug(reaper) {
        console.log(reaper);
    }
};
ReaperListComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-reaper-list',
        templateUrl: './reaper-list.component.html',
        styleUrls: ['./reaper-list.component.scss']
    })
], ReaperListComponent);
exports.ReaperListComponent = ReaperListComponent;
//# sourceMappingURL=reaper-list.component.js.map