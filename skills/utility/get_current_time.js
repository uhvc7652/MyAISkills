/**
 * @fileoverview 获取当前时间技能实现
 * 返回指定时区的当前日期、时间和星期信息。
 * @module skills/utility/get_current_time
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * get_current_time 技能的输入参数。
 * @typedef {Object} GetCurrentTimeParams
 * @property {string}            [timezone='Asia/Shanghai'] - IANA 时区名称，
 *   如 `'Asia/Shanghai'`、`'America/New_York'`、`'UTC'`
 * @property {'iso8601'|'human'} [format='human'] - 返回时间的格式：
 *   - `'iso8601'`：标准 ISO 8601 格式，如 `2025-06-01T14:30:00+08:00`
 *   - `'human'`：人类友好格式，如 `2025年6月1日 星期日 14:30:00`
 */

/**
 * get_current_time 技能的输出结果。
 * @typedef {Object} GetCurrentTimeResult
 * @property {boolean} success    - 执行是否成功
 * @property {string}  datetime   - 完整日期时间字符串（按 format 参数格式化）
 * @property {string}  date       - 仅日期部分，格式 `YYYY-MM-DD`
 * @property {string}  time       - 仅时间部分，格式 `HH:mm:ss`
 * @property {string}  weekday    - 星期几（中文）
 * @property {number}  timestamp  - Unix 时间戳（秒）
 * @property {string}  timezone   - 实际使用的时区名称
 * @property {number}  duration_ms - 执行耗时（毫秒）
 */

/** @type {readonly string[]} 中文星期名称，索引 0 对应星期日 */
const WEEKDAY_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/**
 * 获取指定时区的当前日期和时间。
 *
 * 当用户询问"现在几点"、"今天几号"、"今天星期几"，
 * 或需要当前时间戳时调用此函数。
 *
 * @async
 * @function getCurrentTime
 * @param {GetCurrentTimeParams} [params={}] - 时间参数（所有字段均为可选）
 * @returns {Promise<GetCurrentTimeResult>} 包含日期、时间、星期和时间戳的对象
 * @throws {Error} 当 `timezone` 不是有效的 IANA 时区名称时抛出错误
 *
 * @example
 * // 获取上海时间（默认）
 * const result = await getCurrentTime();
 * console.log(result.datetime); // "2025年6月1日 星期日 14:30:00"
 * console.log(result.timestamp); // 1748749800
 *
 * @example
 * // 获取纽约时间，ISO 8601 格式
 * const result = await getCurrentTime({
 *   timezone: 'America/New_York',
 *   format: 'iso8601',
 * });
 * console.log(result.datetime); // "2025-06-01T02:30:00-04:00"
 */
async function getCurrentTime(params = {}) {
  const { timezone = 'Asia/Shanghai', format = 'human' } = params;

  const start = Date.now();
  const now = new Date();

  // 验证时区名称是否合法
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  } catch {
    throw new Error(`无效的时区名称：${timezone}`);
  }

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map(({ type, value }) => [type, value]),
  );

  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const time = `${parts.hour}:${parts.minute}:${parts.second}`;
  const weekday = WEEKDAY_ZH[new Date(now.toLocaleString('en-US', { timeZone: timezone })).getDay()];
  const timestamp = Math.floor(now.getTime() / 1000);

  const datetime =
    format === 'iso8601'
      ? now.toLocaleString('sv-SE', { timeZone: timezone }).replace(' ', 'T')
      : `${parts.year}年${Number(parts.month)}月${Number(parts.day)}日 ${weekday} ${time}`;

  return {
    success: true,
    datetime,
    date,
    time,
    weekday,
    timestamp,
    timezone,
    duration_ms: Date.now() - start,
  };
}

module.exports = { getCurrentTime };
