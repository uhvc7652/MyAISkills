#!/usr/bin/env node

/**
 * @fileoverview Validates all skill definitions and implementations
 * Ensures .json and .js files are in sync and follow the schema
 */

'use strict';

const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', 'skills');
const schemaPath = path.join(__dirname, '..', 'schema', 'skill.schema.json');

let errors = 0;
let warnings = 0;

function log(level, message) {
  const prefix = {
    ERROR: '❌ ERROR:',
    WARN: '⚠️  WARN:',
    INFO: '✓',
    SUCCESS: '✅'
  }[level];
  console.log(`${prefix} ${message}`);
}

function validateSkillPair(category, skillName, jsonPath, jsPath) {
  // Check if both files exist
  if (!fs.existsSync(jsonPath)) {
    log('ERROR', `Missing JSON definition: ${jsonPath}`);
    errors++;
    return false;
  }
  
  if (!fs.existsSync(jsPath)) {
    log('ERROR', `Missing JS implementation: ${jsPath}`);
    errors++;
    return false;
  }

  try {
    // Load and validate JSON
    const skillDef = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'version', 'parameters'];
    for (const field of requiredFields) {
      if (!skillDef[field]) {
        log('ERROR', `${skillName}: Missing required field "${field}" in JSON`);
        errors++;
      }
    }
    
    // Validate name matches filename
    if (skillDef.name !== skillName) {
      log('ERROR', `${skillName}: Name mismatch - file: ${skillName}, json.name: ${skillDef.name}`);
      errors++;
    }
    
    // Validate category matches directory
    if (skillDef.category !== category) {
      log('WARN', `${skillName}: Category mismatch - dir: ${category}, json.category: ${skillDef.category}`);
      warnings++;
    }
    
    // Check if JS file exports the expected function
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const expectedExport = skillName.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (!jsContent.includes(`exports.${expectedExport}`) && !jsContent.includes(`module.exports = {`)) {
      log('WARN', `${skillName}: JS file may not export "${expectedExport}" function`);
      warnings++;
    }
    
    log('INFO', `${category}/${skillName}`);
    return true;
    
  } catch (error) {
    log('ERROR', `${skillName}: Failed to parse - ${error.message}`);
    errors++;
    return false;
  }
}

function validateSkillsDirectory() {
  console.log('\n🔍 Validating skills directory structure...\n');
  
  const categories = fs.readdirSync(skillsDir).filter(name => {
    const fullPath = path.join(skillsDir, name);
    return fs.statSync(fullPath).isDirectory();
  });
  
  let totalSkills = 0;
  
  for (const category of categories) {
    const categoryDir = path.join(skillsDir, category);
    const files = fs.readdirSync(categoryDir);
    
    // Find all JSON files
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    for (const jsonFile of jsonFiles) {
      const skillName = jsonFile.replace('.json', '');
      const jsonPath = path.join(categoryDir, jsonFile);
      const jsPath = path.join(categoryDir, `${skillName}.js`);
      
      validateSkillPair(category, skillName, jsonPath, jsPath);
      totalSkills++;
    }
  }
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total skills: ${totalSkills}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Warnings: ${warnings}`);
  
  if (errors === 0) {
    log('SUCCESS', 'All skills validated successfully!\n');
    return true;
  } else {
    console.log('\n❌ Validation failed. Please fix the errors above.\n');
    return false;
  }
}

function validateRegistry() {
  console.log('🔍 Validating skills registry...\n');
  
  try {
    const registry = require(path.join(__dirname, '..', 'skills', 'index.js'));
    const skills = registry.list();
    
    log('INFO', `Registry loaded: ${skills.length} skills registered`);
    
    // Test each API method
    try {
      const openAITools = registry.toOpenAITools();
      log('INFO', `OpenAI format: ${openAITools.length} tools generated`);
    } catch (err) {
      log('ERROR', `OpenAI format conversion failed: ${err.message}`);
      errors++;
    }
    
    try {
      const anthropicTools = registry.toAnthropicTools();
      log('INFO', `Anthropic format: ${anthropicTools.length} tools generated`);
    } catch (err) {
      log('ERROR', `Anthropic format conversion failed: ${err.message}`);
      errors++;
    }
    
    // Test a simple skill invocation
    try {
      const result = registry.invoke('get_current_time', { timezone: 'UTC', format: 'iso' });
      if (result) {
        log('INFO', 'Skill invocation test passed');
      }
    } catch (err) {
      log('ERROR', `Skill invocation failed: ${err.message}`);
      errors++;
    }
    
    console.log();
    return errors === 0;
    
  } catch (error) {
    log('ERROR', `Failed to load registry: ${error.message}`);
    errors++;
    return false;
  }
}

function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MyAISkills - Skill Validation Tool');
  console.log('═══════════════════════════════════════════════════');
  
  const dirValid = validateSkillsDirectory();
  const registryValid = validateRegistry();
  
  if (dirValid && registryValid) {
    console.log('✅ All validations passed!');
    process.exit(0);
  } else {
    console.log('❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateSkillsDirectory, validateRegistry };
