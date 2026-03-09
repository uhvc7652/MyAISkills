/**
 * @fileoverview JSDoc 注释补全技能实现
 * 为 JavaScript 或 TypeScript 代码补充基础 JSDoc 模板。
 * @module skills/code/code_add_jsdoc
 */

'use strict';

/**
 * JSDoc 补全技能的输入参数。
 * @typedef {Object} CodeAddJsdocParams
 * @property {string} code - 需要补充注释的源码字符串
 * @property {'javascript'|'typescript'} [language='javascript'] - 源码语言
 * @property {boolean} [include_fileoverview=true] - 是否补充文件级 @fileoverview 注释
 * @property {boolean} [include_private=false] - 是否为以下划线开头的私有符号补充注释
 */

/**
 * 单条新增注释记录。
 * @typedef {Object} AddedJsdocBlock
 * @property {'file'|'function'|'class'} type - 注释对应的代码元素类型
 * @property {string} name - 代码元素名称
 * @property {number} line - 注释插入后的起始行号（从 1 计数）
 */

/**
 * JSDoc 补全技能的输出结果。
 * @typedef {Object} CodeAddJsdocResult
 * @property {boolean} success - 补全是否成功
 * @property {string} documented_code - 补充注释后的完整代码
 * @property {AddedJsdocBlock[]} added_blocks - 新增注释列表
 * @property {number} duration_ms - 执行耗时（毫秒）
 */

/**
 * 为 JavaScript / TypeScript 代码补充基础 JSDoc 注释模板。
 *
 * 该实现使用轻量规则识别文件头、函数声明、箭头函数和类声明，
 * 仅为缺少 JSDoc 的代码块生成占位注释，便于后续由开发者或 AI 继续完善。
 * 当前规则仅匹配单行函数 / 类声明，不处理跨多行拆开的函数签名。
 *
 * @async
 * @function codeAddJsdoc
 * @param {CodeAddJsdocParams} params - 补全参数
 * @returns {Promise<CodeAddJsdocResult>} 包含补全后代码和新增注释摘要的对象
 * @throws {Error} 当 `code` 为空或 `language` 不受支持时抛出错误
 *
 * @example
 * const result = await codeAddJsdoc({
 *   code: "const greet = (name) => `Hello ${name}`;\n",
 *   language: 'javascript',
 * });
 * console.log(result.documented_code);
 */
async function codeAddJsdoc(params) {
  const {
    code,
    language = 'javascript',
    include_fileoverview = true,
    include_private = false,
  } = params;

  const SUPPORTED_LANGUAGES = ['javascript', 'typescript'];
  if (!code || code.trim() === '') {
    throw new Error('参数 code 不能为空');
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`不支持的语言：${language}`);
  }

  const start = Date.now();
  const lineEnding = code.includes('\r\n') ? '\r\n' : '\n';
  const sourceLines = code.split(/\r?\n/);
  const outputLines = [];
  const addedBlocks = [];

  if (include_fileoverview && !_hasFileoverview(sourceLines)) {
    const fileBlock = [
      '/**',
      ' * @fileoverview TODO: 补充当前文件说明。',
      ' */',
      '',
    ];
    outputLines.push(...fileBlock);
    addedBlocks.push({ type: 'file', name: '@fileoverview', line: 1 });
  }

  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    const declaration = _matchDeclaration(line);

    if (declaration && !_hasLeadingJsdoc(sourceLines, index)) {
      const isPrivate = declaration.name.startsWith('_');
      if (!isPrivate || include_private) {
        const block = declaration.kind === 'class'
          ? _buildClassJsdoc(declaration.indent, declaration.name)
          : _buildFunctionJsdoc(declaration.indent, declaration.name, declaration.params);

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
    success: true,
    documented_code: outputLines.join(lineEnding),
    added_blocks: addedBlocks,
    duration_ms: Date.now() - start,
  };
}

/**
 * 识别当前行是否为支持的声明语句。
 *
 * @private
 * @param {string} line - 当前源码行
 * @returns {{kind: 'function'|'class', name: string, indent: string, params?: string}|null}
 *   匹配到的声明信息；未匹配时返回 null
 */
