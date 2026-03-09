/**
 * @fileoverview 数学计算技能实现
 * 安全地求值数学表达式，支持常用数学函数和常量。
 * @module skills/utility/calculate
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * calculate 技能的输入参数。
 * @typedef {Object} CalculateParams
 * @property {string} expression      - 数学表达式字符串，如 `'2 + 3 * 4'`、`'sqrt(144)'`、`'sin(pi/6)'`
 * @property {number} [precision=6]   - 结果保留的小数位数（0-15）
 */

/**
 * calculate 技能的输出结果。
 * @typedef {Object} CalculateResult
 * @property {boolean} success      - 计算是否成功
 * @property {string}  expression   - 原始表达式字符串
 * @property {number}  result       - 计算结果（已按 precision 四舍五入）
 * @property {number}  duration_ms  - 执行耗时（毫秒）
 */

/**
 * 允许在表达式中使用的安全数学函数和常量白名单。
 *
 * - **常量**：`pi`（π ≈ 3.14159）、`e`（自然常数 ≈ 2.71828）
 * - **基础运算**：`+`、`-`、`*`、`/`、`**`（幂）、`%`（取余）
 * - **取整**：`ceil(x)`、`floor(x)`、`round(x)`、`abs(x)`
 * - **平方根/幂**：`sqrt(x)`、`pow(x, y)`、`exp(x)`
 * - **对数**：`log(x)`（自然对数）、`log2(x)`、`log10(x)`
 * - **三角函数**：`sin(x)`、`cos(x)`、`tan(x)`（弧度制）
 * - **反三角函数**：`asin(x)`、`acos(x)`、`atan(x)`、`atan2(y, x)`
 *
 * @type {Object.<string, number|function>}
 */
const SAFE_MATH_CONTEXT = {
  pi: Math.PI,
  e: Math.E,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  sqrt: Math.sqrt,
  pow: Math.pow,
  exp: Math.exp,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
};

/**
 * 安全地计算数学表达式的结果。
 *
 * 仅允许使用 {@link SAFE_MATH_CONTEXT} 中列出的函数和常量，
 * 拒绝任何包含非法字符（如字母关键字 `require`、`process` 等）的表达式，
 * 防止代码注入攻击。
 *
 * @async
 * @function calculate
 * @param {CalculateParams} params - 计算参数
 * @returns {Promise<CalculateResult>} 包含表达式和计算结果的对象
 * @throws {Error} 当表达式为空、包含非法字符或计算结果为非有限数时抛出错误
 *
 * @example
 * // 基础四则运算
 * const result = await calculate({ expression: '(1 + 2) * (3 + 4)', precision: 0 });
 * console.log(result.result); // 21
 *
 * @example
 * // 使用数学函数
 * const result = await calculate({ expression: 'sqrt(2) * 100', precision: 4 });
 * console.log(result.result); // 141.4214
 *
 * @example
 * // 三角函数（弧度制）
 * const result = await calculate({ expression: 'sin(pi / 6)', precision: 4 });
 * console.log(result.result); // 0.5
 */
async function calculate(params) {
  const { expression, precision = 6 } = params;

  if (!expression || expression.trim() === '') {
    throw new Error('参数 expression 不能为空');
  }
  if (precision < 0 || precision > 15) {
    throw new Error('参数 precision 必须在 0-15 之间');
  }

  const start = Date.now();

  // 安全校验：仅允许白名单内的标识符
  const wordPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
  const words = expression.match(wordPattern) ?? [];
  const illegalWords = words.filter((w) => !(w in SAFE_MATH_CONTEXT));
  if (illegalWords.length > 0) {
    throw new Error(`表达式包含不允许的标识符：${illegalWords.join(', ')}`);
  }

  // 在受限上下文中求值
  const raw = _evalExpression(expression, SAFE_MATH_CONTEXT);

  if (!Number.isFinite(raw)) {
    throw new Error(`计算结果不是有限数：${raw}（可能是除以零或超出范围）`);
  }

  const factor = Math.pow(10, precision);
  const result = Math.round(raw * factor) / factor;

  return {
    success: true,
    expression,
    result,
    duration_ms: Date.now() - start,
  };
}

/**
 * 在提供的上下文中安全求值表达式（内部函数）。
 *
 * 通过将上下文中的变量作为函数参数传入，避免访问全局作用域。
 *
 * @private
 * @param {string}                         expression - 数学表达式
 * @param {Object.<string, number|function>} context  - 安全上下文（白名单）
 * @returns {number} 表达式的计算结果
 * @throws {Error} 表达式语法错误时抛出
 */
function _evalExpression(expression, context) {
  const keys = Object.keys(context);
  const values = Object.values(context);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...keys, `'use strict'; return (${expression});`);
  return fn(...values);
}

module.exports = { calculate };
