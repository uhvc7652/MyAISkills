#!/usr/bin/env node

/**
 * @fileoverview Verifies that MyAISkills is correctly set up and can be used by other projects
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let errors = 0;
let warnings = 0;

function log(level, message) {
  const prefix = {
    ERROR: '❌',
    WARN: '⚠️ ',
    INFO: '✓',
    SUCCESS: '✅',
    HEADER: '═══'
  }[level];
  console.log(`${prefix} ${message}`);
}

function checkNodeVersion() {
  log('INFO', 'Checking Node.js version...');
  
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  if (major < 16) {
    log('ERROR', `Node.js ${version} is too old. Please upgrade to Node.js 16 or higher.`);
    errors++;
    return false;
  }
  
  log('INFO', `  Node.js ${version} ✓`);
  return true;
}

function checkPackageStructure() {
  log('INFO', 'Checking package structure...');
  
  const repoRoot = path.join(__dirname, '..');
  const requiredFiles = [
    'package.json',
    'index.js',
    'skills/index.js',
    'schema/skill.schema.json',
    'bin/myaiskills.js',
    'README.md'
  ];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(repoRoot, file);
    if (!fs.existsSync(fullPath)) {
      log('ERROR', `  Missing required file: ${file}`);
      errors++;
    }
  }
  
  if (errors === 0) {
    log('INFO', `  All required files present ✓`);
  }
  
  return errors === 0;
}

function checkSkillsDirectory() {
  log('INFO', 'Checking skills directory...');
  
  const skillsDir = path.join(__dirname, '..', 'skills');
  const categories = ['code', 'data', 'file', 'utility', 'web'];
  
  for (const category of categories) {
    const categoryDir = path.join(skillsDir, category);
    if (!fs.existsSync(categoryDir)) {
      log('WARN', `  Missing category directory: ${category}`);
      warnings++;
    }
  }
  
  log('INFO', `  Skills directory structure ✓`);
  return true;
}

function checkRegistryLoads() {
  log('INFO', 'Checking if registry loads correctly...');
  
  try {
    const registry = require(path.join(__dirname, '..'));
    
    if (!registry.list) {
      log('ERROR', '  Registry missing list() method');
      errors++;
      return false;
    }
    
    if (!registry.invoke) {
      log('ERROR', '  Registry missing invoke() method');
      errors++;
      return false;
    }
    
    if (!registry.toOpenAITools) {
      log('ERROR', '  Registry missing toOpenAITools() method');
      errors++;
      return false;
    }
    
    if (!registry.toAnthropicTools) {
      log('ERROR', '  Registry missing toAnthropicTools() method');
      errors++;
      return false;
    }
    
    if (!registry.paths) {
      log('ERROR', '  Registry missing paths object');
      errors++;
      return false;
    }
    
    const skills = registry.list();
    log('INFO', `  Registry loaded successfully (${skills.length} skills) ✓`);
    
    return true;
  } catch (error) {
    log('ERROR', `  Failed to load registry: ${error.message}`);
    errors++;
    return false;
  }
}

function checkCLICommand() {
  log('INFO', 'Checking CLI command...');
  
  const cliPath = path.join(__dirname, '..', 'bin', 'myaiskills.js');
  
  if (!fs.existsSync(cliPath)) {
    log('ERROR', '  CLI script not found');
    errors++;
    return false;
  }
  
  try {
    const output = execSync(`node "${cliPath}" paths`, { encoding: 'utf8' });
    const paths = JSON.parse(output);
    
    if (!paths.repoRoot || !paths.skillsDir || !paths.schemaPath) {
      log('ERROR', '  CLI returned incomplete paths');
      errors++;
      return false;
    }
    
    log('INFO', `  CLI command works ✓`);
    log('INFO', `    repoRoot: ${paths.repoRoot}`);
    log('INFO', `    skillsDir: ${paths.skillsDir}`);
    log('INFO', `    schemaPath: ${paths.schemaPath}`);
    
    return true;
  } catch (error) {
    log('ERROR', `  CLI command failed: ${error.message}`);
    errors++;
    return false;
  }
}

function checkEnvironmentSetup() {
  log('INFO', 'Checking environment setup...');
  
  const envVars = ['MYAI_SKILLS_ROOT', 'MYAI_SKILLS_DIR', 'MYAI_SKILL_SCHEMA'];
  let hasAny = false;
  
  for (const envVar of envVars) {
    if (process.env[envVar]) {
      log('INFO', `  ${envVar} is set ✓`);
      hasAny = true;
    }
  }
  
  if (!hasAny) {
    log('WARN', '  No environment variables set. Run these commands:');
    log('WARN', '    npm link');
    log('WARN', '    eval "$(myaiskills env)"');
    warnings++;
  }
  
  return true;
}

function printUsageInstructions() {
  console.log('\n📚 Usage Instructions:\n');
  console.log('  To use this repository in other projects:');
  console.log('');
  console.log('  1️⃣  Link the package globally:');
  console.log('      $ npm link');
  console.log('');
  console.log('  2️⃣  Set up environment variables (optional):');
  console.log('      $ eval "$(myaiskills env)"');
  console.log('      # Or add to ~/.bashrc or ~/.zshrc:');
  console.log('      # eval "$(myaiskills env)"');
  console.log('');
  console.log('  3️⃣  Use in Node.js projects:');
  console.log('      $ cd /path/to/your/project');
  console.log('      $ npm link myaiskills');
  console.log('      $ node -e "const registry = require(\'myaiskills\'); console.log(registry.list())"');
  console.log('');
  console.log('  4️⃣  Use in Python/other languages:');
  console.log('      import os, json, glob');
  console.log('      skills_dir = os.environ["MYAI_SKILLS_DIR"]');
  console.log('      # Load skills from skills_dir');
  console.log('');
  console.log('  📖 See README.md for more details.');
  console.log('');
}

function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MyAISkills - Setup Verification Tool');
  console.log('═══════════════════════════════════════════════════\n');
  
  checkNodeVersion();
  checkPackageStructure();
  checkSkillsDirectory();
  checkRegistryLoads();
  checkCLICommand();
  checkEnvironmentSetup();
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  console.log('═══════════════════════════════════════════════════\n');
  
  if (errors === 0 && warnings === 0) {
    log('SUCCESS', 'All checks passed! Your MyAISkills setup is ready to use.\n');
    printUsageInstructions();
    process.exit(0);
  } else if (errors === 0) {
    log('SUCCESS', 'Setup is functional, but there are some warnings.\n');
    printUsageInstructions();
    process.exit(0);
  } else {
    log('ERROR', 'Setup verification failed. Please fix the errors above.\n');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkNodeVersion, checkPackageStructure, checkRegistryLoads };
