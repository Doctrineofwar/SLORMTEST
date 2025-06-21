"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerClassMechanicService = void 0;
const core_1 = require("@angular/core");
const data_class_mechanic_1 = require("../../constants/content/data/data-class-mechanic");
const utils_1 = require("../../util/utils");
let SlormancerClassMechanicService = class SlormancerClassMechanicService {
    constructor(slormancerDataService, slormancerTemplateService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.classMechanics = { 0: {}, 1: {}, 2: {} };
    }
    getClassMechanic(heroClass, id) {
        let mechanic = this.classMechanics[heroClass][id] ?? null;
        if (mechanic === null) {
            const data = this.slormancerDataService.getGameDataSkill(heroClass, id);
            if (data !== null) {
                const values = (0, utils_1.valueOrDefault)(data_class_mechanic_1.DATA_CLASS_MECHANIC[heroClass][id]?.values, []);
                const genres = (0, utils_1.valueOrDefault)(data_class_mechanic_1.DATA_CLASS_MECHANIC[heroClass][id]?.genres, []);
                const templateOverride = (0, utils_1.valueOrDefault)(data_class_mechanic_1.DATA_CLASS_MECHANIC[heroClass][id]?.templateOverride, template => template);
                mechanic = {
                    id: data.REF,
                    name: data.EN_NAME,
                    genres,
                    description: '',
                    icon: 'skill/' + heroClass + '/' + data.REF,
                    template: this.slormancerTemplateService.prepareMechanicTemplate(templateOverride(data.EN_DESCRIPTION), values.map(value => value.stat).filter(utils_1.isDamageType)),
                    values: values.map(value => ({ ...value }))
                };
                this.updateClassMechanicView(mechanic);
                this.classMechanics[heroClass][id] = mechanic;
            }
        }
        return mechanic;
    }
    updateClassMechanicView(mechanic) {
        mechanic.description = this.slormancerTemplateService.formatMechanicTemplate(mechanic.template, mechanic.values);
    }
    updateClassMechanicViews(heroClass) {
        for (const id in this.classMechanics[heroClass]) {
            const mechanic = this.classMechanics[heroClass][id];
            if (mechanic) {
                this.updateClassMechanicView(mechanic);
            }
        }
    }
    getClassMechanics(heroClass) {
        return Object.values(this.classMechanics[heroClass]);
    }
};
SlormancerClassMechanicService = __decorate([
    (0, core_1.Injectable)()
], SlormancerClassMechanicService);
exports.SlormancerClassMechanicService = SlormancerClassMechanicService;
//# sourceMappingURL=slormancer-class-mechanic.service.js.map