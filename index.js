'use strict';

const path = require('path');
const registry = require('./skills');

const repoRoot = __dirname;
const skillsDir = path.join(repoRoot, 'skills');
const schemaPath = path.join(repoRoot, 'schema', 'skill.schema.json');

module.exports = {
  ...registry,
  paths: {
    repoRoot,
    skillsDir,
    schemaPath,
  },
};
