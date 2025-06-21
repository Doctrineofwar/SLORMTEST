"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuildFromGameComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let CreateBuildFromGameComponent = class CreateBuildFromGameComponent {
    constructor(messageService, buildStorageService, buildService, slormancerSaveParserService, slormancerCharacterBuilderService, importExportService, clipboardService) {
        this.messageService = messageService;
        this.buildStorageService = buildStorageService;
        this.buildService = buildService;
        this.slormancerSaveParserService = slormancerSaveParserService;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.importExportService = importExportService;
        this.clipboardService = clipboardService;
        this.HERO_CLASSES = [_slorm_api_1.HeroClass.Warrior, _slorm_api_1.HeroClass.Huntress, _slorm_api_1.HeroClass.Mage];
        this.created = new core_1.EventEmitter();
        this.name = 'Default name';
        this.characters = null;
        this.config = null;
        this.selectedClass = null;
    }
    parseGameSave(content) {
        try {
            const gameSave = this.slormancerSaveParserService.parseSaveFile(content);
            this.characters = {
                [_slorm_api_1.HeroClass.Warrior]: this.slormancerCharacterBuilderService.getCharacterFromSave(gameSave, _slorm_api_1.HeroClass.Warrior),
                [_slorm_api_1.HeroClass.Huntress]: this.slormancerCharacterBuilderService.getCharacterFromSave(gameSave, _slorm_api_1.HeroClass.Huntress),
                [_slorm_api_1.HeroClass.Mage]: this.slormancerCharacterBuilderService.getCharacterFromSave(gameSave, _slorm_api_1.HeroClass.Mage)
            };
            this.config = this.slormancerCharacterBuilderService.getConfigFromSave(gameSave);
            this.selectedClass = null;
        }
        catch (e) {
            console.error(e);
            this.messageService.error('An error occured while parsing this save file');
        }
    }
    getLevel(heroClass) {
        let result = '';
        if (this.characters !== null) {
            result = this.characters[heroClass].level.toString();
        }
        return result;
    }
    createBuild() {
        if (this.selectedClass !== null && this.characters !== null) {
            const config = this.config === null ? _slorm_api_1.DEFAULT_CONFIG : { ..._slorm_api_1.DEFAULT_CONFIG, ...this.config };
            const build = this.buildService.createBuildWithCharacter(this.name, 'New layer', this.characters[this.selectedClass], config);
            this.buildStorageService.addBuild(build);
            this.created.emit();
        }
    }
    copyExternalLink() {
        if (this.selectedClass !== null && this.characters !== null) {
            let configuration = _slorm_api_1.DEFAULT_CONFIG;
            if (this.config !== null) {
                configuration = { ...configuration, ...this.config };
            }
            const link = this.importExportService.exportCharacterAsLink(this.characters[this.selectedClass], configuration);
            if (this.clipboardService.copyToClipboard(link)) {
                this.messageService.message('Link copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy link to clipboard');
            }
        }
    }
    copyDiscordLink() {
        if (this.selectedClass !== null && this.characters !== null) {
            let configuration = _slorm_api_1.DEFAULT_CONFIG;
            if (this.config !== null) {
                configuration = { ...configuration, ...this.config };
            }
            const link = this.importExportService.exportCharacterAsDiscordLink(this.name, this.characters[this.selectedClass], configuration);
            if (this.clipboardService.copyToClipboard(link)) {
                this.messageService.message('Discord link copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy discord link to clipboard');
            }
        }
    }
};
__decorate([
    (0, core_1.Output)()
], CreateBuildFromGameComponent.prototype, "created", void 0);
__decorate([
    (0, core_1.Input)()
], CreateBuildFromGameComponent.prototype, "name", void 0);
CreateBuildFromGameComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-create-build-from-game',
        templateUrl: './create-build-from-game.component.html',
        styleUrls: ['./create-build-from-game.component.scss']
    })
], CreateBuildFromGameComponent);
exports.CreateBuildFromGameComponent = CreateBuildFromGameComponent;
//# sourceMappingURL=create-build-from-game.component.js.map