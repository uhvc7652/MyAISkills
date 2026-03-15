/**
 * @fileoverview MyAISkills 技能注册表
 *
 * 统一入口：加载所有技能的 JSON 定义和 JavaScript 实现，
 * 并提供便捷的查询、格式转换和调用接口。
 *
 * @module skills/index
 * @example
 * const registry = require('./skills');
 *
 * // 列出所有已注册技能
 * console.log(registry.list());
 *
 * // 转换为 OpenAI tools 格式
 * const tools = registry.toOpenAITools();
 *
 * // 按名称调用技能
 * const result = await registry.invoke('calculate', { expression: 'sqrt(2)', precision: 4 });
 */

'use strict';

/** @typedef {import('./types.js').SkillDefinition} SkillDefinition */
/** @typedef {import('./types.js').RegisteredSkill} RegisteredSkill */
/** @typedef {import('./types.js').SkillHandler} SkillHandler */

// ── 技能实现导入 ─────────────────────────────────────────────────────────────
const { webSearch } = require('./web/web_search');
const { webFetch } = require('./web/web_fetch');
const { codeExecute } = require('./code/code_execute');
const { codeAnalyze } = require('./code/code_analyze');
const { codeAddJsdoc } = require('./code/code_add_jsdoc');
const { fileAddJsdoc } = require('./code/file_add_jsdoc');
const { codeAddComments } = require('./code/code_add_comments');
const { codeRefactorSuggest } = require('./code/code_refactor_suggest');
const { codeGenerateTests } = require('./code/code_generate_tests');
const { fileRead } = require('./file/file_read');
const { fileWrite } = require('./file/file_write');
const { fileList } = require('./file/file_list');
const { dataParseJson } = require('./data/data_parse_json');
const { dataTransform } = require('./data/data_transform');
const { getCurrentTime } = require('./utility/get_current_time');
const { calculate } = require('./utility/calculate');
const { requirementsClarify } = require('./utility/requirements_clarify');

// ── JSON 定义导入 ────────────────────────────────────────────────────────────
const webSearchDef = require('./web/web_search.json');
const webFetchDef = require('./web/web_fetch.json');
const codeExecuteDef = require('./code/code_execute.json');
const codeAnalyzeDef = require('./code/code_analyze.json');
const codeAddJsdocDef = require('./code/code_add_jsdoc.json');
const fileAddJsdocDef = require('./code/file_add_jsdoc.json');
const codeAddCommentsDef = require('./code/code_add_comments.json');
const codeRefactorSuggestDef = require('./code/code_refactor_suggest.json');
const codeGenerateTestsDef = require('./code/code_generate_tests.json');
const fileReadDef = require('./file/file_read.json');
const fileWriteDef = require('./file/file_write.json');
const fileListDef = require('./file/file_list.json');
const dataParseJsonDef = require('./data/data_parse_json.json');
const dataTransformDef = require('./data/data_transform.json');
const getCurrentTimeDef = require('./utility/get_current_time.json');
const calculateDef = require('./utility/calculate.json');
const requirementsClarifyDef = require('./utility/requirements_clarify.json');

// ── 内部注册表 ───────────────────────────────────────────────────────────────

/**
 * 内部技能注册表，将技能名称映射到定义和处理函数。
 * @type {Map<string, RegisteredSkill>}
 * @private
 */
const _registry = new Map([
  ['web_search', { definition: webSearchDef, handler: webSearch }],
  ['web_fetch', { definition: webFetchDef, handler: webFetch }],
  ['code_execute', { definition: codeExecuteDef, handler: codeExecute }],
  ['code_analyze', { definition: codeAnalyzeDef, handler: codeAnalyze }],
  ['code_add_jsdoc', { definition: codeAddJsdocDef, handler: codeAddJsdoc }],
  ['file_add_jsdoc', { definition: fileAddJsdocDef, handler: fileAddJsdoc }],
  ['code_add_comments', { definition: codeAddCommentsDef, handler: codeAddComments }],
  ['code_refactor_suggest', { definition: codeRefactorSuggestDef, handler: codeRefactorSuggest }],
  ['code_generate_tests', { definition: codeGenerateTestsDef, handler: codeGenerateTests }],
  ['file_read', { definition: fileReadDef, handler: fileRead }],
  ['file_write', { definition: fileWriteDef, handler: fileWrite }],
  ['file_list', { definition: fileListDef, handler: fileList }],
  ['data_parse_json', { definition: dataParseJsonDef, handler: dataParseJson }],
  ['data_transform', { definition: dataTransformDef, handler: dataTransform }],
  ['get_current_time', { definition: getCurrentTimeDef, handler: getCurrentTime }],
  ['calculate', { definition: calculateDef, handler: calculate }],
  ['requirements_clarify', { definition: requirementsClarifyDef, handler: requirementsClarify }],
]);

