/**
 * @fileoverview 文件读取技能实现
 * 读取本地文件内容，支持按行范围截取。
 * @module skills/file/file_read
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * file_read 技能的输入参数。
 * @typedef {Object} FileReadParams
 * @property {string} path          - 文件的绝对路径或相对路径
 * @property {string} [encoding='utf-8'] - 文件编码格式
 * @property {number} [start_line]  - 从第几行开始读取（从 1 计数，不填则从头读取）
 * @property {number} [end_line]    - 读取到第几行结束（不填则读到末尾）
 */

/**
 * file_read 技能的输出结果。
 * @typedef {Object} FileReadResult
 * @property {boolean} success      - 读取是否成功
 * @property {string}  content      - 文件内容字符串
 * @property {number}  total_lines  - 文件总行数
 * @property {number}  size_bytes   - 文件大小（字节）
 * @property {number}  duration_ms  - 执行耗时（毫秒）
 */

/**
 * 读取本地文件的内容，可指定起止行范围。
 *
 * 支持 UTF-8 等常见编码格式。对于大文件，建议使用 `start_line` / `end_line`
 * 参数分段读取，避免一次加载过多内容到内存。
 *
 * @async
 * @function fileRead
 * @param {FileReadParams} params - 读取参数
 * @returns {Promise<FileReadResult>} 包含文件内容、总行数和文件大小的对象
 * @throws {Error} 当文件不存在、无读取权限或编码格式不受支持时抛出错误
 *
 * @example
 * // 读取整个文件
 * const result = await fileRead({ path: '/home/user/notes.txt' });
 * console.log(result.content);
 *
 * @example
 * // 只读取第 10-20 行
 * const result = await fileRead({ path: '/var/log/app.log', start_line: 10, end_line: 20 });
 * console.log(`共 ${result.total_lines} 行，显示第 10-20 行：`);
 * console.log(result.content);
 */
async function fileRead(params) {
  const { path: filePath, encoding = 'utf-8', start_line, end_line } = params;

  if (!filePath) {
    throw new Error('参数 path 不能为空');
  }

  const start = Date.now();
  const absPath = path.resolve(filePath);

  let rawContent;
  try {
    rawContent = fs.readFileSync(absPath, encoding);
  } catch (err) {
    throw new Error(`读取文件失败：${err.message}`);
  }

  const lines = rawContent.split('\n');
  const totalLines = lines.length;
  const sizeBytes = Buffer.byteLength(rawContent, encoding);

  // 按行范围截取（行号从 1 开始）
  const sliceStart = start_line != null ? Math.max(0, start_line - 1) : 0;
  const sliceEnd = end_line != null ? Math.min(totalLines, end_line) : totalLines;
  const content = lines.slice(sliceStart, sliceEnd).join('\n');

  return {
    success: true,
    content,
    total_lines: totalLines,
    size_bytes: sizeBytes,
    duration_ms: Date.now() - start,
  };
}

module.exports = { fileRead };
