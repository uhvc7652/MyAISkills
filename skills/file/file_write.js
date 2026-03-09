/**
 * @fileoverview 文件写入技能实现
 * 将字符串内容写入本地文件，支持覆盖和追加两种模式。
 * @module skills/file/file_write
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * file_write 技能的输入参数。
 * @typedef {Object} FileWriteParams
 * @property {string}                 path           - 目标文件的绝对路径或相对路径
 * @property {string}                 content        - 要写入的文本内容
 * @property {'overwrite'|'append'}   [mode='overwrite'] - 写入模式
 * @property {string}                 [encoding='utf-8'] - 文件编码格式
 * @property {boolean}                [create_dirs=true] - 目录不存在时是否自动创建
 */

/**
 * file_write 技能的输出结果。
 * @typedef {Object} FileWriteResult
 * @property {boolean} success       - 写入是否成功
 * @property {string}  path          - 写入文件的绝对路径
 * @property {number}  bytes_written - 实际写入的字节数
 * @property {number}  duration_ms   - 执行耗时（毫秒）
 */

/**
 * 将字符串内容写入本地文件。
 *
 * 支持两种写入模式：
 * - `overwrite`：清空文件后写入（默认）
 * - `append`：在文件末尾追加内容
 *
 * 若父目录不存在且 `create_dirs` 为 `true`，将自动递归创建。
 *
 * @async
 * @function fileWrite
 * @param {FileWriteParams} params - 写入参数
 * @returns {Promise<FileWriteResult>} 包含写入路径和字节数的对象
 * @throws {Error} 当路径为空、content 未定义或无写入权限时抛出错误
 *
 * @example
 * // 创建新报告文件（覆盖模式）
 * const result = await fileWrite({
 *   path: '/home/user/report.md',
 *   content: '# 分析报告\n\n本次分析结论如下...',
 * });
 * console.log(`写入 ${result.bytes_written} 字节到 ${result.path}`);
 *
 * @example
 * // 追加日志
 * const result = await fileWrite({
 *   path: '/var/log/app.log',
 *   content: `[${new Date().toISOString()}] 操作完成\n`,
 *   mode: 'append',
 * });
 */
async function fileWrite(params) {
  const {
    path: filePath,
    content,
    mode = 'overwrite',
    encoding = 'utf-8',
    create_dirs = true,
  } = params;

  if (!filePath) throw new Error('参数 path 不能为空');
  if (content === undefined || content === null) throw new Error('参数 content 不能为空');

  const start = Date.now();
  const absPath = path.resolve(filePath);

  if (create_dirs) {
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
  }

  const flag = mode === 'append' ? 'a' : 'w';
  try {
    fs.writeFileSync(absPath, content, { encoding, flag });
  } catch (err) {
    throw new Error(`写入文件失败：${err.message}`);
  }

  const bytesWritten = Buffer.byteLength(content, encoding);

  return {
    success: true,
    path: absPath,
    bytes_written: bytesWritten,
    duration_ms: Date.now() - start,
  };
}

module.exports = { fileWrite };
