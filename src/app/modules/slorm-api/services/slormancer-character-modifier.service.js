"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerCharacterModifierService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../constants/common");
const utils_1 = require("../util/utils");
let SlormancerCharacterModifierService = class SlormancerCharacterModifierService {
    constructor(slormancerAncestralLegacyNodesService) {
        this.slormancerAncestralLegacyNodesService = slormancerAncestralLegacyNodesService;
    }
    setPrimarySkill(character, skill) {
        let result = false;
        if (character.primarySkill !== skill) {
            if (character.secondarySkill === skill) {
                character.secondarySkill = character.primarySkill;
            }
            character.primarySkill = skill;
            result = true;
        }
        return result;
    }
    setSecondarySkill(character, skill) {
        let result = false;
        if (character.secondarySkill !== skill) {
            if (character.primarySkill === skill) {
                character.primarySkill = character.secondarySkill;
            }
            character.secondarySkill = skill;
            result = true;
        }
        return result;
    }
    setSupportSkill(character, skill) {
        let result = false;
        if (character.supportSkill !== skill) {
            character.supportSkill = skill;
            result = true;
        }
        return result;
    }
    selectUpgrade(character, selectedUpgrade) {
        let changed = false;
        const skill = character.skills.find(skill => skill.skill.id === selectedUpgrade.skillId);
        if (skill) {
            const sameLineIds = skill.selectedUpgrades
                .map(id => skill.upgrades.find(upgrade => upgrade.id === id))
                .filter(utils_1.isNotNullOrUndefined)
                .filter(upgrade => upgrade.line === selectedUpgrade.line)
                .map(upgrade => upgrade.id);
            for (const sameLineId of sameLineIds) {
                const sameLineIndex = skill.selectedUpgrades.indexOf(sameLineId);
                skill.selectedUpgrades.splice(sameLineIndex, 1);
            }
            skill.selectedUpgrades.push(selectedUpgrade.id);
            changed = true;
        }
        return changed;
    }
    toggleAncestralLegacyNode(character, nodeId) {
        const activeNodes = this.slormancerAncestralLegacyNodesService.getAllActiveNodes(character);
        let changed = false;
        if (activeNodes.includes(nodeId)) {
            if (character.ancestralLegacies.activeNodes.includes(nodeId)) {
                character.ancestralLegacies.activeNodes = character.ancestralLegacies.activeNodes.filter(node => node !== nodeId);
                changed = true;
            }
            else if (character.ancestralLegacies.activeFirstNode === nodeId) {
                character.ancestralLegacies.activeFirstNode = null;
                changed = true;
            }
        }
        else if (this.slormancerAncestralLegacyNodesService.isNodeConnectedToStart(nodeId, character) && character.ancestralLegacies.activeNodes.length < common_1.UNLOCKED_ANCESTRAL_LEGACY_POINTS) {
            character.ancestralLegacies.activeNodes.push(nodeId);
            changed = true;
        }
        else if (character.ancestralLegacies.activeFirstNode === null) {
            character.ancestralLegacies.activeFirstNode = nodeId;
            changed = true;
        }
        if (changed) {
            this.slormancerAncestralLegacyNodesService.stabilize(character);
        }
        return changed;
    }
};
SlormancerCharacterModifierService = __decorate([
    (0, core_1.Injectable)()
], SlormancerCharacterModifierService);
exports.SlormancerCharacterModifierService = SlormancerCharacterModifierService;
//# sourceMappingURL=slormancer-character-modifier.service.js.map