"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerItemParserService = void 0;
const core_1 = require("@angular/core");
const parse_util_1 = require("../../util/parse.util");
const utils_1 = require("../../util/utils");
let SlormancerItemParserService = class SlormancerItemParserService {
    constructor() {
        this.AFFIXE_RARITIES = ['N', 'D', 'M', 'R', 'E', 'L'];
        this.ENCHANTMENT_TARGETS = ['MA', 'AT', 'RP'];
    }
    isRessource(value) {
        return value.startsWith('0') && (0, utils_1.splitData)(value, '.').length > 5;
    }
    isEquipable(value) {
        return !value.startsWith('0') && value.length > 1;
    }
    isAffixe(value) {
        const length = value.split('.').length;
        return length === 6 || length === 5 || length === 4;
    }
    isEnchantment(value) {
        return value.split('.').length === 3;
    }
    parseAffixe(affixe) {
        const [rarity, type, value, locked, pure, _] = (0, parse_util_1.strictSplit)(affixe, '.', { min: 4, max: 6 });
        if (this.AFFIXE_RARITIES.indexOf(rarity) === -1) {
            throw new Error('parse affixe error : Unknown rarity "' + rarity + '"');
        }
        let parsedPureValue = null;
        if (pure !== undefined) {
            parsedPureValue = (0, parse_util_1.strictParseInt)(pure);
        }
        return {
            rarity: rarity,
            type: (0, parse_util_1.strictParseInt)(type),
            value: (0, parse_util_1.strictParseInt)(value),
            locked: locked === '1',
            pure: parsedPureValue
        };
    }
    parseEnchantment(affixe) {
        const [target, type, value] = (0, parse_util_1.strictSplit)(affixe, '.', 3);
        if (this.ENCHANTMENT_TARGETS.indexOf(target) === -1) {
            throw new Error('parse enchantment error : Unknown target "' + target + '"');
        }
        return {
            target: target,
            type: (0, parse_util_1.strictParseInt)(type),
            value: (0, parse_util_1.strictParseInt)(value)
        };
    }
    parseEquipable(source) {
        const [base, ...bonuses] = source.split(':');
        const [generic, xp] = base.split('-');
        const data = (0, parse_util_1.toNumberArray)(generic, '.', 6);
        let potentialData = xp.split('.');
        let remainingGrafts = potentialData[potentialData.length - 1];
        let rarity = potentialData[potentialData.length - 2];
        let potential = potentialData.length === 4 ? potentialData[0] + '.' + potentialData[1] : potentialData[0];
        const item = {
            generic_1: data[0],
            slot: data[1],
            level: data[2],
            reinforcement: data[5],
            potential: (0, parse_util_1.strictParseFloat)(potential),
            rarity: rarity === '' ? 0 : (0, parse_util_1.strictParseInt)(rarity),
            generic_4: data[3],
            grafts: (0, parse_util_1.strictParseInt)(remainingGrafts),
            affixes: bonuses.filter(a => this.isAffixe(a)).map(a => this.parseAffixe(a)),
            enchantments: bonuses.filter(a => this.isEnchantment(a)).map(a => this.parseEnchantment(a))
        };
        return item;
    }
    parseRessource(source) {
        const data = (0, parse_util_1.toNumberArray)(source, '.');
        return {
            quantity: data[4],
            quality: data[2],
            type: data[1] + '.' + data[3]
        };
    }
    parseItem(value) {
        let item = null;
        if (this.isRessource(value)) {
            item = this.parseRessource(value);
        }
        else if (this.isEquipable(value)) {
            item = this.parseEquipable(value);
        }
        return item;
    }
};
SlormancerItemParserService = __decorate([
    (0, core_1.Injectable)()
], SlormancerItemParserService);
exports.SlormancerItemParserService = SlormancerItemParserService;
//# sourceMappingURL=slormancer-item-parser.service.js.map