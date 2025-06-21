"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnhancementRune = exports.isActivationRune = exports.isEffectRune = exports.RuneType = void 0;
var RuneType;
(function (RuneType) {
    RuneType[RuneType["Activation"] = 0] = "Activation";
    RuneType[RuneType["Effect"] = 1] = "Effect";
    RuneType[RuneType["Enhancement"] = 2] = "Enhancement";
})(RuneType = exports.RuneType || (exports.RuneType = {}));
function isEffectRune(rune) {
    return rune.type === RuneType.Effect;
}
exports.isEffectRune = isEffectRune;
function isActivationRune(rune) {
    return rune.type === RuneType.Activation;
}
exports.isActivationRune = isActivationRune;
function isEnhancementRune(rune) {
    return rune.type === RuneType.Enhancement;
}
exports.isEnhancementRune = isEnhancementRune;
//# sourceMappingURL=rune-type.js.map