"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerCompressorService = void 0;
const core_1 = require("@angular/core");
const bits_util_1 = require("../../util/bits.util");
let SlormancerCompressorService = class SlormancerCompressorService {
    constructor() {
        this.CHUNK_SIZE = 6;
        this.CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789$';
    }
    compressBinary(bits) {
        let result = '';
        const cursor = [...bits];
        let chunk = (0, bits_util_1.takeBitsChunk)(cursor, this.CHUNK_SIZE);
        while (chunk.length > 0) {
            const index = (0, bits_util_1.binaryToNumber)(chunk);
            result = result + this.CHARACTERS[index];
            chunk = (0, bits_util_1.takeBitsChunk)(cursor, this.CHUNK_SIZE);
        }
        return result;
    }
    decompressBinary(data) {
        return data.split('')
            .map(c => (0, bits_util_1.numberToBinary)(this.CHARACTERS.indexOf(c), this.CHUNK_SIZE))
            .flat();
    }
};
SlormancerCompressorService = __decorate([
    (0, core_1.Injectable)()
], SlormancerCompressorService);
exports.SlormancerCompressorService = SlormancerCompressorService;
//# sourceMappingURL=slormancer-compressor.service.js.map