// ── 公开 API ─────────────────────────────────────────────────────────────────

/**
 * 列出所有已注册技能的简要信息。
 *
 * @returns {{ name: string, category: string, description: string, version: string }[]}
 *   技能简要信息列表，按类别和名称排序
 *
 * @example
 * const skills = registry.list();
 * skills.forEach(s => console.log(`[${s.category}] ${s.name} — ${s.description}`));
 */
function list() {
  return [..._registry.values()]
    .map(({ definition: d }) => ({
      name: d.name,
      category: d.category,
      description: d.description,
      version: d.version,
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

/**
 * 获取指定技能的完整定义。
 *
 * @param {string} name - 技能名称
 * @returns {SkillDefinition} 技能定义对象
 * @throws {Error} 技能不存在时抛出错误
 *
 * @example
 * const def = registry.getDefinition('calculate');
 * console.log(def.parameters.properties);
 */
function getDefinition(name) {
  const skill = _registry.get(name);
  if (!skill) throw new Error(`技能不存在：${name}`);
  return skill.definition;
}

/**
 * 将所有技能定义转换为 OpenAI Function Calling 的 `tools` 格式。
 *
 * @returns {{ type: 'function', function: { name: string, description: string, parameters: Object } }[]}
 *   OpenAI tools 数组，可直接传入 `client.chat.completions.create({ tools })` 的 tools 参数
 *
 * @example
 * const tools = registry.toOpenAITools();
 * const response = await openai.chat.completions.create({ model: 'gpt-4o', tools, messages });
 */
function toOpenAITools() {
  return [..._registry.values()].map(({ definition: d }) => ({
    type: 'function',
    function: {
      name: d.name,
      description: d.description,
      parameters: d.parameters,
    },
  }));
}

/**
 * 将所有技能定义转换为 Anthropic Claude Tool Use 的 `tools` 格式。
 *
 * @returns {{ name: string, description: string, input_schema: Object }[]}
 *   Anthropic tools 数组，可直接传入 `client.messages.create({ tools })` 的 tools 参数
 *
 * @example
 * const tools = registry.toAnthropicTools();
 * const response = await anthropic.messages.create({ model: 'claude-3-5-sonnet-20241022', tools, messages });
 */
function toAnthropicTools() {
  return [..._registry.values()].map(({ definition: d }) => ({
    name: d.name,
    description: d.description,
    input_schema: d.parameters,
  }));
}

/**
 * 按名称调用技能并返回结果。
 *
 * @async
 * @param {string} name   - 技能名称
 * @param {Object} params - 技能输入参数（须符合对应技能的 parameters schema）
 * @returns {Promise<*>}  技能执行结果
 * @throws {Error} 技能不存在或执行失败时抛出错误
 *
 * @example
 * // 调用数学计算技能
 * const result = await registry.invoke('calculate', { expression: 'sqrt(144)', precision: 0 });
 * console.log(result.result); // 12
 *
 * @example
 * // 调用网络搜索技能
 * const result = await registry.invoke('web_search', { query: '最新 AI 新闻', num_results: 5 });
 * result.results.forEach(r => console.log(r.title));
 */
async function invoke(name, params) {
  const skill = _registry.get(name);
  if (!skill) throw new Error(`技能不存在：${name}`);
  return skill.handler(params);
}

module.exports = { list, getDefinition, toOpenAITools, toAnthropicTools, invoke };
