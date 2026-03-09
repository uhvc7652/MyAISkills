/**
 * @fileoverview JSON 解析技能实现
 * 解析 JSON 字符串，支持 JSONPath 语法提取深层字段。
 * @module skills/data/data_parse_json
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * data_parse_json 技能的输入参数。
 * @typedef {Object} DataParseJsonParams
 * @property {string} json_string - 要解析的 JSON 格式字符串
 * @property {string} [path]      - JSONPath 表达式（如 `$.user.name`、`$.items[0].price`）；
 *                                  不填则返回整个解析后的对象
 */

/**
 * data_parse_json 技能的输出结果。
 * @typedef {Object} DataParseJsonResult
 * @property {boolean} success     - 解析是否成功
 * @property {*}       value       - 提取到的值（类型取决于 JSONPath 指向的节点）
 * @property {string}  type        - 提取值的 JavaScript 类型（'string'、'number'、'object' 等）
 * @property {number}  duration_ms - 执行耗时（毫秒）
 */

/**
 * 解析 JSON 字符串并按 JSONPath 提取目标字段的值。
 *
 * JSONPath 语法参考：
 * - `$`         根节点
 * - `.key`      访问对象属性
 * - `[index]`   访问数组元素（从 0 计数）
 * - 示例：`$.users[0].name`、`$.config.database.host`
 *
 * @async
 * @function dataParseJson
 * @param {DataParseJsonParams} params - 解析参数
 * @returns {Promise<DataParseJsonResult>} 包含提取值及其类型的对象
 * @throws {Error} 当 `json_string` 不是合法 JSON 时抛出解析错误
 *
 * @example
 * // 提取嵌套字段
 * const result = await dataParseJson({
 *   json_string: '{"user": {"name": "张三", "age": 28}}',
 *   path: '$.user.name',
 * });
 * console.log(result.value); // "张三"
 * console.log(result.type);  // "string"
 *
 * @example
 * // 不传 path，返回整个对象
 * const result = await dataParseJson({ json_string: '{"a": 1, "b": 2}' });
 * console.log(result.value); // { a: 1, b: 2 }
 */
async function dataParseJson(params) {
  const { json_string, path: jsonPath } = params;

  if (!json_string) throw new Error('参数 json_string 不能为空');

  const start = Date.now();

  let parsed;
  try {
    parsed = JSON.parse(json_string);
  } catch (err) {
    throw new Error(`JSON 解析失败：${err.message}`);
  }

  const value = jsonPath ? _extractByPath(parsed, jsonPath) : parsed;

  return {
    success: true,
    value,
    type: Array.isArray(value) ? 'array' : typeof value,
    duration_ms: Date.now() - start,
  };
}

/**
 * 按简化 JSONPath 表达式提取值（内部函数）。
 *
 * 支持 `$.key`、`$.key[index]` 等基本语法，不支持过滤表达式。
 *
 * @private
 * @param {*}      obj  - 已解析的 JSON 对象
 * @param {string} expr - JSONPath 表达式（以 `$` 开头）
 * @returns {*} 提取到的值，找不到时返回 `undefined`
 */
function _extractByPath(obj, expr) {
  // 去掉开头的 "$" 并按 "." 和 "[index]" 拆分路径段
  const segments = expr
    .replace(/^\$\.?/, '')
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean);

  return segments.reduce((current, seg) => {
    if (current === undefined || current === null) return undefined;
    return current[seg];
  }, obj);
}

module.exports = { dataParseJson };
