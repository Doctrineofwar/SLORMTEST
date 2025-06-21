🧠 Slormstack AI Project Prompt (for JetBrains Rider AI & Others)

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

Last updated: 06:44 PM CST