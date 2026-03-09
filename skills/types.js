/**
 * @fileoverview MyAISkills 全局 JSDoc 类型定义
 * 本文件仅用于类型声明，不包含运行时逻辑。
 * 所有技能实现文件均引用此处定义的类型。
 */

/**
 * 技能参数的属性描述。
 * @typedef {Object} ParamProperty
 * @property {string} type        - JSON Schema 类型，如 'string'、'integer'、'boolean'
 * @property {string} description - 参数的自然语言说明
 * @property {*}      [default]   - 参数的默认值（可选）
 * @property {*[]}    [enum]      - 枚举值列表（可选）
 * @property {number} [minimum]   - 数值类型的最小值（可选）
 * @property {number} [maximum]   - 数值类型的最大值（可选）
 */

/**
 * 技能参数的 JSON Schema 定义。
 * @typedef {Object} SkillParameters
 * @property {'object'}                        type       - 固定为 'object'
 * @property {Object.<string, ParamProperty>}  properties - 各参数的描述映射
 * @property {string[]}                        [required] - 必填参数名称列表
 */

/**
 * 技能返回值的结构描述。
 * @typedef {Object} SkillReturns
 * @property {string} type        - 返回值的 JSON Schema 类型
 * @property {string} description - 返回值的自然语言说明
 */

/**
 * 技能的输入/输出示例。
 * @typedef {Object} SkillExample
 * @property {Object} input  - 示例输入对象
 * @property {Object} output - 示例输出对象
 */

/**
 * 技能定义的完整结构，对应 schema/skill.schema.json。
 * @typedef {Object} SkillDefinition
 * @property {string}         name        - 技能唯一标识符（小写字母+下划线）
 * @property {string}         description - 技能功能描述，AI 依此判断何时调用
 * @property {'web'|'code'|'file'|'data'|'utility'} category - 所属类别
 * @property {string}         version     - 语义化版本号，如 '1.0.0'
 * @property {SkillParameters} parameters - 技能参数的 JSON Schema
 * @property {SkillReturns}   [returns]   - 返回值结构描述（可选）
 * @property {SkillExample[]} [examples]  - 输入/输出示例列表（可选）
 */

/**
 * 技能执行结果的通用结构。
 * @typedef {Object} SkillResult
 * @property {boolean} success       - 执行是否成功
 * @property {*}       [data]        - 成功时的返回数据
 * @property {string}  [error]       - 失败时的错误信息
 * @property {number}  [duration_ms] - 执行耗时（毫秒）
 */

/**
 * 技能处理函数的签名。
 * @template TInput  输入参数类型
 * @template TOutput 输出结果类型
 * @callback SkillHandler
 * @param {TInput} params - 调用技能时传入的参数对象
 * @returns {Promise<TOutput>} 技能执行结果
 */

/**
 * 注册到技能注册表中的技能条目。
 * @typedef {Object} RegisteredSkill
 * @property {SkillDefinition} definition - 技能的 JSON 定义
 * @property {SkillHandler}    handler    - 技能的执行函数
 */
