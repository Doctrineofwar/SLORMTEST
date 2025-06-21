"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterPathResolver = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let CharacterPathResolver = class CharacterPathResolver {
    constructor(importExportService, messageService, router) {
        this.importExportService = importExportService;
        this.messageService = messageService;
        this.router = router;
    }
    back() {
        this.router.navigateByUrl('/');
    }
    resolve(route) {
        return new Promise(resolve => {
            const key = (0, _slorm_api_1.valueOrNull)(route.params['key']);
            if (key !== null) {
                const sharedData = this.importExportService.import(key);
                if (sharedData.character !== null) {
                    resolve(sharedData);
                }
                else {
                    this.messageService.error('Failed to load shared character');
                    this.back();
                }
            }
            else {
                this.back();
            }
        });
    }
};
CharacterPathResolver = __decorate([
    (0, core_1.Injectable)()
], CharacterPathResolver);
exports.CharacterPathResolver = CharacterPathResolver;
//# sourceMappingURL=character-path.resolver.js.map