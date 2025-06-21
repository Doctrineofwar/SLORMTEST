"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetOverlay = exports.adaptOverlay = exports.getOlorinUltimatumBonusLevel = exports.numberToString = exports.warnIfEqual = exports.minAndMax = exports.compareVersions = exports.isDamageType = exports.getBaseCraftValue = exports.getCraftValue = exports.isNotEffectValueSynergy = exports.isEffectValueSynergy = exports.isEffectValueConstant = exports.isEffectValueVariable = exports.emptyStringToNull = exports.splitFloatData = exports.splitNumberData = exports.removeEmptyValues = exports.splitData = exports.lastValue = exports.lastIndex = exports.firstValue = exports.findFirst = exports.notEmptyOrNull = exports.valueOrNull = exports.valueOrDefault = exports.compare = exports.compareRarities = exports.compareString = exports.isFirst = exports.isNotNullOrUndefined = exports.getAllLegendaryEffects = exports.getAllItems = exports.debugNumber = void 0;
const environment_1 = require("src/environments/environment");
const effect_value_type_1 = require("../model/content/enum/effect-value-type");
const rarity_1 = require("../model/content/enum/rarity");
function debugNumber(value) {
    return typeof value === 'number' ? value.toString() : value.min + '-' + value.max;
}
exports.debugNumber = debugNumber;
function getAllItems(gear) {
    return [
        gear.amulet,
        gear.belt,
        gear.body,
        gear.boot,
        gear.bracer,
        gear.cape,
        gear.glove,
        gear.helm,
        gear.ring_l,
        gear.ring_r,
        gear.shoulder,
    ].filter(isNotNullOrUndefined);
}
exports.getAllItems = getAllItems;
function getAllLegendaryEffects(gear) {
    return getAllItems(gear)
        .map(item => item.legendaryEffect)
        .filter(isNotNullOrUndefined);
}
exports.getAllLegendaryEffects = getAllLegendaryEffects;
function isNotNullOrUndefined(value) {
    return value !== null && value !== undefined;
}
exports.isNotNullOrUndefined = isNotNullOrUndefined;
function isFirst(value, index, array, compare = (a, b) => a === b) {
    const found = array.find(v => compare(v, value));
    return found !== undefined && array.indexOf(found) === index;
}
exports.isFirst = isFirst;
function compareString(a, b) {
    if (a === null) {
        a = '';
    }
    if (b === null) {
        b = '';
    }
    return a.localeCompare(b);
}
exports.compareString = compareString;
function compareRarities(a, b) {
    let numA = 1;
    let numB = 1;
    if (a === rarity_1.Rarity.Legendary)
        numA = 5;
    if (a === rarity_1.Rarity.Epic)
        numA = 4;
    if (a === rarity_1.Rarity.Rare)
        numA = 3;
    if (a === rarity_1.Rarity.Magic)
        numA = 2;
    if (a === rarity_1.Rarity.Defensive)
        numA = 1;
    if (a === rarity_1.Rarity.Normal)
        numA = 0;
    if (b === rarity_1.Rarity.Legendary)
        numB = 5;
    if (b === rarity_1.Rarity.Epic)
        numB = 4;
    if (b === rarity_1.Rarity.Rare)
        numB = 3;
    if (b === rarity_1.Rarity.Magic)
        numB = 2;
    if (b === rarity_1.Rarity.Defensive)
        numB = 1;
    if (b === rarity_1.Rarity.Normal)
        numB = 0;
    return compare(numA, numB);
}
exports.compareRarities = compareRarities;
function compare(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
}
exports.compare = compare;
function valueOrDefault(value, defaultvalue) {
    return isNotNullOrUndefined(value) ? value : defaultvalue;
}
exports.valueOrDefault = valueOrDefault;
function valueOrNull(value) {
    return isNotNullOrUndefined(value) ? value : null;
}
exports.valueOrNull = valueOrNull;
function notEmptyOrNull(value) {
    return isNotNullOrUndefined(value) && value.length > 0 ? value : null;
}
exports.notEmptyOrNull = notEmptyOrNull;
function findFirst(text, values) {
    let closest = null;
    let closestPos = text.length + 1;
    for (let value of values) {
        const pos = text.indexOf(value);
        if (pos !== -1 && pos < closestPos) {
            closest = value;
            closestPos = pos;
        }
    }
    return closest;
}
exports.findFirst = findFirst;
function firstValue(values) {
    let value = null;
    if (values !== null) {
        const keys = Object.keys(values);
        const index = keys[0];
        if (index) {
            value = index ? valueOrNull(values[parseInt(index)]) : null;
        }
    }
    return value;
}
exports.firstValue = firstValue;
function lastIndex(values) {
    let index = null;
    if (values !== null) {
        const keys = Object.keys(values);
        const valueIndex = valueOrNull(keys[keys.length - 1]);
        if (valueIndex) {
            index = parseInt(valueIndex);
        }
    }
    return index;
}
exports.lastIndex = lastIndex;
function lastValue(values) {
    let value = null;
    if (values !== null) {
        const keys = Object.keys(values);
        const index = keys[keys.length - 1];
        if (index) {
            value = index ? valueOrNull(values[parseInt(index)]) : null;
        }
    }
    return value;
}
exports.lastValue = lastValue;
function splitData(data, separator = '|') {
    return isNotNullOrUndefined(data) && data.length > 0 ? data.split(separator) : [];
}
exports.splitData = splitData;
function removeEmptyValues(data) {
    return data.filter(isNotNullOrUndefined).filter(v => v.length > 0);
}
exports.removeEmptyValues = removeEmptyValues;
function splitNumberData(data, separator = '|') {
    return splitData(data, separator).map(v => parseInt(v)).map(v => isNaN(v) ? null : v);
}
exports.splitNumberData = splitNumberData;
function splitFloatData(data, separator = '|') {
    return splitData(data, separator).map(v => parseFloat(v)).map(v => isNaN(v) ? null : v);
}
exports.splitFloatData = splitFloatData;
function emptyStringToNull(data) {
    return data.map(s => typeof s === 'string' && s.length === 0 ? null : s);
}
exports.emptyStringToNull = emptyStringToNull;
function isEffectValueVariable(value) {
    return value.type === effect_value_type_1.EffectValueType.Variable;
}
exports.isEffectValueVariable = isEffectValueVariable;
function isEffectValueConstant(value) {
    return value.type === effect_value_type_1.EffectValueType.Constant;
}
exports.isEffectValueConstant = isEffectValueConstant;
function isEffectValueSynergy(value) {
    return value.type === effect_value_type_1.EffectValueType.Synergy;
}
exports.isEffectValueSynergy = isEffectValueSynergy;
function isNotEffectValueSynergy(value) {
    return value.type !== effect_value_type_1.EffectValueType.Synergy;
}
exports.isNotEffectValueSynergy = isNotEffectValueSynergy;
function getCraftValue(craftedValue, craft, defaultValue = 0) {
    const found = craftedValue.possibleCraftedValues.find(v => v.craft === craft);
    return found ? found.value : defaultValue;
}
exports.getCraftValue = getCraftValue;
function getBaseCraftValue(craftedValue, craft, defaultValue = 0) {
    const found = craftedValue.basePossibleCraftedValues.find(v => v.craft === craft);
    return found ? found.value : defaultValue;
}
exports.getBaseCraftValue = getBaseCraftValue;
function isDamageType(stat) {
    return stat === 'elemental_damage'
        || stat === 'physical_damage'
        || stat === 'basic_damage'
        || stat === 'weapon_damage'
        || stat === 'bleed_damage'
        || stat === 'damage'
        || stat === 'ravenous_dagger_damage'
        || stat === 'trap_damage'
        || stat === 'poison_damage'
        || stat === 'righteous_sunlight_damage'
        || stat === 'butterfly_elemental_damage'
        || stat === 'wandering_arrow_damage';
}
exports.isDamageType = isDamageType;
/**
 *
 * @param a:  version as string
 * @param b:  version as string
 * @returns > 0 if a > b, 0 if a and b are equal, < 0 if a < b
 */
