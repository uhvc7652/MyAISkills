/**
 * @fileoverview 代码重构建议技能实现
 * 通过轻量规则为源码输出结构化的重构建议。
 * @module skills/code/code_refactor_suggest
 */

'use strict';

/**
 * 重构建议技能的输入参数。
 * @typedef {Object} CodeRefactorSuggestParams
 * @property {string} code - 需要分析的源码字符串
 * @property {'javascript'|'typescript'|'python'|'java'|'go'|'rust'} [language='javascript'] - 编程语言
 * @property {('readability'|'reuse'|'complexity'|'naming'|'testing')[]} [focus_areas=['readability','complexity','testing']]
 *   重点关注的重构维度
 */

/**
 * 单条重构建议。
 * @typedef {Object} RefactorSuggestion
 * @property {'low'|'medium'|'high'} priority - 建议优先级
 * @property {'readability'|'reuse'|'complexity'|'naming'|'testing'} category - 建议类别
 * @property {string} title - 建议标题
 * @property {string} rationale - 原因说明
 * @property {string} suggested_change - 推荐改动
 */

/**
 * 重构建议技能的输出结果。
 * @typedef {Object} CodeRefactorSuggestResult
 * @property {boolean} success - 分析是否成功
 * @property {string} summary - 摘要说明
 * @property {RefactorSuggestion[]} suggestions - 重构建议列表
 * @property {number} duration_ms - 执行耗时（毫秒）
 */

/**
 * 生成结构化的代码重构建议。
 *
 * 该实现基于轻量规则识别常见可维护性信号，如 `var`、`console.log`、
 * 超长行、深层嵌套和缺少测试关注点等，适用于快速代码审查与重构规划。
 *
 * @async
 * @function codeRefactorSuggest
 * @param {CodeRefactorSuggestParams} params - 分析参数
 * @returns {Promise<CodeRefactorSuggestResult>} 包含摘要与建议列表的对象
 * @throws {Error} 当 `code` 为空或 `language` 不受支持时抛出错误
 */
async function codeRefactorSuggest(params) {
  const {
    code,
    language = 'javascript',
    focus_areas = ['readability', 'complexity', 'testing'],
  } = params;

  const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust'];
  if (!code || code.trim() === '') {
    throw new Error('参数 code 不能为空');
  }
  if (!supportedLanguages.includes(language)) {
    throw new Error(`不支持的语言：${language}`);
  }

  const start = Date.now();
  const suggestions = _collectSuggestions(code, focus_areas);
  const summary = suggestions.length > 0
    ? `发现 ${suggestions.length} 条可执行的重构建议。`
    : '未发现明显的轻量规则级重构问题。';

  return {
    success: true,
    summary,
    suggestions,
    duration_ms: Date.now() - start,
  };
}

/**
 * 收集重构建议。
 *
 * @private
 * @param {string} code - 源码字符串
 * @param {string[]} focusAreas - 关注维度
 * @returns {RefactorSuggestion[]} 建议列表
 */
function _collectSuggestions(code, focusAreas) {
  const suggestions = [];
  const lines = code.split(/\r?\n/);
  const hasFocus = (area) => focusAreas.includes(area);

  if (hasFocus('readability') && /\bconsole\.log\s*\(/.test(code)) {
    suggestions.push({
      title: '避免在核心逻辑中直接输出日志',
      priority: 'medium',
      category: 'readability',
      rationale: '直接输出日志会让业务逻辑和调试逻辑耦合，降低函数的可读性与复用性。',
      suggested_change: '将日志提取到调用层，或通过参数注入 logger。',
    });
  }

  if (hasFocus('readability') && /\bvar\b/.test(code)) {
    suggestions.push({
      title: '使用块级作用域替代 var',
      priority: 'medium',
      category: 'readability',
      rationale: 'var 的作用域规则更宽松，容易引入变量提升和作用域歧义。',
      suggested_change: '根据是否会重新赋值，将 var 替换为 let 或 const。',
    });
  }

  if (hasFocus('complexity') && lines.some((line) => line.length > 100)) {
    suggestions.push({
      title: '拆分超长表达式或语句',
      priority: 'low',
      category: 'complexity',
      rationale: '过长的单行语句通常意味着逻辑密度过高，不利于维护与评审。',
      suggested_change: '将长表达式拆分为具名中间变量或独立辅助函数。',
    });
  }

  if (hasFocus('complexity') && _estimateMaxNesting(code) >= 3) {
    suggestions.push({
      title: '降低嵌套层级',
      priority: 'high',
      category: 'complexity',
      rationale: '较深的嵌套会增加认知负担，也更容易隐藏边界条件分支。',
      suggested_change: '使用卫语句、提取函数或拆分条件判断以降低嵌套深度。',
    });
  }

  if (hasFocus('reuse') && /for\s*\(|while\s*\(/.test(code) && !/return\s+\[/.test(code)) {
    suggestions.push({
      title: '评估是否可提取可复用的数据处理函数',
      priority: 'low',
      category: 'reuse',
      rationale: '显式循环常常承载转换、过滤或聚合逻辑，可能值得提炼为独立函数。',
      suggested_change: '提取具名函数，或在合适场景下使用 map/filter/reduce 等更高层抽象。',
    });
  }

  if (hasFocus('naming') && /\b[a-zA-Z]\d+\b/.test(code)) {
    suggestions.push({
      title: '改善过于简短或带编号的命名',
      priority: 'low',
      category: 'naming',
      rationale: '带编号或语义不足的变量名不利于理解其业务角色。',
      suggested_change: '改为表达业务意图的名称，例如 totalPrice、userProfile、retryCount 等。',
    });
  }

  if (hasFocus('testing') && !/\b(assert|expect|should)\b/.test(code)) {
    suggestions.push({
      title: '补充关键路径测试用例',
      priority: 'medium',
      category: 'testing',
      rationale: '当前代码片段未体现测试断言或测试覆盖信息，关键路径可能缺少保护。',
      suggested_change: '优先为正常路径、边界输入和异常输入增加测试用例。',
    });
  }

  return suggestions;
}

/**
 * 估算代码中的最大嵌套层级。
 *
 * @private
 * @param {string} code - 源码字符串
 * @returns {number} 估算得到的最大层级
 */
function _estimateMaxNesting(code) {
  let depth = 0;
  let maxDepth = 0;

  for (const char of code) {
    if (char === '{') {
      depth += 1;
      maxDepth = Math.max(maxDepth, depth);
    } else if (char === '}' && depth > 0) {
      depth -= 1;
    }
  }

  return maxDepth;
}

module.exports = { codeRefactorSuggest };
