"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerMightService = void 0;
const core_1 = require("@angular/core");
const util_1 = require("../../util");
let SlormancerMightService = class SlormancerMightService {
    constructor() {
        this.MIGHT_MAX_DAMAGE = 4000;
        this.MIGHT_COEFFICIENT = -7.5 * Math.LN2;
    }
    getInvestedSkillSlorm(character) {
        let invested = 0;
        for (const skill of character.skills) {
            for (const upgrade of skill.upgrades) {
                invested += upgrade.investedSlorm;
            }
        }
        return invested;
    }
    getTotalSkillSlorm(character) {
        let total = 0;
        for (const skill of character.skills) {
            for (const upgrade of skill.upgrades) {
                total += upgrade.totalSlormCost;
            }
        }
        return total;
    }
    getInvestedAncestralSlorm(character) {
        let invested = 0;
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            invested += ancestralLegacy.investedSlorm;
        }
        return invested;
    }
    getTotalAncestralSlorm(character) {
        let total = 0;
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            total += ancestralLegacy.totalSlormCost;
        }
        return total;
    }
    computeMight(totalSlorm, investedSlorm) {
        let result = 0;
        /* original formula
        const k = 7.5 * Math.LN2 / totalSlorm;
        const exponent = -k * totalSlorm;
        const denominator = 1 - Math.exp(exponent);
        const m = 1 / denominator;

        const damage = maxDamage * m * (1 - Math.exp(-k * investedSlorm));

        //if we need the next point cost

        const nextDamage = damage + 1;
        const requiredSkillpoints = - Math.log(1 - nextDamage / (maxDamage * m)) / k;
        const pointToMight = requiredSkillpoints - investedSlorm;
        */
        if (totalSlorm > 0) {
            result = (0, util_1.round)(this.MIGHT_MAX_DAMAGE * (1 - Math.exp(this.MIGHT_COEFFICIENT * investedSlorm / totalSlorm)) / (1 - Math.exp(this.MIGHT_COEFFICIENT)), 2);
        }
        return result;
    }
    updateMight(character) {
        character.might.skill = this.getSkillMight(character);
        character.might.ancestral = this.getAncestralMight(character);
    }
    getSkillMight(character) {
        const totalSlorm = this.getTotalSkillSlorm(character);
        const investedSlorm = character.might.investedSkillSlorm ?? this.getInvestedSkillSlorm(character);
        return this.computeMight(totalSlorm, investedSlorm);
    }
    getAncestralMight(character) {
        const totalSlorm = this.getTotalAncestralSlorm(character);
        const investedSlorm = character.might.investedAncestralLegacySlorm ?? this.getInvestedAncestralSlorm(character);
        return this.computeMight(totalSlorm, investedSlorm);
    }
};
SlormancerMightService = __decorate([
    (0, core_1.Injectable)()
], SlormancerMightService);
exports.SlormancerMightService = SlormancerMightService;
//# sourceMappingURL=slormancer-might.service.js.map