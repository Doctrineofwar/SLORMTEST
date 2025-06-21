"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const activable_slot_component_1 = require("./components/activable-slot/activable-slot.component");
const activable_view_component_1 = require("./components/activable-view/activable-view.component");
const ancestral_legacy_slot_component_1 = require("./components/ancestral-legacy-slot/ancestral-legacy-slot.component");
const ancestral_legacy_view_component_1 = require("./components/ancestral-legacy-view/ancestral-legacy-view.component");
const attribute_line_component_1 = require("./components/attribute-line/attribute-line.component");
const attribute_summary_view_component_1 = require("./components/attribute-summary-view/attribute-summary-view.component");
const character_animation_component_1 = require("./components/character-animation/character-animation.component");
const character_equipment_component_1 = require("./components/character-equipment/character-equipment.component");
const character_level_edit_modal_component_1 = require("./components/character-level-edit-modal/character-level-edit-modal.component");
const character_settings_menu_component_1 = require("./components/character-settings-menu/character-settings-menu.component");
const compare_item_modal_component_1 = require("./components/compare-item-modal/compare-item-modal.component");
const compare_view_component_1 = require("./components/compare-view/compare-view.component");
const create_build_empty_component_1 = require("./components/create-build-empty/create-build-empty.component");
const create_build_from_export_component_1 = require("./components/create-build-from-export/create-build-from-export.component");
const create_build_from_game_component_1 = require("./components/create-build-from-game/create-build-from-game.component");
const create_build_modal_component_1 = require("./components/create-build-modal/create-build-modal.component");
const create_build_component_1 = require("./components/create-build/create-build.component");
const delete_build_modal_component_1 = require("./components/delete-build-modal/delete-build-modal.component");
const delete_layer_modal_component_1 = require("./components/delete-layer-modal/delete-layer-modal.component");
const edit_build_modal_component_1 = require("./components/edit-build-modal/edit-build-modal.component");
const edit_layer_modal_component_1 = require("./components/edit-layer-modal/edit-layer-modal.component");
const file_upload_button_component_1 = require("./components/file-upload-button/file-upload-button.component");
const import_data_component_1 = require("./components/import-data/import-data.component");
const item_base_choice_modal_component_1 = require("./components/item-base-choice-modal/item-base-choice-modal.component");
const item_edit_buff_attribute_component_1 = require("./components/item-edit-buff-attribute/item-edit-buff-attribute.component");
const item_edit_buff_reaper_component_1 = require("./components/item-edit-buff-reaper/item-edit-buff-reaper.component");
const item_edit_buff_skill_component_1 = require("./components/item-edit-buff-skill/item-edit-buff-skill.component");
const item_edit_legendary_effect_component_1 = require("./components/item-edit-legendary-effect/item-edit-legendary-effect.component");
const item_edit_modal_component_1 = require("./components/item-edit-modal/item-edit-modal.component");
const item_edit_stat_component_1 = require("./components/item-edit-stat/item-edit-stat.component");
const item_reinforcement_edit_modal_component_1 = require("./components/item-reinforcement-edit-modal/item-reinforcement-edit-modal.component");
const item_slot_component_1 = require("./components/item-slot/item-slot.component");
const item_view_component_1 = require("./components/item-view/item-view.component");
const legendary_effect_view_component_1 = require("./components/legendary-effect-view/legendary-effect-view.component");
const main_stats_component_1 = require("./components/main-stats/main-stats.component");
const mechanics_view_component_1 = require("./components/mechanics-view/mechanics-view.component");
const merged_stat_view_component_1 = require("./components/merged-stat-view/merged-stat-view.component");
const optimize_items_affixes_modal_component_1 = require("./components/optimize-items-affixes-modal/optimize-items-affixes-modal.component");
const reaper_edit_modal_component_1 = require("./components/reaper-edit-modal/reaper-edit-modal.component");
const reaper_slot_component_1 = require("./components/reaper-slot/reaper-slot.component");
const reaper_view_component_1 = require("./components/reaper-view/reaper-view.component");
const remove_confirm_modal_component_1 = require("./components/remove-confirm-modal/remove-confirm-modal.component");
const rune_slot_component_1 = require("./components/rune-slot/rune-slot.component");
const rune_view_component_1 = require("./components/rune-view/rune-view.component");
const runes_edit_modal_component_1 = require("./components/runes-edit-modal/runes-edit-modal.component");
const runes_slot_component_1 = require("./components/runes-slot/runes-slot.component");
const search_select_component_1 = require("./components/search-select/search-select.component");
const skill_bar_component_1 = require("./components/skill-bar/skill-bar.component");
const skill_slot_component_1 = require("./components/skill-slot/skill-slot.component");
const skill_upgrade_view_component_1 = require("./components/skill-upgrade-view/skill-upgrade-view.component");
const skill_view_component_1 = require("./components/skill-view/skill-view.component");
const snackbar_component_1 = require("./components/snackbar/snackbar.component");
const trait_view_component_1 = require("./components/trait-view/trait-view.component");
const trait_component_1 = require("./components/trait/trait.component");
const ultimatum_edit_modal_component_1 = require("./components/ultimatum-edit-modal/ultimatum-edit-modal.component");
const ultimatum_slot_component_1 = require("./components/ultimatum-slot/ultimatum-slot.component");
const ultimatum_view_component_1 = require("./components/ultimatum-view/ultimatum-view.component");
const upgrade_slot_component_1 = require("./components/upgrade-slot/upgrade-slot.component");
const view_modalcomponent_1 = require("./components/view-modal/view-modalcomponent");
const material_module_1 = require("./material.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            snackbar_component_1.SnackbarComponent,
            edit_layer_modal_component_1.EditLayerModalComponent,
            delete_layer_modal_component_1.DeleteLayerModalComponent,
            item_view_component_1.ItemViewComponent,
            reaper_view_component_1.ReaperViewComponent,
            activable_view_component_1.ActivableViewComponent,
            skill_view_component_1.SkillViewComponent,
            skill_upgrade_view_component_1.SkillUpgradeViewComponent,
            ancestral_legacy_view_component_1.AncestralLegacyViewComponent,
            trait_view_component_1.TraitViewComponent,
            attribute_summary_view_component_1.AttributeSummaryViewComponent,
            item_edit_modal_component_1.ItemEditModalComponent,
            item_edit_stat_component_1.ItemEditStatComponent,
            item_edit_legendary_effect_component_1.ItemEditLegendaryEffectComponent,
            item_edit_buff_reaper_component_1.ItemEditBuffReaperComponent,
            item_edit_buff_skill_component_1.ItemEditBuffSkillComponent,
            item_edit_buff_attribute_component_1.ItemEditBuffAttributeComponent,
            item_base_choice_modal_component_1.ItemBaseChoiceModalComponent,
            remove_confirm_modal_component_1.RemoveConfirmModalComponent,
            reaper_edit_modal_component_1.ReaperEditModalComponent,
            character_level_edit_modal_component_1.CharacterLevelEditModalComponent,
            item_slot_component_1.ItemSlotComponent,
            character_animation_component_1.CharacterAnimationComponent,
            reaper_slot_component_1.ReaperSlotComponent,
            skill_slot_component_1.SkillSlotComponent,
            activable_slot_component_1.ActivableSlotComponent,
            skill_bar_component_1.SkillBarComponent,
            character_settings_menu_component_1.CharacterSettingsMenuComponent,
            character_equipment_component_1.CharacterEquipmentComponent,
            upgrade_slot_component_1.UpgradeSlotComponent,
            ancestral_legacy_slot_component_1.AncestralLegacySlotComponent,
            attribute_line_component_1.AttributeLineComponent,
            trait_component_1.TraitComponent,
            main_stats_component_1.MainStatsComponent,
            delete_build_modal_component_1.DeleteBuildModalComponent,
            import_data_component_1.ImportDataComponent,
            file_upload_button_component_1.FileUploadButtonComponent,
            compare_item_modal_component_1.CompareItemModalComponent,
            compare_view_component_1.CompareViewComponent,
            item_reinforcement_edit_modal_component_1.ItemReinforcementEditModalComponent,
            mechanics_view_component_1.MechanicsViewComponent,
            merged_stat_view_component_1.MergedStatViewComponent,
            ultimatum_slot_component_1.UltimatumSlotComponent,
            ultimatum_view_component_1.UltimatumViewComponent,
            ultimatum_edit_modal_component_1.UltimatumEditModalComponent,
            legendary_effect_view_component_1.LegendaryEffectViewComponent,
            optimize_items_affixes_modal_component_1.OptimizeItemsAffixesModalComponent,
            create_build_from_game_component_1.CreateBuildFromGameComponent,
            create_build_from_export_component_1.CreateBuildFromExportComponent,
            create_build_empty_component_1.CreateBuildEmptyComponent,
            create_build_component_1.CreateBuildComponent,
            create_build_modal_component_1.CreateBuildModalComponent,
            edit_build_modal_component_1.EditBuildModalComponent,
            search_select_component_1.SearchSelectComponent,
            runes_slot_component_1.RunesSlotComponent,
            rune_slot_component_1.RuneSlotComponent,
            rune_view_component_1.RuneViewComponent,
            runes_edit_modal_component_1.RunesEditModalComponent,
            view_modalcomponent_1.ViewModalComponent,
        ],
        imports: [
            common_1.CommonModule,
            material_module_1.MaterialModule,
        ],
        exports: [
            material_module_1.MaterialModule,
            item_view_component_1.ItemViewComponent,
            reaper_view_component_1.ReaperViewComponent,
            activable_view_component_1.ActivableViewComponent,
            skill_view_component_1.SkillViewComponent,
            skill_upgrade_view_component_1.SkillUpgradeViewComponent,
            ancestral_legacy_view_component_1.AncestralLegacyViewComponent,
            trait_view_component_1.TraitViewComponent,
            attribute_summary_view_component_1.AttributeSummaryViewComponent,
            item_edit_modal_component_1.ItemEditModalComponent,
            item_edit_stat_component_1.ItemEditStatComponent,
            item_edit_legendary_effect_component_1.ItemEditLegendaryEffectComponent,
            item_edit_buff_reaper_component_1.ItemEditBuffReaperComponent,
            item_edit_buff_skill_component_1.ItemEditBuffSkillComponent,
            item_edit_buff_attribute_component_1.ItemEditBuffAttributeComponent,
            item_base_choice_modal_component_1.ItemBaseChoiceModalComponent,
            remove_confirm_modal_component_1.RemoveConfirmModalComponent,
            reaper_edit_modal_component_1.ReaperEditModalComponent,
            character_level_edit_modal_component_1.CharacterLevelEditModalComponent,
            delete_build_modal_component_1.DeleteBuildModalComponent,
            item_slot_component_1.ItemSlotComponent,
            character_animation_component_1.CharacterAnimationComponent,
            reaper_slot_component_1.ReaperSlotComponent,
            activable_slot_component_1.ActivableSlotComponent,
            skill_slot_component_1.SkillSlotComponent,
            skill_bar_component_1.SkillBarComponent,
            character_settings_menu_component_1.CharacterSettingsMenuComponent,
            character_equipment_component_1.CharacterEquipmentComponent,
            upgrade_slot_component_1.UpgradeSlotComponent,
            ancestral_legacy_slot_component_1.AncestralLegacySlotComponent,
            attribute_line_component_1.AttributeLineComponent,
            trait_component_1.TraitComponent,
            main_stats_component_1.MainStatsComponent,
            import_data_component_1.ImportDataComponent,
            file_upload_button_component_1.FileUploadButtonComponent,
            compare_item_modal_component_1.CompareItemModalComponent,
            compare_view_component_1.CompareViewComponent,
            item_reinforcement_edit_modal_component_1.ItemReinforcementEditModalComponent,
            mechanics_view_component_1.MechanicsViewComponent,
            merged_stat_view_component_1.MergedStatViewComponent,
            ultimatum_slot_component_1.UltimatumSlotComponent,
            ultimatum_view_component_1.UltimatumViewComponent,
            ultimatum_edit_modal_component_1.UltimatumEditModalComponent,
            create_build_component_1.CreateBuildComponent,
            create_build_modal_component_1.CreateBuildModalComponent,
            edit_build_modal_component_1.EditBuildModalComponent,
            search_select_component_1.SearchSelectComponent,
            runes_slot_component_1.RunesSlotComponent,
            rune_slot_component_1.RuneSlotComponent,
            rune_view_component_1.RuneViewComponent,
            runes_edit_modal_component_1.RunesEditModalComponent,
        ],
        providers: [],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map