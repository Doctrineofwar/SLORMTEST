"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mult = exports.add = exports.list = exports.floor = exports.round = exports.bankerRound = void 0;
const utils_1 = require("./utils");
function bankerRound(value, decimals = 0) {
    let result = value;
    if (typeof result === 'number') {
        const decal = (0, utils_1.valueOrDefault)(POW_10[decimals], 1);
        const valueToRound = round(result * decal, 6);
        var r = Math.round(valueToRound);
        result = ((((((valueToRound > 0) ? valueToRound : -valueToRound) % 1) === 0.5) ? (((0 === (r % 2))) ? r : (r - 1)) : r) / decal);
    }
    else {
        result = { min: bankerRound(result.min, decimals), max: bankerRound(result.max, decimals) };
    }
    return result;
}
exports.bankerRound = bankerRound;
const POW_10 = {
    0: 1,
    1: 10,
    2: 100,
    3: 1000,
    4: 10000,
    5: 100000,
    6: 1000000
};
function round(value, decimals = 0) {
    const decal = (0, utils_1.valueOrDefault)(POW_10[decimals], 1);
    return (typeof value === 'number'
        ? Math.round(value * decal) / decal
        : { min: Math.round(value.min * decal) / decal, max: Math.round(value.max * decal) / decal });
}
exports.round = round;
function floor(value, decimals = 0) {
    const decal = (0, utils_1.valueOrDefault)(POW_10[decimals], 1);
    return Math.floor(value * decal) / decal;
}
exports.floor = floor;
/**
 *
 * @param min
 * @param max
 * @returns list(min, max) or list(0, min - 1) if max is not given
 */
function list(min, max = null) {
    if (max === null) {
        max = min - 1;
        min = 0;
    }
    return Array.from(new Array(max - min + 1).keys()).map(v => min + v);
}
exports.list = list;
function add(a, b, forceMinMax = false) {
    let result;
    const aIsNumber = typeof a === 'number';
    const bIsNumber = typeof b === 'number';
    if (!forceMinMax && aIsNumber && bIsNumber) {
        result = a + b;
    }
    else {
        result = { min: 0, max: 0 };
        if (aIsNumber) {
            result.min += a;
            result.max += a;
        }
        else {
            result.min += a.min;
            result.max += a.max;
        }
        if (bIsNumber) {
            result.min += b;
            result.max += b;
        }
        else {
            result.min += b.min;
            result.max += b.max;
        }
    }
    return result;
}
exports.add = add;
function mult(base, ...multipliers) {
    let result = typeof base === 'number' ? base : { ...base };
    for (const multiplier of multipliers) {
        if (typeof result === 'number') {
            result = result * (100 + multiplier) / 100;
        }
        else {
            result.min = result.min * (100 + multiplier) / 100;
            result.max = result.max * (100 + multiplier) / 100;
        }
    }
    return result;
}
exports.mult = mult;
//# sourceMappingURL=math.util.js.map