function compareVersions(a, b) {
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const minLength = Math.min(segmentsA.length, segmentsB.length);
    let diff;
    for (let i = 0; i < minLength; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}
exports.compareVersions = compareVersions;
function minAndMax(min, value, max) {
    return Math.max(Math.min(max, value), min);
}
exports.minAndMax = minAndMax;
function warnIfEqual(a, b, ...message) {
    if (a === b && environment_1.environment.debug) {
        console.warn(...message);
    }
}
exports.warnIfEqual = warnIfEqual;
function numberToString(value) {
    return value.toLocaleString().replace(/(\s)/g, '$1$1');
}
exports.numberToString = numberToString;
function getOlorinUltimatumBonusLevel(gear) {
    return getAllLegendaryEffects(gear)
        .filter(legendaryEffect => legendaryEffect.id === 147)
        .map(legendaryEffect => legendaryEffect.effects[0]?.effect.value)[0] ?? 0;
}
exports.getOlorinUltimatumBonusLevel = getOlorinUltimatumBonusLevel;
function adaptOverlay(element) {
    const clientRect = element.getBoundingClientRect();
    const screenHeight = window.innerHeight;
    if (clientRect.top < 0) {
        const cdk = document.getElementsByClassName('cdk-overlay-pane');
        for (const element of Array.from(cdk)) {
            if (!element.classList.contains('force-top')) {
                element.classList.add('force-top');
            }
        }
    }
    else if (clientRect.bottom > screenHeight) {
        const cdk = document.getElementsByClassName('cdk-overlay-pane');
        for (const element of Array.from(cdk)) {
            if (!element.classList.contains('force-bottom')) {
                element.classList.add('force-bottom');
            }
        }
    }
}
exports.adaptOverlay = adaptOverlay;
function resetOverlay() {
    const cdk = document.getElementsByClassName('cdk-overlay-pane');
    for (const element of Array.from(cdk)) {
        element.classList.remove('force-bottom');
        element.classList.remove('force-top');
    }
}
exports.resetOverlay = resetOverlay;
//# sourceMappingURL=utils.js.map