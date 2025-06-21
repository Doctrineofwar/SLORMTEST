"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let ImportExportService = class ImportExportService {
    constructor(slormancerCharacterBuilderService, slormancerSaveParserService, slormancerShortDataService, jsonConverterService) {
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.slormancerSaveParserService = slormancerSaveParserService;
        this.slormancerShortDataService = slormancerShortDataService;
        this.jsonConverterService = jsonConverterService;
        const base = document.getElementsByTagName('base')[0];
        let baseHref = '/';
        if (base !== undefined) {
            const href = base.getAttribute('href');
            if (href !== null) {
                baseHref = href;
            }
        }
        this.VIEW_BUILD_PATH = window.origin + baseHref + 'slorm-planner/view/build/';
    }
    parseSaveData(content, heroClass) {
        const save = this.slormancerSaveParserService.parseSaveFile(content);
        return {
            character: this.slormancerCharacterBuilderService.getCharacterFromSave(save, heroClass),
            configuration: this.slormancerCharacterBuilderService.getConfigFromSave(save),
            layer: null,
            planner: null
        };
    }
    parseUrlData(path) {
        let result = {
            character: null,
            configuration: null,
            layer: null,
            planner: null
        };
        let key = null;
        try {
            const url = new URL(path);
            const fragments = url.pathname.split('/');
            key = (0, _slorm_api_1.valueOrNull)(fragments[fragments.length - 1]);
        }
        catch (e) { }
        if (key !== null) {
            result = this.importFromShortData(key);
        }
        return result;
    }
    parseJsonData(content) {
        const json = JSON.parse(content);
        return this.jsonConverterService.jsonToSharedData(json);
    }
    import(content, heroClass = null) {
        let data = {
            character: null,
            configuration: null,
            layer: null,
            planner: null
        };
        if (heroClass !== null) {
            try {
                data = this.parseSaveData(content, heroClass);
                return data;
            }
            catch (e) {
                console.error('Error when parsing save file : ', e);
            }
        }
        try {
            data = this.parseJsonData(atob(content));
            return data;
        }
        catch (e) { }
        try {
            data = this.parseJsonData(content);
            return data;
        }
        catch (e) { }
        data = this.importFromShortData(content);
        if (data.character === null) {
            data = this.parseUrlData(content);
        }
        return data;
    }
    exportCharacter(character) {
        return btoa(JSON.stringify(this.jsonConverterService.characterToJson(character)));
    }
    exportLayer(layer) {
        return btoa(JSON.stringify(this.jsonConverterService.layerToJson(layer)));
    }
    exportBuild(build) {
        return btoa(JSON.stringify(this.jsonConverterService.buildToJson(build)));
    }
    exportCharacterAsLink(character, config) {
        const content = this.slormancerShortDataService.characterToShortData(character, config);
        return this.VIEW_BUILD_PATH + content;
    }
    exportCharacterAsDiscordLink(name, character, config) {
        const link = this.exportCharacterAsLink(character, config);
        return '[' + name + '](' + link + ')';
    }
    importFromShortData(key) {
        return {
            ...this.slormancerShortDataService.shortDataToCharacter(key),
            layer: null,
            planner: null
        };
    }
};
ImportExportService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], ImportExportService);
exports.ImportExportService = ImportExportService;
//# sourceMappingURL=import-export.service.js.map