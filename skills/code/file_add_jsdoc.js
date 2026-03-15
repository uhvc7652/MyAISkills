/**
 * @fileoverview 为当前文件添加 JSDoc 注释的技能实现
 *
 * 读取指定 JavaScript / TypeScript 文件，利用 code_add_jsdoc 的规则
 * 自动为缺少注释的函数、类和文件头补充 JSDoc 占位注释，
 * 然后将结果写回原文件（可选备份原文件）。
 *
 * @module skills/code/file_add_jsdoc
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { codeAddJsdoc } = require('./code_add_jsdoc');

/**
 * file_add_jsdoc 技能的输入参数。
 * @typedef {Object} FileAddJsdocParams
 * @property {string}  file_path            - 目标文件的绝对路径或相对路径（.js / .ts / .mjs / .cjs / .tsx）
 * @property {boolean} [include_fileoverview=true]  - 是否在文件顶部补充 @fileoverview 注释
 * @property {boolean} [include_private=false]      - 是否为以下划线开头的私有符号补充注释
 * @property {boolean} [backup=false]               - 是否在覆写前将原文件备份为 <filename>.bak
 */

/**
 * file_add_jsdoc 技能的输出结果。
 * @typedef {Object} FileAddJsdocResult
 * @property {boolean}  success        - 操作是否成功
 * @property {string}   file_path      - 已处理的文件绝对路径
 * @property {string}   [backup_path]  - 备份文件路径（仅在 backup=true 时出现）
 * @property {number}   added_count    - 新增 JSDoc 注释块的数量
 * @property {Array<{type: string, name: string, line: number}>} added_blocks - 新增注释列表
 * @property {number}   duration_ms    - 执行耗时（毫秒）
 */

/** 文件扩展名到语言标识符的映射 */
const EXT_TO_LANGUAGE = {
    '.js': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
};

/**
 * 读取指定文件，为其补充 JSDoc 注释后写回磁盘。
 *
 * 该技能内部复用了 {@link module:skills/code/code_add_jsdoc} 的注释生成逻辑，
 * 支持 JavaScript（.js / .mjs / .cjs）与 TypeScript（.ts / .tsx）文件。
 * 仅处理缺少 JSDoc 的代码块；已有注释的声明不会被重复覆盖。
 *
 * @async
 * @function fileAddJsdoc
 * @param {FileAddJsdocParams} params - 技能参数
 * @returns {Promise<FileAddJsdocResult>} 执行结果，包含新增注释摘要和文件路径
 * @throws {Error} 当文件不存在、扩展名不受支持或读写权限不足时抛出错误
 *
 * @example
 * // 为当前目录下的 utils.js 补充 JSDoc，并保留原文件备份
 * const result = await fileAddJsdoc({
 *   file_path: './src/utils.js',
 *   backup: true,
 * });
 * console.log(`新增 ${result.added_count} 处注释，文件已更新：${result.file_path}`);
 */
async function fileAddJsdoc(params) {
    const start = Date.now();

    const {
        file_path,
        include_fileoverview = true,
        include_private = false,
        backup = false,
    } = params;

    // ── 参数校验 ────────────────────────────────────────────────────────────────
    if (!file_path || String(file_path).trim() === '') {
        throw new Error('参数 file_path 不能为空');
    }

    const absPath = path.resolve(file_path);
    const ext = path.extname(absPath).toLowerCase();
    const language = EXT_TO_LANGUAGE[ext];

    if (!language) {
        throw new Error(
            `不支持的文件扩展名：${ext}。支持的扩展名：${Object.keys(EXT_TO_LANGUAGE).join(', ')}`
        );
    }

    if (!fs.existsSync(absPath)) {
        throw new Error(`文件不存在：${absPath}`);
    }

    // ── 读取源文件 ───────────────────────────────────────────────────────────────
    const originalCode = fs.readFileSync(absPath, 'utf-8');

    // ── 可选备份 ─────────────────────────────────────────────────────────────────
    let backupPath;
    if (backup) {
        backupPath = `${absPath}.bak`;
        fs.writeFileSync(backupPath, originalCode, 'utf-8');
    }

    // ── 补充 JSDoc 注释 ──────────────────────────────────────────────────────────
    const jsdocResult = await codeAddJsdoc({
        code: originalCode,
        language,
        include_fileoverview,
        include_private,
    });

    // ── 写回文件 ─────────────────────────────────────────────────────────────────
    fs.writeFileSync(absPath, jsdocResult.documented_code, 'utf-8');

    /** @type {FileAddJsdocResult} */
    const result = {
        success: true,
        file_path: absPath,
        added_count: jsdocResult.added_blocks.length,
        added_blocks: jsdocResult.added_blocks,
        duration_ms: Date.now() - start,
    };

    if (backupPath) {
        result.backup_path = backupPath;
    }

    return result;
}

module.exports = { fileAddJsdoc };
