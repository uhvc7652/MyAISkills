/**
 * @fileoverview 为当前文件添加 JSDoc 注释的技能实现
 *
 * 读取指定代码文件，按语言标准自动为缺少注释的函数、类和文件头补充注释：
 * - JavaScript / TypeScript: JSDoc
 * - Java: JavaDoc
 * - C#: XML Documentation
 * 然后将结果写回原文件（可选备份原文件）。
 *
 * @module skills/code/code_add_jsdoc_file
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { codeAddJsdoc } = require('./code_add_jsdoc');

/**
 * code_add_jsdoc_file 技能的输入参数。
 * @typedef {Object} CodeAddJsdocFileParams
 * @property {string}  file_path            - 目标文件的绝对路径或相对路径（.js / .ts / .mjs / .cjs / .tsx / .java / .cs）
 * @property {boolean} [include_fileoverview=true]  - 是否在文件顶部补充文件级文档注释
 * @property {boolean} [include_private=false]      - 是否为以下划线开头的私有符号补充注释
 * @property {boolean} [backup=false]               - 是否在覆写前将原文件备份为 <filename>.bak
 */

/**
 * code_add_jsdoc_file 技能的输出结果。
 * @typedef {Object} CodeAddJsdocFileResult
 * @property {boolean}  success        - 操作是否成功
 * @property {string}   file_path      - 已处理的文件绝对路径
 * @property {string}   [backup_path]  - 备份文件路径（仅在 backup=true 时出现）
 * @property {number}   added_count    - 新增文档注释块的数量
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
    '.java': 'java',
    '.cs': 'csharp',
};

/**
 * 读取指定文件，为其补充标准注释后写回磁盘。
 *
 * JavaScript/TypeScript 内部复用 {@link module:skills/code/code_add_jsdoc}。
 * Java/C# 使用本文件内的轻量规则生成 JavaDoc / XML 文档注释。
 * 仅处理缺少注释的代码块；已有注释的声明不会被重复覆盖。
 *
 * @async
 * @function codeAddJsdocFile
 * @param {CodeAddJsdocFileParams} params - 技能参数
 * @returns {Promise<CodeAddJsdocFileResult>} 执行结果，包含新增注释摘要和文件路径
 * @throws {Error} 当文件不存在、扩展名不受支持或读写权限不足时抛出错误
 *
 * @example
 * // 为当前目录下的 utils.js 补充 JSDoc，并保留原文件备份
 * const result = await codeAddJsdocFile({
 *   file_path: './src/utils.js',
 *   backup: true,
 * });
 * console.log(`新增 ${result.added_count} 处注释，文件已更新：${result.file_path}`);
 */
async function codeAddJsdocFile(params) {
    const start = Date.now();

    const {
        file_path,
        include_fileoverview = true,
        include_private = false,
        backup = false,
    } = params;

    if (!file_path || String(file_path).trim() === '') {
        throw new Error('参数 file_path 不能为空');
    }

    const absPath = path.resolve(file_path);
    const ext = path.extname(absPath).toLowerCase();
    const language = EXT_TO_LANGUAGE[ext];

    if (!language) {
        throw new Error(`不支持的文件扩展名：${ext}。支持的扩展名：${Object.keys(EXT_TO_LANGUAGE).join(', ')}`);
    }
    if (!fs.existsSync(absPath)) {
        throw new Error(`文件不存在：${absPath}`);
    }

    const originalCode = fs.readFileSync(absPath, 'utf-8');

    let backupPath;
    if (backup) {
        backupPath = `${absPath}.bak`;
        fs.writeFileSync(backupPath, originalCode, 'utf-8');
    }

    const docResult = (language === 'javascript' || language === 'typescript')
        ? await codeAddJsdoc({
            code: originalCode,
            language,
            include_fileoverview,
            include_private,
        })
        : _addJavaOrCsharpDocs({
            code: originalCode,
            language,
            include_fileoverview,
            include_private,
        });

    fs.writeFileSync(absPath, docResult.documented_code, 'utf-8');

    /** @type {CodeAddJsdocFileResult} */
    const result = {
        success: true,
        file_path: absPath,
        added_count: docResult.added_blocks.length,
        added_blocks: docResult.added_blocks,
        duration_ms: Date.now() - start,
    };

    if (backupPath) {
        result.backup_path = backupPath;
    }

    return result;
}

