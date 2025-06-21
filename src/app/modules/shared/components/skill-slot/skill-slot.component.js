"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillSlotComponent = void 0;
const core_1 = require("@angular/core");
const menu_1 = require("@angular/material/menu");
const _slorm_api_1 = require("@slorm-api");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let SkillSlotComponent = class SkillSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerTranslateService, dialog) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.dialog = dialog;
        this.SKILL_MAX_MASTERY = _slorm_api_1.SKILL_MAX_MASTERY;
        this.skill = null;
        this.support = false;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
        this.menu = null;
        this.showOverlay = false;
        this.MASTERY_LABEL = this.slormancerTranslateService.translate('tt_mastery');
    }
    onOver() {
        this.showOverlay = true;
    }
    onLeave() {
        this.showOverlay = false;
    }
    ngOnInit() { }
    getAvailableSkills() {
        const layer = this.buildStorageService.getLayer();
        let skills = [];
        if (layer !== null && layer.character !== null) {
            const requiredSkillType = this.support ? _slorm_api_1.SkillType.Support : _slorm_api_1.SkillType.Active;
            skills = layer.character.skills
                .map(skillAndPassive => skillAndPassive.skill)
                .filter(skill => requiredSkillType === skill.type);
        }
        return skills;
    }
    isSelectedSkill(skill) {
        const layer = this.buildStorageService.getLayer();
        return layer !== null && layer.character !== null && (layer.character.primarySkill === skill
            || layer.character.secondarySkill === skill
            || layer.character.supportSkill === skill);
    }
    updateSkill(skill) {
        if (this.skill !== skill) {
            this.changed.emit(skill);
        }
    }
    openMenu() {
        if (this.menu !== null && !this.readonly) {
            this.menu.openMenu();
        }
        return false;
    }
    showModalTooltip(event, skill) {
        let skip = false;
        if (event.ctrlKey && skill !== null) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { skill } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], SkillSlotComponent.prototype, "skill", void 0);
__decorate([
    (0, core_1.Input)()
], SkillSlotComponent.prototype, "support", void 0);
__decorate([
    (0, core_1.Input)()
], SkillSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], SkillSlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.ViewChild)(menu_1.MatMenuTrigger, { static: true })
], SkillSlotComponent.prototype, "menu", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], SkillSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], SkillSlotComponent.prototype, "onLeave", null);
SkillSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-skill-slot',
        templateUrl: './skill-slot.component.html',
        styleUrls: ['./skill-slot.component.scss']
    })
], SkillSlotComponent);
exports.SkillSlotComponent = SkillSlotComponent;
//# sourceMappingURL=skill-slot.component.js.map