function _matchDeclaration(line) {
  const functionMatch = line.match(/^(\s*)(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/);
  if (functionMatch) {
    return {
      kind: 'function',
      indent: functionMatch[1],
      name: functionMatch[2],
      params: functionMatch[3],
    };
  }

  const arrowFunctionMatch = line.match(/^(\s*)(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\((.*)\)\s*=>/);
  if (arrowFunctionMatch) {
    return {
      kind: 'function',
      indent: arrowFunctionMatch[1],
      name: arrowFunctionMatch[2],
      params: arrowFunctionMatch[3],
    };
  }

  const singleParamArrowFunctionMatch = line.match(/^(\s*)(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?([A-Za-z_$][\w$]*)\s*=>/);
  if (singleParamArrowFunctionMatch) {
    return {
      kind: 'function',
      indent: singleParamArrowFunctionMatch[1],
      name: singleParamArrowFunctionMatch[2],
      params: singleParamArrowFunctionMatch[3],
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

/**
 * 判断文件是否已经包含 @fileoverview 注释。
 *
 * @private
 * @param {string[]} lines - 源码行列表
 * @returns {boolean} 是否已包含文件级注释
 */
function _hasFileoverview(lines) {
  return lines.some((line) => line.includes('@fileoverview'));
}

/**
 * 判断声明前是否已经存在紧邻的 JSDoc 注释。
 *
 * @private
 * @param {string[]} lines - 源码行列表
 * @param {number} index - 当前声明的行下标
 * @returns {boolean} 声明前是否已存在 JSDoc
 */
function _hasLeadingJsdoc(lines, index) {
  let cursor = index - 1;
  while (cursor >= 0 && lines[cursor].trim() === '') {
    cursor -= 1;
  }

  if (cursor < 0 || lines[cursor].trim() !== '*/') {
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
 * 根据函数签名生成 JSDoc 注释块。
 *
 * @private
 * @param {string} indent - 原始缩进
 * @param {string} name - 函数名
 * @param {string} paramsSource - 函数参数字符串
 * @returns {string[]} JSDoc 注释行列表
 */
function _buildFunctionJsdoc(indent, name, paramsSource) {
  const paramNames = _extractParamNames(paramsSource);
  const block = [
    `${indent}/**`,
    `${indent} * TODO: 补充 ${name} 的函数说明。`,
  ];

  paramNames.forEach((paramName) => {
    block.push(`${indent} * @param {*} ${paramName} - TODO: 补充参数说明。`);
  });

  block.push(`${indent} * @returns {*} TODO: 补充返回值说明。`);
  block.push(`${indent} */`);
  return block;
}

/**
 * 为类声明生成 JSDoc 注释块。
 *
 * @private
 * @param {string} indent - 原始缩进
 * @param {string} name - 类名
 * @returns {string[]} JSDoc 注释行列表
 */
function _buildClassJsdoc(indent, name) {
  return [
    `${indent}/**`,
    `${indent} * TODO: 补充 ${name} 的类说明。`,
    `${indent} */`,
  ];
}

/**
 * 从函数签名中提取参数名列表。
 *
 * @private
 * @param {string} paramsSource - 函数参数字符串
 * @returns {string[]} 参数名列表
 */
function _extractParamNames(paramsSource) {
  let generatedParamIndex = 0;

  return paramsSource
    .split(',')
    .map((param) => param.trim())
    .filter(Boolean)
    .map((param) => {
      const withoutDefault = param.split('=')[0].trim();
      const withoutType = withoutDefault.split(':')[0].trim().replace(/^\.\.\./, '');
      if (withoutType.startsWith('{') || withoutType.startsWith('[')) {
        generatedParamIndex += 1;
        return `destructured_${generatedParamIndex}`;
      }
      if (withoutType) {
        return withoutType;
      }

      generatedParamIndex += 1;
      return `param_${generatedParamIndex}`;
    });
}

module.exports = { codeAddJsdoc };
