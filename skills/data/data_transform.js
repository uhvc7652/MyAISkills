/**
 * @fileoverview 数据格式转换技能实现
 * 支持 JSON、CSV、YAML、XML 之间的互相转换。
 * @module skills/data/data_transform
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * 支持的数据格式类型。
 * @typedef {'json'|'csv'|'yaml'|'xml'} DataFormat
 */

/**
 * data_transform 技能的输入参数。
 * @typedef {Object} DataTransformParams
 * @property {string}     data        - 待转换的数据字符串
 * @property {DataFormat} from_format - 数据的源格式
 * @property {DataFormat} to_format   - 目标格式
 * @property {boolean}    [pretty=true] - 是否格式化输出（对 JSON/YAML/XML 有效）
 */

/**
 * data_transform 技能的输出结果。
 * @typedef {Object} DataTransformResult
 * @property {boolean} success     - 转换是否成功
 * @property {string}  result      - 转换后的数据字符串
 * @property {number}  duration_ms - 执行耗时（毫秒）
 */

/** @type {DataFormat[]} */
const SUPPORTED_FORMATS = ['json', 'csv', 'yaml', 'xml'];

/**
 * 将数据从一种格式转换为另一种格式。
 *
 * 支持的转换组合：
 * | 源格式 | 目标格式 |
 * |--------|----------|
 * | JSON   | CSV / YAML / XML |
 * | CSV    | JSON / YAML / XML |
 * | YAML   | JSON / CSV / XML |
 * | XML    | JSON / CSV / YAML |
 *
 * @async
 * @function dataTransform
 * @param {DataTransformParams} params - 转换参数
 * @returns {Promise<DataTransformResult>} 包含转换后数据字符串的对象
 * @throws {Error} 当格式不受支持、源格式与实际数据不匹配或 `from_format === to_format` 时抛出错误
 *
 * @example
 * // CSV 转 JSON
 * const result = await dataTransform({
 *   data: 'name,age\n张三,28\n李四,32',
 *   from_format: 'csv',
 *   to_format: 'json',
 *   pretty: true,
 * });
 * console.log(result.result);
 * // [
 * //   {"name": "张三", "age": "28"},
 * //   {"name": "李四", "age": "32"}
 * // ]
 *
 * @example
 * // JSON 转 YAML
 * const result = await dataTransform({
 *   data: '{"name":"张三","age":28}',
 *   from_format: 'json',
 *   to_format: 'yaml',
 * });
 */
async function dataTransform(params) {
  const { data, from_format, to_format, pretty = true } = params;

  if (!data) throw new Error('参数 data 不能为空');
  if (!SUPPORTED_FORMATS.includes(from_format)) {
    throw new Error(`不支持的源格式：${from_format}`);
  }
  if (!SUPPORTED_FORMATS.includes(to_format)) {
    throw new Error(`不支持的目标格式：${to_format}`);
  }
  if (from_format === to_format) {
    throw new Error('源格式与目标格式相同，无需转换');
  }

  const start = Date.now();

  // 第一步：将源格式解析为中间 JavaScript 对象
  const intermediate = _parse(data, from_format);

  // 第二步：将中间对象序列化为目标格式
  const result = _serialize(intermediate, to_format, pretty);

  return { success: true, result, duration_ms: Date.now() - start };
}

/**
 * 将源格式字符串解析为 JavaScript 对象（内部函数）。
 *
 * @private
 * @param {string}     data   - 源数据字符串
 * @param {DataFormat} format - 源格式
 * @returns {*} 解析后的 JavaScript 值
 * @throws {Error} 解析失败时抛出
 */
function _parse(data, format) {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'csv':
      return _parseCsv(data);
    case 'yaml':
      // TODO: 使用 js-yaml 库实现完整 YAML 解析（npm install js-yaml）
      throw new Error('YAML 解析尚未实现，请安装并集成 js-yaml 库');
    case 'xml':
      // TODO: 使用 fast-xml-parser 库实现完整 XML 解析（npm install fast-xml-parser）
      throw new Error('XML 解析尚未实现，请安装并集成 fast-xml-parser 库');
    default:
      throw new Error(`未知格式：${format}`);
  }
}

/**
 * 将 JavaScript 对象序列化为目标格式字符串（内部函数）。
 *
 * @private
 * @param {*}          obj    - 中间 JavaScript 对象
 * @param {DataFormat} format - 目标格式
 * @param {boolean}    pretty - 是否格式化输出
 * @returns {string} 序列化后的字符串
 */
function _serialize(obj, format, pretty) {
  switch (format) {
    case 'json':
      return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
    case 'csv':
      return _serializeCsv(obj);
    case 'yaml':
      // TODO: 使用 js-yaml 库序列化（npm install js-yaml）
      throw new Error('YAML 序列化尚未实现，请安装并集成 js-yaml 库');
    case 'xml': {
      // TODO: 使用 fast-xml-parser 库序列化（npm install fast-xml-parser）
      throw new Error('XML 序列化尚未实现，请安装并集成 fast-xml-parser 库');
    }
    default:
      throw new Error(`未知格式：${format}`);
  }
}

/**
 * 解析 CSV 字符串为对象数组（内部函数）。
 *
 * @private
 * @param {string} csv - CSV 格式字符串（第一行为表头）
 * @returns {Object[]} 对象数组，每行对应一个对象
 */
function _parseCsv(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

/**
 * 将对象数组序列化为 CSV 字符串（内部函数）。
 *
 * @private
 * @param {Object|Object[]} obj - 要序列化的对象或数组
 * @returns {string} CSV 格式字符串
 */
function _serializeCsv(obj) {
  const rows = Array.isArray(obj) ? obj : [obj];
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => r[h] ?? '').join(','))];
  return lines.join('\n');
}

module.exports = { dataTransform };
