"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerMechanicService = void 0;
const core_1 = require("@angular/core");
const data_mechanic_1 = require("../../constants/content/data/data-mechanic");
const mechanic_type_1 = require("../../model/content/enum/mechanic-type");
const skill_element_1 = require("../../model/content/skill-element");
const utils_1 = require("../../util/utils");
let SlormancerMechanicService = class SlormancerMechanicService {
    constructor(slormancerTranslateService, slormancerTemplateService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerTemplateService = slormancerTemplateService;
    }
    getName(type) {
        let key;
        if (type === mechanic_type_1.MechanicType.WalkingBomb || type === mechanic_type_1.MechanicType.SoulBound || type === mechanic_type_1.MechanicType.Burn) {
            key = 'tt_' + type;
        }
        else if (type === mechanic_type_1.MechanicType.Blorm || type === mechanic_type_1.MechanicType.ShieldGlobe || type === mechanic_type_1.MechanicType.Fireball || type === mechanic_type_1.MechanicType.Dart || type === mechanic_type_1.MechanicType.Frostbolt || type === mechanic_type_1.MechanicType.LightningRod) {
            key = 'tt_mechanic_' + type;
        }
        else {
            key = 'tt_' + type + '_name';
        }
        return this.slormancerTranslateService.translate(key);
    }
    getDescription(type, values) {
        let key;
        if (type === mechanic_type_1.MechanicType.WalkingBomb || type === mechanic_type_1.MechanicType.SoulBound || type === mechanic_type_1.MechanicType.Burn) {
            key = 'tt_' + type + '_effect';
        }
        else if (type === mechanic_type_1.MechanicType.Blorm || type === mechanic_type_1.MechanicType.ShieldGlobe || type === mechanic_type_1.MechanicType.Fireball || type === mechanic_type_1.MechanicType.Dart || type === mechanic_type_1.MechanicType.Frostbolt || type === mechanic_type_1.MechanicType.LightningRod) {
            key = 'tt_mechanic_' + type + '_effect';
        }
        else {
            key = 'tt_help_' + type + '_effect';
        }
        const template = this.slormancerTranslateService.translate(key);
        return this.slormancerTemplateService.prepareMechanicTemplate(template, values.map(value => value.stat).filter(utils_1.isDamageType));
    }
    getMechanicClone(mechanic) {
        return {
            ...mechanic,
            values: mechanic.values.map(value => ({ ...value })),
        };
    }
    getMechanic(type) {
        const values = (0, utils_1.valueOrDefault)(data_mechanic_1.DATA_MECHANIC[type]?.values, []);
        const genres = (0, utils_1.valueOrDefault)(data_mechanic_1.DATA_MECHANIC[type]?.genres, []);
        const element = (0, utils_1.valueOrDefault)(data_mechanic_1.DATA_MECHANIC[type]?.element, skill_element_1.SkillElement.Neutral);
        const templateUpdate = (0, utils_1.valueOrNull)(data_mechanic_1.DATA_MECHANIC[type]?.template);
        let template = this.getDescription(type, values);
        if (templateUpdate !== null) {
            template = templateUpdate(template);
        }
        const mechanic = {
            name: this.getName(type),
            type,
            description: '',
            icon: 'mechanic/' + type,
            genres,
            template,
            values: values.map(value => ({ ...value })),
            element
        };
        this.updateMechanicView(mechanic);
        return mechanic;
    }
    updateMechanicView(mechanic) {
        mechanic.description = this.slormancerTemplateService.formatMechanicTemplate(mechanic.template, mechanic.values);
    }
};
SlormancerMechanicService = __decorate([
    (0, core_1.Injectable)()
], SlormancerMechanicService);
exports.SlormancerMechanicService = SlormancerMechanicService;
//# sourceMappingURL=slormancer-mechanic.service.js.map