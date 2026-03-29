/**
 * @fileoverview Godot 场景绑定重构建议技能实现
 * @module skills/code/code_godot_scene_binding_refactor
 */

'use strict';

/**
 * @typedef {Object} GodotSceneBindingRefactorParams
 * @property {string} code - 需要分析的源码字符串
 * @property {'csharp'|'gdscript'} [language='csharp'] - 编程语言
 * @property {boolean} [prefer_wrapper_methods=true] - 是否优先建议行为方法封装
 */

/**
 * @typedef {Object} GodotSceneBindingFinding
 * @property {'low'|'medium'|'high'} severity - 严重级别
 * @property {string} title - 问题标题
 * @property {string} evidence - 命中证据
 * @property {string} recommendation - 推荐改法
 */

/**
 * @typedef {Object} GodotSceneBindingRefactorResult
 * @property {boolean} success - 分析是否成功
 * @property {string} summary - 摘要
 * @property {GodotSceneBindingFinding[]} findings - 命中的问题列表
 * @property {string[]} suggested_steps - 推荐执行步骤
 * @property {number} duration_ms - 执行耗时
 */

/**
 * 分析 Godot 场景/预制体脚本中的节点访问方式，并给出重构建议。
 *
 * @async
 * @param {GodotSceneBindingRefactorParams} params - 分析参数
 * @returns {Promise<GodotSceneBindingRefactorResult>} 结构化分析结果
 */
async function codeGodotSceneBindingRefactor(params) {
  const {
    code,
    language = 'csharp',
    prefer_wrapper_methods = true,
  } = params;

  if (!code || code.trim() === '') {
    throw new Error('参数 code 不能为空');
  }

  if (!['csharp', 'gdscript'].includes(language)) {
    throw new Error(`不支持的语言：${language}`);
  }

  const start = Date.now();
  const findings = [];

  const nodePathPattern = /GetNode(?:OrNull)?<[^>]+>\(\s*"[^"]+"\s*\)|GetNode(?:OrNull)?\(\s*"[^"]+"\s*\)/g;
  const getterExposurePattern = /public\s+[A-Za-z0-9_<>,?]+\s+[A-Z][A-Za-z0-9_]*\s*=>\s*[a-z][A-Za-z0-9_]*\s*;/g;

  for (const match of code.match(nodePathPattern) || []) {
    findings.push({
      severity: 'high',
      title: '避免直接使用字符串路径访问节点',
      evidence: match,
      recommendation: prefer_wrapper_methods
        ? '将节点通过 [Export] 绑定到对应场景脚本，并由脚本提供 SetXxx、BindXxx、ShowXxx 等行为方法供外部调用。'
        : '将节点通过 [Export] 绑定到对应场景脚本，至少不要在业务代码里直接写节点路径字符串。',
    });
  }

  if (prefer_wrapper_methods) {
    for (const match of code.match(getterExposurePattern) || []) {
      findings.push({
        severity: 'medium',
        title: '避免直接暴露内部节点引用',
        evidence: match,
        recommendation: '优先暴露行为方法而不是节点属性，例如用 SetTitle、SetEditor、SetActions 替代直接返回 Label/Button/Container。',
      });
    }
  }

  const summary = findings.length > 0
    ? `检测到 ${findings.length} 处与 Godot 场景节点访问模式相关的问题。`
    : '未检测到明显的字符串路径访问或直接节点暴露问题。';

  const suggestedSteps = [
    '为场景或预制体补充对应脚本，并将内部节点改为 [Export] 绑定。',
    '在脚本中提供行为方法，例如 SetTitle、SetEditor、BindData、SetVisibleState。',
    '将调用方中的 GetNode/GetNodeOrNull 和节点属性访问改为脚本方法调用。',
    '保留运行期兜底创建逻辑时，也应避免再用字符串路径回查已有节点。',
  ];

  return {
    success: true,
    summary,
    findings,
    suggested_steps: suggestedSteps,
    duration_ms: Date.now() - start,
  };
}

module.exports = { codeGodotSceneBindingRefactor };