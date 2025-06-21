"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildService = void 0;
const core_1 = require("@angular/core");
const environment_1 = require("../../../../environments/environment");
let BuildService = class BuildService {
    constructor(slormancerCharacterBuilderService) {
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
    }
    createBuild(heroClass, name, configuration) {
        return {
            version: environment_1.environment.version,
            name,
            heroClass,
            layers: [],
            configuration
        };
    }
    createBuildWithCharacter(buildName, layerName, character, configuration) {
        const build = {
            version: environment_1.environment.version,
            name: buildName,
            heroClass: character.heroClass,
            layers: [],
            configuration
        };
        const clone = this.slormancerCharacterBuilderService.getCharacterClone(character);
        clone.importVersion = null;
        clone.fromCorrupted = false;
        this.addLayer(build, layerName, clone);
        return build;
    }
    addLayer(build, name, character = null) {
        const layer = {
            name,
            character: character !== null ? character : this.slormancerCharacterBuilderService.getCharacter(build.heroClass)
        };
        build.layers.push(layer);
        return layer;
    }
    duplicateLayer(build, layer, name) {
        return this.addLayer(build, name, this.slormancerCharacterBuilderService.getCharacterClone(layer.character));
    }
    deleteLayer(build, layer) {
        const index = build.layers.indexOf(layer);
        if (index !== -1) {
            build.layers.splice(index, 1);
        }
    }
};
BuildService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], BuildService);
exports.BuildService = BuildService;
//# sourceMappingURL=build.service.js.map