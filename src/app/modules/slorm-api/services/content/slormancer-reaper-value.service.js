"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerReaperValueService = void 0;
const core_1 = require("@angular/core");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
let SlormancerReaperValueService = class SlormancerReaperValueService {
    computeEffectVariableValue(effectValue, level, nonPrimordialLevel) {
        return Math.round((effectValue.baseValue + effectValue.upgrade * level) * 1000) / 1000;
    }
    computeEffectSynergyValue(effectValue) {
        const sourceIsDamages = effectValue.source === 'elemental_damage' || effectValue.source === 'physical_damage' || effectValue.source === 'weapon_damage';
        return sourceIsDamages && effectValue.valueType === effect_value_value_type_1.EffectValueValueType.Damage ? { min: 0, max: 0 } : 0;
    }
};
SlormancerReaperValueService = __decorate([
    (0, core_1.Injectable)()
], SlormancerReaperValueService);
exports.SlormancerReaperValueService = SlormancerReaperValueService;
//# sourceMappingURL=slormancer-reaper-value.service.js.map