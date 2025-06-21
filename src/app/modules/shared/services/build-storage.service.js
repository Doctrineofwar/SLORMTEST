"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildStorageService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const environment_1 = require("../../../../environments/environment");
let BuildStorageService = class BuildStorageService {
    constructor(jsonConverterService, buildRetrocompatibilityService, slormancerCharacterUpdaterService) {
        this.jsonConverterService = jsonConverterService;
        this.buildRetrocompatibilityService = buildRetrocompatibilityService;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.MAX_LAYERS = 10;
        this.BUILDS_STORAGE_KEY = 'builds';
        this.BETA_BUILDS_STORAGE_KEY = 'beta-builds';
        this.CURRENT_BUILD_STORAGE_KEY = 'current-build';
        this.CURRENT_LAYER_STORAGE_KEY = 'current-layer';
        this.builds = [];
        this.build = null;
        this.layer = null;
        this.crash = null;
        this.buildChanged = new rxjs_1.BehaviorSubject(null);
        this.layerChanged = new rxjs_1.BehaviorSubject(null);
        this.errorChanged = new rxjs_1.BehaviorSubject(null);
        this.saveTrigger = new rxjs_1.Subject();
        this.reload();
        this.oldFormatTransition();
        this.saveTrigger
            .pipe((0, rxjs_1.debounceTime)(500)) // retirer le debounce, et voir si je peux pas faire mieux
            .subscribe(() => this.saveToStorage());
    }
    getCurrentLayerIndex() {
        const storageData = localStorage.getItem(this.CURRENT_LAYER_STORAGE_KEY);
        const index = storageData === null ? 0 : parseInt(storageData, 10);
        return Number.isNaN(index) ? 0 : index;
    }
    oldFormatTransition() {
        const oldKey = 'slorm-planner-build';
        const oldData = localStorage.getItem(oldKey);
        if (oldData !== null && this.builds.length === 0) {
            let build = null;
            try {
                build = this.jsonConverterService.jsonToBuild(JSON.parse(oldData));
            }
            catch (e) {
                console.error('Failed to convert build from old format : ', e);
            }
            if (build !== null) {
                this.addBuild(build);
                localStorage.removeItem(oldKey);
                this.saveToStorage();
            }
        }
    }
    reload() {
        this.builds = [];
        this.build = null;
        this.layer = null;
        this.crash = null;
        let buildsData = null;
        let buildStorageKey = null;
        let buildData = null;
        let layerIndex = null;
        try {
            buildsData = localStorage.getItem(this.BUILDS_STORAGE_KEY);
            buildStorageKey = localStorage.getItem(this.CURRENT_BUILD_STORAGE_KEY);
            layerIndex = this.getCurrentLayerIndex();
            if (buildsData !== null) {
                this.builds = JSON.parse(buildsData);
            }
            const betaBuildsData = localStorage.getItem(this.BETA_BUILDS_STORAGE_KEY);
            if (betaBuildsData) {
                this.builds.push(...JSON.parse(betaBuildsData));
                this.saveToStorage();
                localStorage.removeItem(this.BETA_BUILDS_STORAGE_KEY);
            }
            if (buildStorageKey !== null) {
                buildData = localStorage.getItem(buildStorageKey);
                if (buildData !== null) {
                    this.build = this.jsonConverterService.jsonToBuild(JSON.parse(buildData));
                    this.buildRetrocompatibilityService.updateToLatestVersion(this.build);
                }
            }
            if (this.build !== null) {
                let layer = (0, _slorm_api_1.valueOrDefault)(this.build.layers[layerIndex], this.build.layers[0]);
                if (layer !== undefined) {
                    this.layer = layer;
                }
                for (const layer of this.build.layers) {
                    this.slormancerCharacterUpdaterService.updateCharacter(layer.character, this.build.configuration);
                }
            }
        }
        catch (e) {
            console.error('Failed to reload build : ', e);
            this.crash = this.buildCrashReport(e, buildsData, buildStorageKey, buildData, layerIndex);
        }
        this.pushChanges(this.build, this.layer, this.crash);
    }
    buildCrashReport(error, builds, buildKey, build, layerIndex) {
        let message = 'unknown error';
        let stack = null;
        if (error) {
            if (error instanceof Error) {
                message = error.message;
                stack = error.stack ?? null;
            }
            else if (typeof error === 'object' && 'constructor' in error) {
                message = 'unknown error of type ' + error.constructor.name;
            }
        }
        return {
            message,
            stack,
            builds,
            buildKey,
            build,
            layerIndex
        };
    }
    saveToStorage() {
        localStorage.setItem(this.BUILDS_STORAGE_KEY, JSON.stringify(this.builds));
        const currentKey = localStorage.getItem(this.CURRENT_BUILD_STORAGE_KEY);
        if (currentKey !== null && this.build !== null) {
            localStorage.setItem(currentKey, JSON.stringify(this.jsonConverterService.buildToJson(this.build)));
            let layerIndex = 0;
            if (this.layer !== null) {
                layerIndex = this.build.layers.indexOf(this.layer);
            }
            localStorage.setItem(this.CURRENT_LAYER_STORAGE_KEY, layerIndex < 0 ? '0' : layerIndex.toString());
        }
    }
    pushChanges(build, layer, error) {
        this.buildChanged.next(build);
        this.layerChanged.next(layer);
        this.errorChanged.next(error);
    }
    pushCrashReport(error) {
        if (this.crash === null) {
            const buildsData = localStorage.getItem(this.BUILDS_STORAGE_KEY);
            const buildStorageKey = localStorage.getItem(this.CURRENT_BUILD_STORAGE_KEY);
            const layerIndex = this.getCurrentLayerIndex();
            const buildData = buildStorageKey === null ? null : localStorage.getItem(buildStorageKey);
            this.crash = this.buildCrashReport(error, buildsData, buildStorageKey, buildData, layerIndex);
            this.errorChanged.next(this.crash);
        }
    }
    saveBuild(instantSave = false) {
        if (this.build !== null) {
            for (const layer of this.build.layers) {
                this.slormancerCharacterUpdaterService.updateCharacter(layer.character, this.build.configuration);
            }
            const buildPreview = this.getBuildPreview();
            if (buildPreview !== null) {
                buildPreview.name = this.build.name;
            }
            if (this.build !== null) {
                let layerIndex = this.getCurrentLayerIndex();
                const currentLayerIndex = this.layer === null ? -1 : this.build.layers.indexOf(this.layer);
                layerIndex = currentLayerIndex !== -1 ? currentLayerIndex : Math.min(layerIndex, this.build.layers.length - 1);
                this.layer = (0, _slorm_api_1.valueOrNull)(this.build.layers[layerIndex]);
            }
            if (instantSave) {
                this.saveToStorage();
            }
            else {
                this.saveTrigger.next();
            }
            this.pushChanges(this.build, this.layer, this.crash);
        }
    }
    saveLayer() {
        if (this.build !== null && this.layer !== null) {
            this.slormancerCharacterUpdaterService.updateCharacter(this.layer.character, this.build.configuration);
            this.saveTrigger.next();
        }
    }
    loadBuild(preview) {
        localStorage.setItem(this.CURRENT_BUILD_STORAGE_KEY, preview.storageKey);
        localStorage.setItem(this.CURRENT_LAYER_STORAGE_KEY, '0');
        this.reload();
    }
    deleteBuild() {
        const currentKey = localStorage.getItem(this.CURRENT_BUILD_STORAGE_KEY);
        if (currentKey !== null) {
            const index = this.builds.findIndex(preview => preview.storageKey === currentKey);
            if (index !== -1) {
                this.builds.splice(index, 1);
                localStorage.removeItem(currentKey);
                localStorage.removeItem(this.CURRENT_BUILD_STORAGE_KEY);
                this.saveToStorage();
                const newIndex = Math.min(index, this.builds.length - 1);
                const preview = this.builds[newIndex];
                if (preview) {
                    this.loadBuild(preview);
                }
                else {
                    this.reload();
                }
            }
        }
    }
    loadLayer(layer) {
        if (this.build !== null) {
            const layerIndex = this.build.layers.indexOf(layer);
            if (layerIndex !== -1) {
                this.layer = layer;
                this.saveBuild();
            }
        }
    }
    addBuild(build) {
        if (build !== null) {
            this.buildRetrocompatibilityService.updateToLatestVersion(build);
        }
        const preview = {
            heroClass: build.heroClass,
            name: build.name,
            storageKey: 'build-' + new Date().getTime(),
            version: environment_1.environment.version
        };
        this.builds.push(preview);
        this.build = build;
        this.layer = (0, _slorm_api_1.valueOrDefault)(build.layers[0], null);
        localStorage.setItem(this.CURRENT_BUILD_STORAGE_KEY, preview.storageKey);
        this.saveBuild(true);
    }
    getBuilds() {
        return this.builds;
    }
    getBuild() {
        return this.build;
    }
    getBuildPreview() {
        const currentKey = localStorage.getItem(this.CURRENT_BUILD_STORAGE_KEY);
        return (0, _slorm_api_1.valueOrNull)(this.builds.find(preview => preview.storageKey === currentKey));
    }
    getLayer() {
        return this.layer;
    }
    hasRoomForAnotherLayer(character = null) {
        return this.build === null
            || (this.build.layers.length < this.MAX_LAYERS
                && (character === null || this.build.heroClass === character.heroClass));
    }
};
BuildStorageService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], BuildStorageService);
exports.BuildStorageService = BuildStorageService;
//# sourceMappingURL=build-storage.service.js.map