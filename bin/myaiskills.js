#!/usr/bin/env node

'use strict';

const { paths } = require('..');

function quoteShellValue(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function printUsage() {
  console.error('用法: myaiskills <repo|skills|schema|paths|env>');
  process.exitCode = 1;
}

const command = process.argv[2] || 'paths';

switch (command) {
  case 'repo':
    console.log(paths.repoRoot);
    break;
  case 'skills':
    console.log(paths.skillsDir);
    break;
  case 'schema':
    console.log(paths.schemaPath);
    break;
  case 'paths':
    console.log(JSON.stringify(paths, null, 2));
    break;
  case 'env':
    console.log(`export MYAI_SKILLS_ROOT=${quoteShellValue(paths.repoRoot)}`);
    console.log(`export MYAI_SKILLS_DIR=${quoteShellValue(paths.skillsDir)}`);
    console.log(`export MYAI_SKILL_SCHEMA=${quoteShellValue(paths.schemaPath)}`);
    break;
  default:
    printUsage();
}
