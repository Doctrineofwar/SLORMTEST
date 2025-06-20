import fs from 'fs';
import path from 'path';

import { BinaryParser } from '@/parser/BinaryParser';
import { createToolingServices } from '@/startup/createToolingServices';

const savePath = path.resolve('./save_1.slorm');

if (!fs.existsSync(savePath)) {
    console.error(`Save file not found at ${savePath}`);
    process.exit(1);
}

const raw = fs.readFileSync(savePath);
const save = BinaryParser.parse(raw);

const services = createToolingServices();
const { characterBuilderService, buildValidatorService, statCalculatorService } = services;

const character = characterBuilderService.buildCharacter(save);

console.log('--- Analyzing Build ---');

// Step 1: Pre-Validation
const preValidation = buildValidatorService.validatePreComputation(character.build);
if (!preValidation.isValid) {
    console.error('❌ Pre-Validation Failed:');
    preValidation.errors.forEach((e: string) => console.error(` - ${e}`));
} else {
    console.log('✅ Pre-Validation Passed');
}

// Step 2: Stat Calculation
const computedStats = statCalculatorService.computeStats(character);

// Step 3: Post-Validation
const postValidationErrors = buildValidatorService.validatePostComputation(computedStats);
if (postValidationErrors.length > 0) {
    console.error('❌ Post-Validation Failed:');
    postValidationErrors.forEach((e: string) => console.error(` - ${e}`));
} else {
    console.log('✅ Post-Validation Passed');
}

console.log('--- Build Analysis Complete ---');