/**
 * 为 Java/C# 代码补充标准文档注释。
 *
 * @private
 * @param {{code: string, language: 'java'|'csharp', include_fileoverview: boolean, include_private: boolean}} params - 补全参数
 * @returns {{documented_code: string, added_blocks: Array<{type: string, name: string, line: number}>}} 注释结果
 */
function _addJavaOrCsharpDocs(params) {
    const { code, language, include_fileoverview, include_private } = params;

    const lineEnding = code.includes('\r\n') ? '\r\n' : '\n';
    const sourceLines = code.split(/\r?\n/);
    const outputLines = [];
    const addedBlocks = [];

    if (include_fileoverview && !_hasLeadingFileDoc(sourceLines, language)) {
        const fileBlock = language === 'java'
            ? ['/**', ' * TODO: 补充当前 Java 文件说明。', ' */', '']
            : ['/// <summary>', '/// TODO: 补充当前 C# 文件说明。', '/// </summary>', ''];

        outputLines.push(...fileBlock);
        addedBlocks.push({ type: 'file', name: 'file_comment', line: 1 });
    }

    for (let index = 0; index < sourceLines.length; index += 1) {
        const line = sourceLines[index];
        const declaration = _matchTypedDeclaration(line, language);

        if (declaration && !_hasLeadingLanguageDoc(sourceLines, index, language)) {
            const isPrivate = declaration.name.startsWith('_');
            if (!isPrivate || include_private) {
                const block = declaration.kind === 'class'
                    ? _buildClassDoc(language, declaration.indent, declaration.name)
                    : _buildMethodDoc(language, declaration.indent, declaration.name, declaration.params, declaration.returnType);

                outputLines.push(...block);
                addedBlocks.push({
                    type: declaration.kind,
                    name: declaration.name,
                    line: outputLines.length - block.length + 1,
                });
            }
        }

        outputLines.push(line);
    }

    return {
        documented_code: outputLines.join(lineEnding),
        added_blocks: addedBlocks,
    };
}

/**
 * 匹配 Java/C# 的类和方法声明。
 *
 * @private
 * @param {string} line - 源码行
 * @param {'java'|'csharp'} language - 语言
 * @returns {{kind:'class'|'function',name:string,indent:string,params?:string,returnType?:string}|null} 声明信息
 */
