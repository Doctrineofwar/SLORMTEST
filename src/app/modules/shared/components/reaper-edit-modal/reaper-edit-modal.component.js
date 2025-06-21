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
exports.ReaperEditModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let ReaperEditModalComponent = class ReaperEditModalComponent {
    constructor(dialogRef, slormancerReaperService, slormancerRuneService, slormancerCharacterUpdaterService, formOptionsService, buildStorageService, data) {
        this.dialogRef = dialogRef;
        this.slormancerReaperService = slormancerReaperService;
        this.slormancerRuneService = slormancerRuneService;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.formOptionsService = formOptionsService;
        this.buildStorageService = buildStorageService;
        this.MAX_REAPER_LEVEL = _slorm_api_1.MAX_REAPER_LEVEL;
        this.MAX_REAPER_AFFINITY_BASE = _slorm_api_1.MAX_REAPER_AFFINITY_BASE;
        this.MAX_EFFECT_AFFINITY_BASE = _slorm_api_1.MAX_EFFECT_AFFINITY_BASE;
        this.options = [];
        this.reaper = null;
        this.form = new forms_1.FormGroup({
            baseLevel: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(1), this.getReaperMaxLevelValidator()]),
            masteryLevel: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.max(_slorm_api_1.MAX_REAPER_LEVEL)]),
            baseKills: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(0)]),
            primordialKills: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(0)]),
            reaperAffinity: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.max(_slorm_api_1.MAX_REAPER_AFFINITY_BASE)]),
            effectAffinity: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.min(0), forms_1.Validators.max(_slorm_api_1.MAX_EFFECT_AFFINITY_BASE)]),
            primordial: new forms_1.FormControl(null, forms_1.Validators.required),
            reaper: new forms_1.FormControl(null, forms_1.Validators.required),
        });
        this.originalReaper = this.slormancerReaperService.getReaperClone(data.reaper);
        this.character = data.character;
        this.reaper = data.reaper;
        this.form.valueChanges.subscribe(() => {
            this.updatePreview();
        });
        this.form.controls.primordial.valueChanges.subscribe(primordial => {
            this.options = this.formOptionsService.getReaperOptions(this.originalReaper.weaponClass, primordial === true);
        });
        this.reset();
        this.updatePreview();
    }
    reset() {
        if (this.reaper !== null) {
            this.reaper = Object.assign(this.reaper, this.originalReaper);
            this.form.reset({
                baseKills: this.reaper.baseKills,
                baseLevel: this.reaper.baseLevel,
                masteryLevel: this.reaper.masteryLevel,
                effectAffinity: this.reaper.baseEffectAffinity,
                reaperAffinity: this.reaper.baseReaperAffinity,
                primordial: this.reaper.primordial,
                primordialKills: this.reaper.primordialKills,
                reaper: this.reaper.id
            });
        }
    }
    submit() {
        if (this.form.valid) {
            this.dialogRef.close(this.reaper);
        }
    }
    getReaperControl() {
        return this.form.get('reaper');
    }
    useDifferentAffinityForEffects(reaper) {
        return this.slormancerReaperService.useDifferentAffinityForEffects(reaper);
    }
    updatePreview() {
        if (this.form.valid && this.reaper !== null) {
            const value = this.form.getRawValue();
            if (value.reaper === this.reaper.id) {
                this.reaper.id = value.reaper;
                this.reaper.primordial = value.primordial;
                this.reaper.baseLevel = value.baseLevel;
                this.reaper.masteryLevel = value.masteryLevel;
                this.reaper.kills = value.baseKills;
                this.reaper.primordialKills = value.primordialKills;
                this.reaper.baseReaperAffinity = value.reaperAffinity;
                this.reaper.baseEffectAffinity = value.effectAffinity;
            }
            else {
                const newReaper = this.slormancerReaperService.getReaperById(value.reaper, this.reaper.weaponClass, value.primordial, value.baseLevel, this.reaper.bonusLevel, value.baseKills, value.primordialKills, value.reaperAffinity, value.effectAffinity, this.reaper.bonusAffinity);
                if (newReaper !== null) {
                    Object.assign(this.reaper, newReaper);
                }
            }
            if (!this.useDifferentAffinityForEffects(this.reaper)) {
                this.form.controls.effectAffinity.setValue(this.form.controls.reaperAffinity.value, { emitEvent: false });
                this.reaper.baseEffectAffinity = this.reaper.baseReaperAffinity;
            }
            const build = this.buildStorageService.getBuild();
            this.slormancerReaperService.updateReaperModel(this.reaper);
            if (this.character.runes.effect !== null) {
                this.slormancerRuneService.updateRuneModel(this.character.runes.effect, this.reaper.id);
            }
            this.slormancerCharacterUpdaterService.updateCharacter(this.character, build !== null ? build.configuration : _slorm_api_1.DEFAULT_CONFIG, false);
            this.slormancerReaperService.updateReaperView(this.reaper);
            if (value.baseLevel !== this.reaper.baseLevel) {
                this.form.patchValue({ baseLevel: this.reaper.baseLevel }, { emitEvent: false });
            }
        }
    }
    getReaperMaxLevelValidator() {
        return control => this.reaper === null ? {} : forms_1.Validators.max(this.reaper.maxLevel)(control);
    }
};
ReaperEditModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-reaper-edit-modal',
        templateUrl: './reaper-edit-modal.component.html',
        styleUrls: ['./reaper-edit-modal.component.scss']
    }),
    __param(6, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], ReaperEditModalComponent);
exports.ReaperEditModalComponent = ReaperEditModalComponent;
//# sourceMappingURL=reaper-edit-modal.component.js.map