"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBuffService = void 0;
const core_1 = require("@angular/core");
let SlormancerBuffService = class SlormancerBuffService {
    constructor(slormancerDataService, slormancerTemplateService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerTemplateService = slormancerTemplateService;
    }
    getBuff(ref) {
        const gameDataBuff = this.slormancerDataService.getGameDataBuff(ref);
        let buff = null;
        if (gameDataBuff !== null) {
            // aucune data dans les json du jeu mais par chance @ est toujours à 50% (pour le moment)
            const template = gameDataBuff.EN_DESCRIPTION.replace('@', '50');
            buff = {
                name: gameDataBuff.EN_NAME,
                description: this.slormancerTemplateService.prepareBuffTemplate(template),
                icon: 'buff/' + ref
            };
        }
        return buff;
    }
};
SlormancerBuffService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBuffService);
exports.SlormancerBuffService = SlormancerBuffService;
//# sourceMappingURL=slormancer-buff.service.js.map