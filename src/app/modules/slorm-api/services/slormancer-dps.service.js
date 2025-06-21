"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerDpsService = void 0;
const core_1 = require("@angular/core");
let SlormancerDpsService = class SlormancerDpsService {
    getAverageHitDamage(damages, critChance, brutChance, critMultiplier, brutMultiplier) {
        critChance = Math.min(100, critChance);
        brutChance = Math.min(100, brutChance);
        const realBrutChance = critChance * brutChance / 100;
        const realCritChance = critChance - realBrutChance;
        const realNormalChance = 100 - realBrutChance - realCritChance;
        damages = typeof damages === 'number' ? damages : ((damages.min + damages.max) / 2);
        return (damages * realBrutChance * brutMultiplier / 10000)
            + (damages * realCritChance * critMultiplier / 10000)
            + (damages * realNormalChance / 100);
    }
    getDps(averageDamage, cooldown, animationTime = 0) {
        return averageDamage / (cooldown + animationTime);
    }
};
SlormancerDpsService = __decorate([
    (0, core_1.Injectable)()
], SlormancerDpsService);
exports.SlormancerDpsService = SlormancerDpsService;
//# sourceMappingURL=slormancer-dps.service.js.map