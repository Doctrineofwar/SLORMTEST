"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MANA_SKILL_COST_TYPES = exports.LIFE_SKILL_COST_TYPES = exports.ALL_SKILL_COST_TYPES = exports.SkillCostType = void 0;
var SkillCostType;
(function (SkillCostType) {
    SkillCostType["Life"] = "life";
    SkillCostType["LifeSecond"] = "life_second";
    SkillCostType["LifeLockFlat"] = "life_lock_flat";
    SkillCostType["LifeLock"] = "life_lock";
    SkillCostType["LifePercent"] = "life_percent";
    SkillCostType["Mana"] = "mana";
    SkillCostType["ManaSecond"] = "mana_second";
    SkillCostType["ManaLockFlat"] = "mana_lock_flat";
    SkillCostType["ManaLock"] = "mana_lock";
    SkillCostType["ManaPercent"] = "mana_percent";
    SkillCostType["None"] = "none";
})(SkillCostType = exports.SkillCostType || (exports.SkillCostType = {}));
exports.ALL_SKILL_COST_TYPES = [
    SkillCostType.Life,
    SkillCostType.LifeSecond,
    SkillCostType.LifeLockFlat,
    SkillCostType.LifeLock,
    SkillCostType.LifePercent,
    SkillCostType.Mana,
    SkillCostType.ManaSecond,
    SkillCostType.ManaLock,
    SkillCostType.ManaLockFlat,
    SkillCostType.ManaPercent,
    SkillCostType.None,
];
exports.LIFE_SKILL_COST_TYPES = [
    SkillCostType.Life,
    SkillCostType.LifeSecond,
    SkillCostType.LifeLockFlat,
    SkillCostType.LifeLock,
    SkillCostType.LifePercent,
];
exports.MANA_SKILL_COST_TYPES = [
    SkillCostType.Mana,
    SkillCostType.ManaSecond,
    SkillCostType.ManaLock,
    SkillCostType.ManaLockFlat,
    SkillCostType.ManaPercent,
];
//# sourceMappingURL=skill-cost-type.js.map