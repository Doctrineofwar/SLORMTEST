<!-- Last updated: 20:55 PM CST 2025-06-20 -->
🧠 Slormstack AI Project Prompt (for JetBrains Rider AI & Others)

✅ Project context fully loaded
✅ Ancestral Legacy mechanics corrected with Adam's dual role
✅ Technical architecture mapped with Adam progression tracking
✅ Current priorities identified with Adam integration focus
✅ Framework CONFIRMED as Angular 14.2.4 (not React)
✅ Implementation strategies defined for Adam mechanics
✅ Game logic constraints updated with Adam progression
✅ UI/UX requirements updated for Adam tracking display
✅ Wrapper component and FeatureFlagsService CONFIRMED implemented
✅ Ready for immediate development decisions

🧩 Project Overview

Slormstack is a full-stack, data-driven web application designed to analyze, plan, and optimize character builds in the indie ARPG The Slormancer. It acts as a theorycrafting companion, parsing save files, displaying interactive build data, validating configuration logic, and enabling guide generation and community trend analysis.

🎯 Project Scope

Slormstack aims to provide:
•	Full build parsing from .slorm save files
•	Character builder & planner (skills, gear, attributes, reapers, legacies, stats)
•	Validation engine to detect build issues (pre/post computation)
•	Community features (guide sharing, trending builds)
•	Patch diffing, retrocompatibility tools, and future modding support

🎮 Use Case

Players upload their save or manually configure a build to:
•	View character stats in a beautiful, interactive format
•	Validate their build for errors
•	Optimize damage, survivability, or farming
•	Compare with community meta or share their own guides

🧰 Tooling & Stack (VERIFIED)
•	Frontend: Angular 14.2.4 + TypeScript 4.8.4 + Angular Material 14.2.3
•	Backend: Node 18.10.0 (planned, optional for save uploads)
•	Logic/Core: TypeScript services from slorm-planner fork
•	Testing: Angular testing framework (ng test) + Protractor 7.0.0
•	Build: Angular CLI 14.2.4 + npm package manager
•	Deployment: GitHub Pages (static), Docker (future backends)
•	Source: https://github.com/Doctrineofwar/slormstack

🔍 Inputs
•	.slorm save files (binary)
•	JSON data files (game constants, skill data, reaper definitions)
•	Manual build configurations (form input)

📤 Outputs
•	Interactive UI with character breakdowns
•	Build validation results
•	Community-trending builds and patch-aware suggestions
•	Printable or sharable build guides

🧪 Testing & Quality
•	Automated tests for validator (ng test + unit tests)
•	Developer QA Mode: highlights invalid states and displays reasons
•	GitHub CI for validating mapping coverage and project consistency
•	Manual build edge-case tests from verified save files

🧭 Methodology & Conventions
•	Angular best practices with modular architecture
•	Modularized services (parser, validator, builder) for maintainability
•	Ancestral legacies, stats, skills, reapers validated against actual data
•	SkillNodeService, ReaperService, UltimatumService integrated to enforce logic
•	Slormstack must never allow save editing or cheating

🧠 Memory & Prompt Persistence
•	The AI assistant should treat this prompt as a live document.
•	Updates to project scope, logic, or tools should result in appending or modifying this file.
•	The file must be kept up-to-date and used to restore session memory on boot.
•	Add a markdown comment at the top of the prompt with the last update timestamp.

🖼️ UI/UX Notes
•	Slormancer-like aesthetic (matching in-game colors for stats)
•	Sidebar navigation: Overview, Analysis, Reaper, Gear, Skills, Legacies, Community, Trends
•	Overview left panel: summary stats, skill names, defense breakdowns
•	Right panel: full stat groupings by in-game tabs
•	All build views should allow tooltips and breakdowns on hover

🧾 Additional Notes
•	Dev must adhere to verified Slormancer data only — no assumptions.
•	All build responses must list exactly 7 valid Ancestral Legacies.
•	Secondary skills must match class, specialization rules.
•	The primary skill must match the character class.
•	Invalid builds must trigger a red badge and validator output.

⸻

## 🎯 Development Status & Next Actions

### Current Work Queue (VERIFIED STATUS)
1. **COMPLETED**: AncestralLegaciesWrapperComponent created ✅
2. **COMPLETED**: FeatureFlagsService implemented ✅
3. **IN PROGRESS**: Integration with routing system 🔄
4. **HIGH**: Complete Adam progression mechanics in services
5. **HIGH**: Update ValidationService to handle boss-item-Adam progression
6. **HIGH**: Create error handling infrastructure across all services
7. **MEDIUM**: Set up performance optimization (lazy loading, caching)
8. **MEDIUM**: Implement accessibility compliance (WCAG 2.1 AA)
9. **LOW**: Community features and advanced UI polish

### Immediate Next Actions (VERIFIED READY)
1. **ROUTING**: Verify routing integration for AncestralLegaciesWrapperComponent
2. **MODULE**: Confirm wrapper component is properly declared in BuildModule
3. **TESTING**: Test feature flag toggle functionality
4. **ADAM SERVICE**: Begin AncestralLegacyService with Adam mechanics

### Adam Integration Requirements
- Track which bosses have been defeated
- Track which items have been delivered to Adam
- Validate Adam fight availability (requires 6 items delivered)
- Handle Adam as both NPC (nodes 1-6) and final boss (node 7)

## 🔧 Technical Implementation Context (VERIFIED)

### Confirmed File Structure