function _matchTypedDeclaration(line, language) {
    if (language === 'java') {
        const classMatch = line.match(/^(\s*)(?:public|protected|private)?\s*(?:abstract\s+|final\s+)?class\s+([A-Za-z_][\w]*)\b/);
        if (classMatch) {
            return { kind: 'class', indent: classMatch[1], name: classMatch[2] };
        }

        const methodMatch = line.match(/^(\s*)(?:public|protected|private)\s+(?:static\s+)?(?:final\s+)?(?:synchronized\s+)?(?:<[^>]+>\s+)?([A-Za-z_][\w<>\[\], ?]*)\s+([A-Za-z_][\w]*)\s*\(([^;]*)\)\s*(?:throws\s+[A-Za-z_][\w.,\s]*)?\s*\{/);
        if (methodMatch) {
            return {
                kind: 'function',
                indent: methodMatch[1],
                returnType: methodMatch[2].trim(),
                name: methodMatch[3],
                params: methodMatch[4],
            };
        }

        return null;
    }

    const classMatch = line.match(/^(\s*)(?:public|protected|private|internal)\s+(?:abstract\s+|sealed\s+|static\s+|partial\s+)*class\s+([A-Za-z_][\w]*)\b/);
    if (classMatch) {
        return { kind: 'class', indent: classMatch[1], name: classMatch[2] };
    }

    const methodMatch = line.match(/^(\s*)(?:public|protected|private|internal)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|async\s+|sealed\s+|new\s+)*([A-Za-z_][\w<>,.?\[\]]*)\s+([A-Za-z_][\w]*)\s*\(([^;]*)\)\s*(?:where\s+[^\{]+)?\s*\{/);
    if (methodMatch) {
        return {
            kind: 'function',
            indent: methodMatch[1],
            returnType: methodMatch[2].trim(),
            name: methodMatch[3],
            params: methodMatch[4],
        };
    }

    return null;
}

/**
 * 判断文件顶部是否已有语言标准的文档注释。
 *
 * @private
 * @param {string[]} lines - 源码行
 * @param {'java'|'csharp'} language - 语言
 * @returns {boolean} 是否已有文件级文档注释
 */
function _hasLeadingFileDoc(lines, language) {
    const firstContentLine = lines.find((line) => line.trim() !== '');
    if (!firstContentLine) {
        return false;
    }

    if (language === 'java') {
        return firstContentLine.trim().startsWith('/**');
    }

    return firstContentLine.trim().startsWith('///');
}

/**
 * 判断声明前是否已有紧邻文档注释。
 *
 * @private
 * @param {string[]} lines - 源码行
 * @param {number} index - 声明行下标
 * @param {'java'|'csharp'} language - 语言
 * @returns {boolean} 是否已有文档注释
 */
function _hasLeadingLanguageDoc(lines, index, language) {
    let cursor = index - 1;
    while (cursor >= 0 && lines[cursor].trim() === '') {
        cursor -= 1;
    }
    if (cursor < 0) {
        return false;
    }

    if (language === 'csharp') {
        return lines[cursor].trim().startsWith('///');
    }

    if (lines[cursor].trim() !== '*/') {
        return false;
    }

    while (cursor >= 0) {
        const trimmed = lines[cursor].trim();
        if (trimmed.startsWith('/**')) {
            return true;
        }
        if (trimmed.startsWith('/*')) {
            return false;
        }
        cursor -= 1;
    }

    return false;
}

/**
 * 构建类注释块。
 *
 * @private
 * @param {'java'|'csharp'} language - 语言
 * @param {string} indent - 缩进
 * @param {string} name - 类名
 * @returns {string[]} 注释块
 */
function _buildClassDoc(language, indent, name) {
    if (language === 'java') {
        return [
            `${indent}/**`,
            `${indent} * TODO: 补充 ${name} 的类说明。`,
            `${indent} */`,
        ];
    }

    return [
        `${indent}/// <summary>`,
        `${indent}/// TODO: 补充 ${name} 的类说明。`,
        `${indent}/// </summary>`,
    ];
}

/**
 * 构建方法注释块。
 *
 * @private
 * @param {'java'|'csharp'} language - 语言
 * @param {string} indent - 缩进
 * @param {string} name - 方法名
 * @param {string|undefined} paramsSource - 参数源码
 * @param {string|undefined} returnType - 返回值类型
 * @returns {string[]} 注释块
 */
function _buildMethodDoc(language, indent, name, paramsSource, returnType) {
    const paramNames = _extractTypedParamNames(paramsSource || '');
    const hasReturn = typeof returnType === 'string' && returnType.toLowerCase() !== 'void';

    if (language === 'java') {
        const block = [
            `${indent}/**`,
            `${indent} * TODO: 补充 ${name} 的方法说明。`,
        ];
        paramNames.forEach((paramName) => {
            block.push(`${indent} * @param ${paramName} TODO: 补充参数说明。`);
        });
        if (hasReturn) {
            block.push(`${indent} * @return TODO: 补充返回值说明。`);
        }
        block.push(`${indent} */`);
        return block;
    }

    const block = [
        `${indent}/// <summary>`,
        `${indent}/// TODO: 补充 ${name} 的方法说明。`,
        `${indent}/// </summary>`,
    ];
    paramNames.forEach((paramName) => {
        block.push(`${indent}/// <param name="${paramName}">TODO: 补充参数说明。</param>`);
    });
    if (hasReturn) {
        block.push(`${indent}/// <returns>TODO: 补充返回值说明。</returns>`);
    }

    return block;
}

/**
 * 从 Java/C# 参数列表中提取参数名。
 *
 * @private
 * @param {string} paramsSource - 参数源码
 * @returns {string[]} 参数名列表
 */
function _extractTypedParamNames(paramsSource) {
    return paramsSource
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            let p = part.replace(/=.+$/, '').trim();
            p = p.replace(/^\[[^\]]+\]\s*/g, '');
            p = p.replace(/^@\w+(?:\([^)]*\))?\s*/g, '');
            p = p.replace(/^(?:final|ref|out|in|params)\s+/, '');
            const match = p.match(/([A-Za-z_][\w]*)\s*(?:\[\])?$/);
            return match ? match[1] : 'param';
        });
}

module.exports = { codeAddJsdocFile };
