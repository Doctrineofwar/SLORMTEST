"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictParseFloat = exports.parseIntOrdefault = exports.strictParseInt = exports.toFloatArray = exports.toNumberArray = exports.strictSplit = exports.toWeapon = exports.toHeroes = exports.mapHeroesArray = exports.splitHeroesData = void 0;
function splitHeroesData(data) {
    const result = data.split('|');
    if (result.length !== 3) {
        throw new Error('Split hero data failed : expected "' + data + '" to have 3 values separated by |, but got ' + result.length);
    }
    return result;
}
exports.splitHeroesData = splitHeroesData;
function mapHeroesArray(data, map) {
    return [
        map(data[0]),
        map(data[1]),
        map(data[2])
    ];
}
exports.mapHeroesArray = mapHeroesArray;
function toHeroes(data) {
    return {
        0: data[0],
        1: data[1],
        2: data[2]
    };
}
exports.toHeroes = toHeroes;
function toWeapon(data, id) {
    const [basic, primordial] = strictSplit(data, '/', 2);
    const basicData = toFloatArray(basic, ':', 4);
    const primordialData = toFloatArray(primordial, ':', 4);
    return {
        id,
        basic: { obtained: basicData[0] === 1, experience: basicData[1], kills: basicData[2], generic4: basicData[3] },
        primordial: { obtained: primordialData[0] === 1, experience: primordialData[1], kills: primordialData[2], generic4: primordialData[3] }
    };
}
exports.toWeapon = toWeapon;
function strictSplit(data, separator = ',', expected = null) {
    const array = data.split(separator);
    if (expected !== null) {
        if (typeof expected === "number") {
            if (array.length !== expected) {
                throw new Error('Strict split error : expected "' + data + '" splitted with "' + separator + '" to have ' + expected + ' values, but got ' + array.length);
            }
        }
        else if (array.length < expected.min || array.length > expected.max) {
            throw new Error('Strict split error : expected "' + data + '" splitted with "' + separator + '" to have between ' + expected.min + ' and ' + expected.max + ' values, but got ' + array.length);
        }
    }
    return array;
}
exports.strictSplit = strictSplit;
function toNumberArray(data, separator = ',', expected = null) {
    return strictSplit(data, separator, expected).map(strictParseInt);
}
exports.toNumberArray = toNumberArray;
function toFloatArray(data, separator = ',', expected = null) {
    return strictSplit(data, separator, expected).map(strictParseFloat);
}
exports.toFloatArray = toFloatArray;
function strictParseInt(data) {
    data = data.replace(/^0*([0-9]+.+?)$/, '$1');
    let value = parseInt(data, 10);
    if (value > Number.MAX_SAFE_INTEGER) {
        value = Number.MAX_SAFE_INTEGER;
    }
    else if (data !== value.toString()) {
        throw new Error('Int parse error : expected "' + data + '" but got "' + value + '"');
    }
    return value;
}
exports.strictParseInt = strictParseInt;
function parseIntOrdefault(data, defaultValue) {
    const result = parseInt(data);
    return isNaN(result) ? defaultValue : result;
}
exports.parseIntOrdefault = parseIntOrdefault;
function strictParseFloat(data) {
    data = data.replace(/^0*([0-9]+.+?)0*$/, '$1');
    if (data.endsWith('.')) {
        data = data.slice(0, data.length - 1);
    }
    let value = parseFloat(data);
    if (value > Number.MAX_SAFE_INTEGER) {
        value = Number.MAX_SAFE_INTEGER;
    }
    else if (data !== value.toString()) {
        throw new Error('Float parse error : expected "' + data + '" but got "' + value + '"');
    }
    return value;
}
exports.strictParseFloat = strictParseFloat;
//# sourceMappingURL=parse.util.js.map