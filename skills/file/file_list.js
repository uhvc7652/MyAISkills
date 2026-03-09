/**
 * @fileoverview 目录列出技能实现
 * 列出指定目录下的文件和子目录，支持 glob 过滤和递归列出。
 * @module skills/file/file_list
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** @typedef {import('../types.js').SkillResult} SkillResult */

/**
 * file_list 技能的输入参数。
 * @typedef {Object} FileListParams
 * @property {string}  path               - 要列出内容的目录路径
 * @property {string}  [pattern]          - 文件名 glob 匹配模式，如 '*.py'，不填则列出全部
 * @property {boolean} [recursive=false]  - 是否递归列出所有子目录
 * @property {boolean} [include_hidden=false] - 是否包含隐藏文件（以 . 开头）
 */

/**
 * 目录条目信息。
 * @typedef {Object} DirectoryEntry
 * @property {string} name        - 文件或目录的名称
 * @property {'file'|'directory'} type - 条目类型
 * @property {number} size_bytes  - 文件大小（字节，目录为 0）
 * @property {string} modified_at - 最后修改时间（ISO 8601 格式）
 * @property {string} full_path   - 完整绝对路径
 */

/**
 * file_list 技能的输出结果。
 * @typedef {Object} FileListResult
 * @property {boolean}          success     - 列出是否成功
 * @property {DirectoryEntry[]} entries     - 条目列表
 * @property {number}           total       - 条目总数
 * @property {number}           duration_ms - 执行耗时（毫秒）
 */

/**
 * 列出指定目录下的文件和子目录。
 *
 * 可通过 `pattern` 参数按文件名匹配过滤（支持 `*` 和 `?` 通配符）。
 * 设置 `recursive: true` 可递归遍历所有子目录。
 *
 * @async
 * @function fileList
 * @param {FileListParams} params - 列出参数
 * @returns {Promise<FileListResult>} 包含目录条目列表的对象
 * @throws {Error} 当路径不存在、不是目录或无读取权限时抛出错误
 *
 * @example
 * // 列出目录下所有 Python 文件（递归）
 * const result = await fileList({
 *   path: '/home/user/project',
 *   pattern: '*.py',
 *   recursive: true,
 * });
 * result.entries.forEach(e => console.log(e.full_path));
 *
 * @example
 * // 列出顶层目录（含隐藏文件）
 * const result = await fileList({ path: '/home/user', include_hidden: true });
 * console.log(`共 ${result.total} 个条目`);
 */
async function fileList(params) {
  const { path: dirPath, pattern, recursive = false, include_hidden = false } = params;

  if (!dirPath) throw new Error('参数 path 不能为空');

  const start = Date.now();
  const absPath = path.resolve(dirPath);

  let stat;
  try {
    stat = fs.statSync(absPath);
  } catch {
    throw new Error(`路径不存在：${absPath}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`路径不是目录：${absPath}`);
  }

  const entries = _readDir(absPath, pattern, recursive, include_hidden);

  return {
    success: true,
    entries,
    total: entries.length,
    duration_ms: Date.now() - start,
  };
}

/**
 * 递归读取目录条目（内部函数）。
 *
 * @private
 * @param {string}  dirPath        - 目录绝对路径
 * @param {string|undefined} pattern - 文件名过滤模式
 * @param {boolean} recursive      - 是否递归
 * @param {boolean} includeHidden  - 是否包含隐藏文件
 * @returns {DirectoryEntry[]} 条目列表
 */
function _readDir(dirPath, pattern, recursive, includeHidden) {
  const results = [];
  let names;
  try {
    names = fs.readdirSync(dirPath);
  } catch {
    return results;
  }

  for (const name of names) {
    if (!includeHidden && name.startsWith('.')) continue;

    const fullPath = path.join(dirPath, name);
    let st;
    try { st = fs.statSync(fullPath); } catch { continue; }

    const isDir = st.isDirectory();

    if (isDir) {
      // 未指定 pattern 时将目录加入结果；指定 pattern 时仅遍历目录（不加入结果）
      if (!pattern) {
        results.push({
          name, type: 'directory', size_bytes: 0,
          modified_at: st.mtime.toISOString(), full_path: fullPath,
        });
      }
      if (recursive) {
        results.push(..._readDir(fullPath, pattern, recursive, includeHidden));
      }
    } else {
      // 文件：未指定 pattern 或匹配 pattern 时加入结果
      if (!pattern || _matchGlob(name, pattern)) {
        results.push({
          name, type: 'file', size_bytes: st.size,
          modified_at: st.mtime.toISOString(), full_path: fullPath,
        });
      }
    }
  }

  return results;
}

/**
 * 简单 glob 匹配（仅支持 `*` 和 `?`）。
 *
 * @private
 * @param {string} name    - 文件名
 * @param {string} pattern - 匹配模式
 * @returns {boolean} 是否匹配
 */
function _matchGlob(name, pattern) {
  const escaped = pattern
    .replace(/\\/g, '\\\\')              // 先转义反斜杠
    .replace(/[.+^${}[\]|()]/g, '\\$&') // 再转义其他正则元字符
    .replace(/\*/g, '.*')               // glob * → 正则 .*
    .replace(/\?/g, '.');               // glob ? → 正则 .
  const regex = new RegExp('^' + escaped + '$');
  return regex.test(name);
}

module.exports = { fileList };
