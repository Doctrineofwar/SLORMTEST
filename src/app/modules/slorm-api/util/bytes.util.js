"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeUntil = exports.splice = exports.slice = exports.bytesFindPositions = exports.bytesFindFirst = exports.bytesIndexOf = exports.bytesEqual = exports.bytesToString = exports.removeUnwantedChar = exports.byteToChar = exports.charToByte = exports.stringToBytes = exports.byteToNumber = exports.toBytes = void 0;
function toBytes(content) {
    return content.match(/.{2}/g);
}
exports.toBytes = toBytes;
function byteToNumber(byte) {
    return parseInt(byte, 16);
}
exports.byteToNumber = byteToNumber;
function stringToBytes(value) {
    return Array.from(value).map(charToByte);
}
exports.stringToBytes = stringToBytes;
function charToByte(char) {
    let code = char.charCodeAt(0).toString(16).toUpperCase();
    return code.length === 1 ? '0' + code : code;
}
exports.charToByte = charToByte;
function byteToChar(byte) {
    const code = byteToNumber(byte);
    let char;
    if (code <= 31 || code >= 127 && code <= 159) {
        char = ' ';
    }
    else {
        char = String.fromCharCode(code);
    }
    return char;
}
exports.byteToChar = byteToChar;
function removeUnwantedChar(value) {
    return value.trim().replace(/^.+\s{2,}/g, '');
}
exports.removeUnwantedChar = removeUnwantedChar;
function bytesToString(bytes) {
    return removeUnwantedChar(bytes.map(byteToChar).join(''));
}
exports.bytesToString = bytesToString;
function bytesEqual(a, b, size) {
    return Array.from(new Array(size).keys()).map(i => a[i] === b[i]).find(v => !v) === undefined;
}
exports.bytesEqual = bytesEqual;
function bytesIndexOf(data, needle) {
    let pos = null;
    for (let cursor = 0; cursor < data.length; cursor++) {
        if (bytesEqual(slice(data, cursor, needle.length), needle, needle.length)) {
            pos = cursor;
            break;
        }
    }
    return pos;
}
exports.bytesIndexOf = bytesIndexOf;
function bytesFindFirst(data, values) {
    let closest = null;
    let closestPos = data.length + 1;
    for (let value of values) {
        const pos = bytesIndexOf(data, value);
        if (pos !== null && pos < closestPos) {
            closest = value;
            closestPos = pos;
        }
    }
    return closest;
}
exports.bytesFindFirst = bytesFindFirst;
function bytesFindPositions(data, values) {
    let positions = values.map(() => -1);
    let matcheds = [];
    for (let i = 0; i < data.length; i++) {
        matcheds = [];
        values.forEach((value, index) => {
            if (data[i] === value[0]) {
                matcheds.push({ value, index, length: value.length });
            }
        });
        if (matcheds.length > 0) {
            matcheds = matcheds.sort((a, b) => a.length > b.length ? -1 : (a.length < b.length ? 1 : 0));
            const result = matcheds.find(matched => bytesEqual(matched.value, slice(data, i, matched.length), matched.length));
            if (result !== undefined) {
                positions[result.index] = i;
                i = i + result.length - 1;
            }
        }
    }
    return positions;
}
exports.bytesFindPositions = bytesFindPositions;
function slice(bytes, position, n) {
    return bytes.slice(Math.min(Math.max(position, 0), bytes.length), Math.min(Math.max(position + n, 0), bytes.length));
}
exports.slice = slice;
function splice(bytes, position, n) {
    return bytes.splice(Math.min(Math.max(position, 0), bytes.length), Math.min(Math.max(n, 0), bytes.length));
}
exports.splice = splice;
function takeUntil(data, end = null) {
    let max = end === null ? data.length : bytesIndexOf(data, end);
    let result = [];
    if (max !== null) {
        result = splice(data, 0, max);
        if (end !== null) {
            splice(data, 0, end.length);
        }
    }
    return result;
}
exports.takeUntil = takeUntil;
//# sourceMappingURL=bytes.util.js.map