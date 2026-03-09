/**
 * @fileoverview 测试模板生成技能实现
 * 根据源码中的函数与类声明生成基础单元测试模板。
 * @module skills/code/code_generate_tests
 */

'use strict';

/**
 * 测试模板生成技能的输入参数。
 * @typedef {Object} CodeGenerateTestsParams
 * @property {string} code - 需要生成测试模板的源码字符串
 * @property {'javascript'|'typescript'} [language='javascript'] - 源码语言
 * @property {'jest'|'vitest'} [framework='jest'] - 测试框架
 * @property {boolean} [include_edge_cases=true] - 是否补充边界场景占位测试
 */

/**
 * 被识别出的测试目标。
 * @typedef {Object} TestTarget
 * @property {string} name - 目标名称
 * @property {'function'|'class'} type - 目标类型
 */

/**
 * 测试模板生成技能的输出结果。
 * @typedef {Object} CodeGenerateTestsResult
 * @property {boolean} success - 生成是否成功
 * @property {string} framework - 使用的测试框架
 * @property {string} test_code - 生成的测试模板代码
 * @property {TestTarget[]} targets - 识别到的测试目标列表
 * @property {number} duration_ms - 执行耗时（毫秒）
 */

/**
 * 为 JavaScript / TypeScript 代码生成基础测试模板。
 *
 * 当前实现采用轻量规则，只识别单行函数 / 类声明，
 * 并输出适用于 Jest / Vitest 的 describe/it 模板。
 *
 * @async
 * @function codeGenerateTests
 * @param {CodeGenerateTestsParams} params - 生成参数
 * @returns {Promise<CodeGenerateTestsResult>} 包含测试代码和目标摘要的对象
 * @throws {Error} 当 `code` 为空、`language` 不受支持或 `framework` 不受支持时抛出错误
 */
async function codeGenerateTests(params) {
  const {
    code,
    language = 'javascript',
    framework = 'jest',
    include_edge_cases = true,
  } = params;

  const supportedLanguages = ['javascript', 'typescript'];
  const supportedFrameworks = ['jest', 'vitest'];
  if (!code || code.trim() === '') {
    throw new Error('参数 code 不能为空');
  }
  if (!supportedLanguages.includes(language)) {
    throw new Error(`不支持的语言：${language}`);
  }
  if (!supportedFrameworks.includes(framework)) {
    throw new Error(`不支持的测试框架：${framework}`);
  }

  const start = Date.now();
  const targets = _findTestTargets(code);
  const testCode = _buildTestCode(targets, include_edge_cases);

  return {
    success: true,
    framework,
    test_code: testCode,
    targets,
    duration_ms: Date.now() - start,
  };
}

/**
 * 从源码中识别测试目标。
 *
 * @private
 * @param {string} code - 源码字符串
 * @returns {TestTarget[]} 测试目标列表
 */
function _findTestTargets(code) {
  const targets = [];
  const lines = code.split(/\r?\n/);

  lines.forEach((line) => {
    const functionMatch = line.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (functionMatch) {
      targets.push({ name: functionMatch[1], type: 'function' });
      return;
    }

    const arrowFunctionMatch = line.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\((.*)\)|([A-Za-z_$][\w$]*))\s*=>/);
    if (arrowFunctionMatch) {
      targets.push({ name: arrowFunctionMatch[1], type: 'function' });
      return;
    }

    const classMatch = line.match(/^\s*(?:export\s+)?class\s+([A-Za-z_$][\w$]*)\b/);
    if (classMatch) {
      targets.push({ name: classMatch[1], type: 'class' });
    }
  });

  return _dedupeTargets(targets);
}

/**
 * 构造测试模板代码。
 *
 * @private
 * @param {TestTarget[]} targets - 测试目标列表
 * @param {boolean} includeEdgeCases - 是否包含边界场景测试
 * @returns {string} 测试模板代码
 */
function _buildTestCode(targets, includeEdgeCases) {
  if (targets.length === 0) {
    return [
      "describe('generated tests', () => {",
      "  it('needs manual target selection', () => {",
      '    // TODO: 未识别到可自动生成测试模板的目标，请手动补充',
      '  });',
      '});',
      '',
    ].join('\n');
  }

  const lines = [];
  targets.forEach((target) => {
    lines.push(`describe('${target.name}', () => {`);
    lines.push("  it('handles the happy path', () => {");
    lines.push(`    // TODO: 调用 ${target.name} 并补充断言`);
    lines.push('  });');

    if (includeEdgeCases) {
      lines.push('');
      lines.push("  it('handles edge cases', () => {");
      lines.push('    // TODO: 补充边界条件断言');
      lines.push('  });');
    }

    if (target.type === 'class') {
      lines.push('');
      lines.push("  it('supports instance behavior', () => {");
      lines.push(`    // TODO: 实例化 ${target.name} 并验证关键行为`);
      lines.push('  });');
    }

    lines.push('});');
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * 按名称去重测试目标。
 *
 * @private
 * @param {TestTarget[]} targets - 原始目标列表
 * @returns {TestTarget[]} 去重后的目标列表
 */
function _dedupeTargets(targets) {
  const seen = new Set();
  return targets.filter((target) => {
    if (seen.has(target.name)) {
      return false;
    }
    seen.add(target.name);
    return true;
  });
}

module.exports = { codeGenerateTests };
