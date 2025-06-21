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
exports.RunesEditModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let RunesEditModalComponent = class RunesEditModalComponent {
    constructor(dialogRef, slormancerRuneService, slormancerCharacterUpdaterService, buildStorageService, data) {
        this.dialogRef = dialogRef;
        this.slormancerRuneService = slormancerRuneService;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.buildStorageService = buildStorageService;
        this.MAX_REAPER_AFFINITY_BASE = _slorm_api_1.MAX_REAPER_AFFINITY_BASE;
        this.form = new forms_1.FormGroup({
            activationId: new forms_1.FormControl(null),
            activationLevel: new forms_1.FormControl(1, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(15)]),
            effectId: new forms_1.FormControl(null),
            effectLevel: new forms_1.FormControl(1, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(15)]),
            enhancementId: new forms_1.FormControl(null),
            enhancementLevel: new forms_1.FormControl(1, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(15)]),
        });
        this.originalRunes = this.slormancerRuneService.getRunesCombinationClone(data.character.runes);
        this.character = data.character;
        this.runes = this.slormancerRuneService.getRunes(this.character.heroClass, 1, this.character.reaper.id);
        this.form.valueChanges.subscribe(() => {
            this.updatePreview();
        });
        this.reset();
    }
    reset() {
        this.character.runes = {
            ...this.originalRunes
        };
        this.form.reset({
            activationId: this.character.runes.activation === null ? null : this.character.runes.activation.id,
            activationLevel: this.character.runes.activation === null ? 1 : this.character.runes.activation.level,
            effectId: this.character.runes.effect === null ? null : this.character.runes.effect.id,
            effectLevel: this.character.runes.effect === null ? 1 : this.character.runes.effect.level,
            enhancementId: this.character.runes.enhancement === null ? null : this.character.runes.enhancement.id,
            enhancementLevel: this.character.runes.enhancement === null ? 1 : this.character.runes.enhancement.level,
        });
    }
    submit() {
        if (this.form.valid) {
            this.dialogRef.close(this.character.runes);
        }
    }
    getRune(index) {
        return (0, _slorm_api_1.valueOrNull)(this.runes[index]);
    }
    isSelected(index) {
        const formValue = this.form.value;
        return formValue.activationId === index || formValue.effectId === index || formValue.enhancementId === index;
    }
    selectRune(rune) {
        if (rune !== null) {
            if (rune.type === _slorm_api_1.RuneType.Activation) {
                const activationId = this.form.value.activationId === rune.id ? null : rune.id;
                this.form.patchValue({ activationId });
            }
            else if (rune.type === _slorm_api_1.RuneType.Effect) {
                const effectId = this.form.value.effectId === rune.id ? null : rune.id;
                this.form.patchValue({ effectId });
            }
            else if (rune.type === _slorm_api_1.RuneType.Enhancement) {
                const enhancementId = this.form.value.enhancementId === rune.id ? null : rune.id;
                this.form.patchValue({ enhancementId });
            }
        }
    }
    updatePreview() {
        if (this.form.valid) {
            const value = this.form.value;
            this.character.runes = {
                activation: null,
                effect: null,
                enhancement: null,
            };
            if (value.activationId !== null) {
                this.character.runes.activation = this.slormancerRuneService.getRuneById(value.activationId, this.character.heroClass, value.activationLevel, this.character.reaper.id);
            }
            else {
                this.character.runes.activation = null;
            }
            if (value.effectId !== null) {
                this.character.runes.effect = this.slormancerRuneService.getRuneById(value.effectId, this.character.heroClass, value.effectLevel, this.character.reaper.id);
            }
            else {
                this.character.runes.effect = null;
            }
            if (value.enhancementId !== null) {
                this.character.runes.enhancement = this.slormancerRuneService.getRuneById(value.enhancementId, this.character.heroClass, value.enhancementLevel, this.character.reaper.id);
            }
            else {
                this.character.runes.enhancement = null;
            }
            for (const rune of this.runes) {
                if (rune.type === _slorm_api_1.RuneType.Activation) {
                    rune.level = value.activationLevel;
                }
                if (rune.type === _slorm_api_1.RuneType.Effect) {
                    rune.level = value.effectLevel;
                }
                if (rune.type === _slorm_api_1.RuneType.Enhancement) {
                    rune.level = value.enhancementLevel;
                }
                this.slormancerRuneService.updateRuneModel(rune, this.character.reaper.id);
            }
            const build = this.buildStorageService.getBuild();
            this.slormancerRuneService.updateRunesModel(this.character.runes, this.character.reaper.id);
            this.slormancerCharacterUpdaterService.updateCharacter(this.character, build !== null ? build.configuration : _slorm_api_1.DEFAULT_CONFIG, false, null, this.runes);
            this.slormancerRuneService.updateRunesView(this.character.runes);
            for (const rune of this.runes) {
                this.slormancerRuneService.updateRuneView(rune);
            }
        }
    }
};
RunesEditModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-runes-edit-modal',
        templateUrl: './runes-edit-modal.component.html',
        styleUrls: ['./runes-edit-modal.component.scss']
    }),
    __param(4, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], RunesEditModalComponent);
exports.RunesEditModalComponent = RunesEditModalComponent;
//# sourceMappingURL=runes-edit-modal.component.js.map