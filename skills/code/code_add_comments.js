/**
 * @fileoverview 普通代码注释补全技能实现
 * 为 JavaScript、TypeScript、Java 或 C# 代码补充基础说明性注释。
 * @module skills/code/code_add_comments
 */

'use strict';

/**
 * 普通注释补全技能的输入参数。
 * @typedef {Object} CodeAddCommentsParams
 * @property {string} code - 需要补充注释的源码字符串
 * @property {'javascript'|'typescript'|'java'|'csharp'} [language='javascript'] - 源码语言
 * @property {boolean} [include_file_comment=true] - 是否补充文件顶部注释
 * @property {boolean} [include_inline_return_comments=false] - 是否补充 return 前的行内说明
 */

/**
 * 单条新增普通注释记录。
 * @typedef {Object} AddedComment
 * @property {'file'|'function'|'class'|'inline'} type - 注释对应的代码元素类型
 * @property {string} name - 代码元素名称
 * @property {number} line - 注释插入后的起始行号（从 1 计数）
 */

/**
 * 普通注释补全技能的输出结果。
 * @typedef {Object} CodeAddCommentsResult
 * @property {boolean} success - 补全是否成功
 * @property {string} commented_code - 补充注释后的完整代码
 * @property {AddedComment[]} added_comments - 新增注释列表
 * @property {number} duration_ms - 执行耗时（毫秒）
 */

/**
 * 为 JavaScript / TypeScript / Java / C# 代码补充普通说明注释。
 *
 * 当前实现采用轻量规则，仅处理单行函数 / 类声明，
 * 并可选地为尚未带前置注释的 return 语句补充简单说明。
 *
 * @async
 * @function codeAddComments
 * @param {CodeAddCommentsParams} params - 补全参数
 * @returns {Promise<CodeAddCommentsResult>} 包含补全后代码和新增注释摘要的对象
 * @throws {Error} 当 `code` 为空或 `language` 不受支持时抛出错误
 */
async function codeAddComments(params) {
  const {
    code,
    language = 'javascript',
    include_file_comment = true,
    include_inline_return_comments = false,
  } = params;

  const supportedLanguages = ['javascript', 'typescript', 'java', 'csharp'];
  if (!code || code.trim() === '') {
    throw new Error('参数 code 不能为空');
  }
  if (!supportedLanguages.includes(language)) {
    throw new Error(`不支持的语言：${language}`);
  }

  const start = Date.now();
  const lineEnding = code.includes('\r\n') ? '\r\n' : '\n';
  const sourceLines = code.split(/\r?\n/);
  const outputLines = [];
  const addedComments = [];

  if (include_file_comment && !_hasLeadingLineComment(sourceLines)) {
    outputLines.push('// TODO: 补充当前文件的用途说明。', '');
    addedComments.push({ type: 'file', name: 'file_comment', line: 1 });
  }

  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    const declaration = _matchCommentableDeclaration(line, language);

    if (declaration && !_hasLeadingPlainComment(sourceLines, index)) {
      outputLines.push(`${declaration.indent}// TODO: 说明 ${declaration.name} 的主要职责。`);
      addedComments.push({
        type: declaration.kind,
        name: declaration.name,
        line: outputLines.length,
      });
    }

    if (include_inline_return_comments && _isReturnLine(line) && !_hasImmediateLineComment(outputLines)) {
      const indent = line.match(/^(\s*)/)?.[1] ?? '';
      outputLines.push(`${indent}// TODO: 说明这里返回的结果含义。`);
      addedComments.push({
        type: 'inline',
        name: 'return',
        line: outputLines.length,
      });
    }

    outputLines.push(line);
  }

  return {
    success: true,
    commented_code: outputLines.join(lineEnding),
    added_comments: addedComments,
    duration_ms: Date.now() - start,
  };
}

/**
 * 识别当前行是否为可补充普通注释的声明。
 *
 * @private
 * @param {string} line - 当前源码行
 * @param {'javascript'|'typescript'|'java'|'csharp'} language - 源码语言
 * @returns {{kind: 'function'|'class', name: string, indent: string}|null} 声明信息
 */
