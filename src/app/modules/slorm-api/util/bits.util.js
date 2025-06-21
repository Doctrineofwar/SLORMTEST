"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeBitsChunk = exports.binaryToBoolean = exports.booleanToBinary = exports.binaryToNumber = exports.numberToBinary = void 0;
function numberToBinary(value, maxBits) {
    let result = [];
    value = Math.min(Math.pow(2, maxBits), value);
    for (let i = 0; i < maxBits; i++) {
        result.push((value % 2));
        value = Math.floor(value / 2);
    }
    return result.reverse();
}
exports.numberToBinary = numberToBinary;
function binaryToNumber(bits) {
    return parseInt(bits.join(''), 2);
}
exports.binaryToNumber = binaryToNumber;
function booleanToBinary(value) {
    return [value ? 1 : 0];
}
exports.booleanToBinary = booleanToBinary;
function binaryToBoolean(bits) {
    return bits[0] === 1;
}
exports.binaryToBoolean = binaryToBoolean;
function takeBitsChunk(bits, size) {
    let chunk = bits.splice(0, size);
    if (chunk.length > 0) {
        while (chunk.length < size) {
            chunk.push(0);
        }
    }
    return chunk;
}
exports.takeBitsChunk = takeBitsChunk;
//# sourceMappingURL=bits.util.js.map