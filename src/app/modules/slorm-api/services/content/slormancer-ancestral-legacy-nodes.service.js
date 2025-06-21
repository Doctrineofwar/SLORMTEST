"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerAncestralLegacyNodesService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const data_ancestral_legacy_realms_1 = require("../../constants/content/data/data-ancestral-legacy-realms");
const util_1 = require("../../util");
let SlormancerAncestralLegacyNodesService = class SlormancerAncestralLegacyNodesService {
    constructor(slormancerDataService) {
        this.slormancerDataService = slormancerDataService;
    }
    getAllActiveNodes(character) {
        return [character.ancestralLegacies.activeFirstNode, ...character.ancestralLegacies.activeNodes]
            .filter(util_1.isNotNullOrUndefined);
    }
    isNodeConnectedToStartRecursive(nodeId, activeNodes, visitedNodes = []) {
        let connected = true;
        if (!data_ancestral_legacy_realms_1.INITIAL_NODES.includes(nodeId)) {
            const nodes = data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS
                .filter(realm => realm.nodes.includes(nodeId))
                .map(realm => realm.nodes)
                .flat()
                .filter((node, index, array) => (0, util_1.isFirst)(node, index, array) && activeNodes.includes(node) && !visitedNodes.includes(node));
            if (nodes.every(node => !data_ancestral_legacy_realms_1.INITIAL_NODES.includes(node))) {
                visitedNodes = [...nodes, ...visitedNodes];
                connected = nodes.some(node => this.isNodeConnectedToStartRecursive(node, activeNodes, visitedNodes));
            }
        }
        return connected;
    }
    isNodeConnectedToStart(nodeId, character) {
        return this.isNodeConnectedToStartRecursive(nodeId, this.getAllActiveNodes(character));
    }
    getActiveRealms(character) {
        const realms = data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS
            .filter(realm => realm.nodes.some(node => character.ancestralLegacies.activeNodes.includes(node)));
        if (character.ancestralLegacies.activeFirstNode !== null) {
            const firstNode = character.ancestralLegacies.activeFirstNode;
            const firstRealms = data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS
                .filter(realms => realms.nodes.includes(firstNode));
            const highestRealm = firstRealms.find(realm => firstRealms.some(frealm => frealm.realm < realm.realm));
            if (highestRealm !== undefined) {
                realms.push(highestRealm);
            }
        }
        return realms.filter(util_1.isFirst);
    }
    getAdjacentRealms(character) {
        const activeRealms = this.getActiveRealms(character);
        const activeRealmNodes = activeRealms.map(realm => realm.nodes).flat();
        return data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS
            .filter(realm => realm.nodes.some(node => activeRealmNodes.includes(node)) && !activeRealms.includes(realm));
    }
    getAncestralLegacyIds(character) {
        const realms = this.getActiveRealms(character);
        return this.slormancerDataService.getAncestralLegacies()
            .filter(ancestralLegacy => realms.some(realm => realm.realm === ancestralLegacy.REALM))
            .map(ancestralLegacy => ancestralLegacy.REF);
    }
    getAncestralLegacyIdsFromRealm(realm) {
        return this.slormancerDataService.getAncestralLegacies()
            .filter(ancestralLegacy => ancestralLegacy.REALM === realm)
            .map(ancestralLegacy => ancestralLegacy.REF);
    }
    getAvailableEmptyNodes(character) {
        let availableEmptyNodes = [];
        if (character.ancestralLegacies.activeNodes.length < constants_1.UNLOCKED_ANCESTRAL_LEGACY_POINTS) {
            const activeNodes = this.getAllActiveNodes(character)
                .filter(node => this.isNodeConnectedToStart(node, character));
            const possibleNodes = data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS
                .filter(realm => realm.nodes.some(node => activeNodes.includes(node)))
                .map(realm => realm.nodes)
                .flat();
            availableEmptyNodes = [...possibleNodes, ...data_ancestral_legacy_realms_1.INITIAL_NODES]
                .filter((node, index, array) => (0, util_1.isFirst)(node, index, array) && !activeNodes.includes(node));
        }
        return availableEmptyNodes;
    }
    getValidNodes(nodes) {
        let connectedNodes = nodes.filter(node => data_ancestral_legacy_realms_1.INITIAL_NODES.indexOf(node) !== -1);
        let valid = true;
        while (connectedNodes.length < nodes.length && valid) {
            const newConnectedNodes = connectedNodes.map(node => data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS.filter(realm => realm.nodes.indexOf(node) !== -1))
                .flat()
                .map(realm => realm.nodes.filter(node => nodes.indexOf(node) !== -1))
                .flat().filter(util_1.isFirst);
            valid = connectedNodes.length < newConnectedNodes.length;
            connectedNodes = newConnectedNodes;
        }
        return connectedNodes;
    }
    stabilize(character) {
        character.ancestralLegacies.activeNodes = character.ancestralLegacies.activeNodes
            .filter((node, index, array) => (0, util_1.isFirst)(node, index, array) && this.isNodeConnectedToStart(node, character));
        if (character.ancestralLegacies.activeFirstNode !== null && character.ancestralLegacies.activeNodes.includes(character.ancestralLegacies.activeFirstNode)) {
            character.ancestralLegacies.activeFirstNode = null;
        }
    }
};
SlormancerAncestralLegacyNodesService = __decorate([
    (0, core_1.Injectable)()
], SlormancerAncestralLegacyNodesService);
exports.SlormancerAncestralLegacyNodesService = SlormancerAncestralLegacyNodesService;
//# sourceMappingURL=slormancer-ancestral-legacy-nodes.service.js.map