function _matchCommentableDeclaration(line, language) {
  if (language === 'javascript' || language === 'typescript') {
    const functionMatch = line.match(/^(\s*)(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (functionMatch) {
      return {
        kind: 'function',
        indent: functionMatch[1],
        name: functionMatch[2],
      };
    }

    const arrowFunctionMatch = line.match(/^(\s*)(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\((.*)\)|([A-Za-z_$][\w$]*))\s*=>/);
    if (arrowFunctionMatch) {
      return {
        kind: 'function',
        indent: arrowFunctionMatch[1],
        name: arrowFunctionMatch[2],
      };
    }

    const classMatch = line.match(/^(\s*)(?:export\s+)?class\s+([A-Za-z_$][\w$]*)\b/);
    if (classMatch) {
      return {
        kind: 'class',
        indent: classMatch[1],
        name: classMatch[2],
      };
    }

    return null;
  }

  if (language === 'java') {
    const classMatch = line.match(/^(\s*)(?:public|protected|private)?\s*(?:abstract\s+|final\s+)?class\s+([A-Za-z_][\w]*)\b/);
    if (classMatch) {
      return {
        kind: 'class',
        indent: classMatch[1],
        name: classMatch[2],
      };
    }

    const methodMatch = line.match(/^(\s*)(?:public|protected|private)\s+(?:static\s+)?(?:final\s+)?(?:synchronized\s+)?(?:<[^>]+>\s+)?[A-Za-z_][\w<>\[\], ?]*\s+([A-Za-z_][\w]*)\s*\([^;]*\)\s*(?:throws\s+[A-Za-z_][\w.,\s]*)?\s*\{/);
    if (methodMatch && methodMatch[2] !== 'if' && methodMatch[2] !== 'for' && methodMatch[2] !== 'while') {
      return {
        kind: 'function',
        indent: methodMatch[1],
        name: methodMatch[2],
      };
    }

    return null;
  }

  if (language === 'csharp') {
    const classMatch = line.match(/^(\s*)(?:public|protected|private|internal)\s+(?:abstract\s+|sealed\s+|static\s+|partial\s+)*class\s+([A-Za-z_][\w]*)\b/);
    if (classMatch) {
      return {
        kind: 'class',
        indent: classMatch[1],
        name: classMatch[2],
      };
    }

    const methodMatch = line.match(/^(\s*)(?:public|protected|private|internal)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|async\s+|sealed\s+|new\s+)*[A-Za-z_][\w<>,.?\[\]]*\s+([A-Za-z_][\w]*)\s*\([^;]*\)\s*(?:where\s+[^\{]+)?\s*\{/);
    if (methodMatch && methodMatch[2] !== 'if' && methodMatch[2] !== 'for' && methodMatch[2] !== 'while' && methodMatch[2] !== 'switch') {
      return {
        kind: 'function',
        indent: methodMatch[1],
        name: methodMatch[2],
      };
    }

    return null;
  }

  return null;
}

/**
 * 判断文件顶部是否已有普通注释。
 *
 * @private
 * @param {string[]} lines - 源码行列表
 * @returns {boolean} 是否已有顶部普通注释
 */
function _hasLeadingLineComment(lines) {
  const firstContentLine = lines.find((line) => line.trim() !== '');
  return typeof firstContentLine === 'string' && firstContentLine.trim().startsWith('//');
}

/**
 * 判断声明前是否已有普通注释。
 *
 * @private
 * @param {string[]} lines - 源码行列表
 * @param {number} index - 当前声明下标
 * @returns {boolean} 是否已有前置普通注释
 */
function _hasLeadingPlainComment(lines, index) {
  let cursor = index - 1;
  while (cursor >= 0 && lines[cursor].trim() === '') {
    cursor -= 1;
  }

  return cursor >= 0 && lines[cursor].trim().startsWith('//');
}

/**
 * 判断当前行是否为 return 语句。
 *
 * @private
 * @param {string} line - 当前源码行
 * @returns {boolean} 是否为 return 语句
 */
function _isReturnLine(line) {
  return /^\s*return\b/.test(line);
}

/**
 * 判断输出中上一行是否已是普通注释。
 *
 * @private
 * @param {string[]} outputLines - 当前输出行列表
 * @returns {boolean} 上一行是否为普通注释
 */
function _hasImmediateLineComment(outputLines) {
  if (outputLines.length === 0) {
    return false;
  }
  return outputLines[outputLines.length - 1].trim().startsWith('//');
}

module.exports = { codeAddComments };
