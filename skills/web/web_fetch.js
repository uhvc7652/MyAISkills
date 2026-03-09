/**
 * @fileoverview 网页内容抓取技能实现
 * 获取指定 URL 的网页内容，并以指定格式返回。
 * @module skills/web/web_fetch
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * web_fetch 技能的输入参数。
 * @typedef {Object} WebFetchParams
 * @property {string}                       url            - 要获取内容的完整 URL 地址
 * @property {'text'|'markdown'|'html'}     [format='markdown'] - 返回内容的格式
 * @property {number}                       [timeout=10]   - 请求超时时间（秒，1-60）
 */

/**
 * web_fetch 技能的输出结果。
 * @typedef {Object} WebFetchResult
 * @property {boolean} success     - 抓取是否成功
 * @property {string}  title       - 网页标题
 * @property {string}  url         - 实际请求的 URL（可能经过重定向）
 * @property {string}  content     - 网页内容（按 format 参数格式化）
 * @property {string}  fetched_at  - 抓取时间（ISO 8601 格式）
 * @property {number}  duration_ms - 执行耗时（毫秒）
 */

/**
 * 抓取指定 URL 的网页内容，并以指定格式返回。
 *
 * 当需要读取某个具体网页的文章、文档或数据时调用此函数。
 * 适合在已知目标 URL 的情况下使用；若需要搜索，请使用 {@link module:skills/web/web_search}。
 *
 * @async
 * @function webFetch
 * @param {WebFetchParams} params - 抓取参数
 * @returns {Promise<WebFetchResult>} 包含网页标题和内容的对象
 * @throws {Error} 当 URL 格式非法、网络超时或服务器返回错误状态码时抛出错误
 *
 * @example
 * // 以 Markdown 格式抓取网页
 * const result = await webFetch({ url: 'https://example.com/article', format: 'markdown' });
 * console.log(result.title);
 * console.log(result.content);
 *
 * @example
 * // 抓取纯文本，设置较长超时
 * const result = await webFetch({ url: 'https://example.com', format: 'text', timeout: 30 });
 */
async function webFetch(params) {
  const { url, format = 'markdown', timeout = 10 } = params;

  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error(`无效的 URL：${url}`);
  }
  if (timeout < 1 || timeout > 60) {
    throw new Error('参数 timeout 必须在 1-60 秒之间');
  }

  const start = Date.now();

  // TODO: 替换为真实的 HTTP 客户端（如 node-fetch、axios）及 HTML 解析器（如 cheerio）
  const raw = await _httpGet(url, timeout);
  const content = _convertFormat(raw, format);

  return {
    success: true,
    title: raw.title,
    url: raw.finalUrl,
    content,
    fetched_at: new Date().toISOString(),
    duration_ms: Date.now() - start,
  };
}

/**
 * 执行 HTTP GET 请求（内部函数）。
 *
 * @private
 * @async
 * @param {string} url     - 目标 URL
 * @param {number} timeout - 超时秒数
 * @returns {Promise<{title: string, finalUrl: string, html: string}>} 原始响应数据
 */
async function _httpGet(url, _timeout) {
  // 占位实现，实际项目中替换为真实 HTTP 请求
  return {
    title: '示例网页标题',
    finalUrl: url,
    html: `<html><body><h1>示例网页标题</h1><p>正文内容...</p></body></html>`,
  };
}

/**
 * 将 HTML 转换为目标格式（内部函数）。
 *
 * @private
 * @param {{ html: string }} raw    - 原始响应数据
 * @param {'text'|'markdown'|'html'} format - 目标格式
 * @returns {string} 转换后的内容字符串
 */
function _convertFormat(raw, format) {
  if (format === 'html') return raw.html;
  if (format === 'markdown') return '# 示例网页标题\n\n正文内容...';
  return '示例网页标题\n\n正文内容...'; // text
}

module.exports = { webFetch };
