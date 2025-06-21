<!-- Last updated: 16:22 PM CST -->
🧠 Slormstack AI Project Prompt (for JetBrains Rider AI & Others)

✅ Project context fully loaded
✅ Ancestral Legacy mechanics corrected with Adam's dual role
✅ Technical architecture mapped with Adam progression tracking
✅ Current priorities identified with Adam integration focus
✅ Blocking issues flagged (framework alignment)
✅ Implementation strategies defined for Adam mechanics
✅ Game logic constraints updated with Adam progression
✅ UI/UX requirements updated for Adam tracking display
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

🧰 Tooling & Stack
•	Frontend: React + Vite + TailwindCSS
•	Backend: Node (planned, optional for save uploads)
•	Logic/Core: TypeScript services from slorm-planner fork
•	Testing: Vitest + CI workflows for validation coverage
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
•	Automated tests for validator (unit + integration)
•	Developer QA Mode: highlights invalid states and displays reasons
•	GitHub CI for validating mapping coverage and project consistency
•	Manual build edge-case tests from verified save files

🧭 Methodology & Conventions
•	Vite + React template used for consistency
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

### Current Work Queue (Updated Priority Order)
1. **IMMEDIATE**: Resolve framework discrepancy (Angular vs React)
2. **HIGH**: Implement AncestralLegacyService with Adam progression mechanics
3. **HIGH**: Create Adam NPC interaction tracking system
4. **HIGH**: Update ValidationService to handle boss-item-Adam progression
5. **HIGH**: Create error handling infrastructure across all services
6. **MEDIUM**: Set up performance optimization (lazy loading, caching)
7. **MEDIUM**: Implement accessibility compliance (WCAG 2.1 AA)
8. **LOW**: Community features and advanced UI polish

### Next 3 Actions (Ready to Execute)
1. **Decision Required**: Framework alignment - update PROMPT.md OR migrate to React
2. **Code Implementation**: Create `AncestralLegacyService` with Adam mechanics (boss→item→Adam→node)
3. **Progression Tracking**: Implement boss defeat and item delivery tracking system

### Adam Integration Requirements
- Track which bosses have been defeated
- Track which items have been delivered to Adam
- Validate Adam fight availability (requires 6 items delivered)
- Handle Adam as both NPC (nodes 1-6) and final boss (node 7)

## 🔧 Technical Implementation Context

### Game Logic Requirements (CORRECTED FOR ADAM)
```typescript
// Critical Validation Rules (ADAM-CORRECTED)
const VALIDATION_RULES = {
  ANCESTRAL_LEGACIES: '0_TO_7_PROGRESSIVE',     // 0-7 based on campaign progress
  ADAM_ITEM_DELIVERY: 'boss_items_to_adam',     // Boss items must be brought to Adam
  ADAM_FINAL_BOSS: 'defeat_adam_for_7th_node',  // Adam must be defeated for 7th node
  FIRST_NODE_INNER_RING: true,                  // First node must be inner ring
  NODES_2_TO_6_CONNECTED: true,                 // Must connect to previous
  NODE_7_FREE_PLACEMENT: true,                  // 7th can go anywhere free
  PRIMARY_SKILL_MATCH_CLASS: true,              // Must match character class
  SECONDARY_SKILLS_MATCH_SPEC: true,            // Must match class + specialization
  NO_SAVE_EDITING: true,                        // Read-only save file operations
  VERIFIED_DATA_ONLY: true,                     // No assumptions about game mechanics
  REAL_TIME_VALIDATION: true,                   // Show red badge for invalid builds
};
```
// Updated component for Adam-centric progression
LegaciesComponent: {
  displayProgression: '0/7 nodes, X/6 items delivered to Adam';
  showAdamStatus: 'NPC phase vs Boss phase indicator';
  bossItemTracking: 'which bosses defeated, which items delivered';
  adamFightAvailability: 'highlight when Adam can be fought';
  seventhNodeSpecial: 'indicate 7th node is Adam\'s defeat reward';
  validationFeedback: 'real-time placement validation';
  progressionIndicator: 'Adam interaction progress affects available nodes';
}

## **Adam's Dual Role**:
- **Nodes 1-6**: Adam is an NPC who receives boss items and gives legacy nodes
- **Node 7**: Adam becomes the final boss who must be defeated after delivering 6 items

## **Progression System**:
- Boss defeated → Item obtained → Item brought to Adam → Node received (repeat 6 times)
- After 6 items delivered → Fight Adam → Receive 7th node

## **Technical Implementation**:
- Added Adam progression tracking
- Boss item delivery validation
- Adam fight availability logic
- UI elements for Adam's dual role

Both documents now accurately reflect the complete Adam-centric Ancestral Legacy system.