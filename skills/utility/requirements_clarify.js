/**
 * @fileoverview 需求澄清与方案取舍问题生成技能
 * 在执行任务前生成高价值追问，帮助 AI 与用户对齐实现细节、分支取舍和可选项。
 * @module skills/utility/requirements_clarify
 */

'use strict';

/** @typedef {import('../types.js').SkillResult} SkillResult */

/** @typedef {'implementation_details'|'branch_tradeoffs'|'optional_features'|'constraints'|'acceptance_criteria'|'risks'} FocusArea */
/** @typedef {'high'|'medium'|'low'} Priority */
/** @typedef {'concise'|'detailed'} QuestionStyle */

/**
 * @typedef {Object} RequirementsClarifyParams
 * @property {string} problem_statement - 用户问题描述
 * @property {string} [context] - 补充上下文
 * @property {FocusArea[]} [focus_areas] - 追问重点方向
 * @property {number} [max_questions=12] - 最多输出的问题数量（6-30）
 * @property {QuestionStyle} [question_style='concise'] - 问句风格
 * @property {boolean} [include_priority=true] - 是否附带优先级
 */

/**
 * @typedef {Object} ClarifyQuestion
 * @property {string} id - 问题编号
 * @property {FocusArea} category - 问题所属分类
 * @property {Priority} [priority] - 问题优先级
 * @property {string} question - 可直接向用户提问的问题
 * @property {string} why_it_matters - 提问价值说明
 * @property {string[]} [options_hint] - 可选项提示
 */

/**
 * @typedef {Object} RequirementsClarifyResult
 * @property {boolean} success - 是否成功
 * @property {string} summary - 结果摘要
 * @property {string} inferred_topic - 推断主题
 * @property {FocusArea[]} focus_areas - 实际使用的追问方向
 * @property {number} question_count - 输出问题数
 * @property {ClarifyQuestion[]} questions - 问题清单
 * @property {string[]} decision_checklist - 决策检查清单
 * @property {number} duration_ms - 执行耗时
 */

/** @type {FocusArea[]} */
const DEFAULT_FOCUS_AREAS = [
    'implementation_details',
    'branch_tradeoffs',
    'optional_features',
    'constraints',
    'acceptance_criteria',
    'risks',
];

/** @type {Record<FocusArea, Priority>} */
const PRIORITY_BY_AREA = {
    implementation_details: 'high',
    branch_tradeoffs: 'high',
    optional_features: 'medium',
    constraints: 'high',
    acceptance_criteria: 'high',
    risks: 'medium',
};

/**
 * 生成需求澄清问题清单。
 *
 * @async
 * @function requirementsClarify
 * @param {RequirementsClarifyParams} params - 技能输入参数
 * @returns {Promise<RequirementsClarifyResult>} 结构化追问结果
 */
async function requirementsClarify(params) {
    const {
        problem_statement,
        context = '',
        focus_areas,
        max_questions = 12,
        question_style = 'concise',
        include_priority = true,
    } = params;

    if (!problem_statement || !problem_statement.trim()) {
        throw new Error('参数 problem_statement 不能为空');
    }
    if (max_questions < 6 || max_questions > 30) {
        throw new Error('参数 max_questions 必须在 6-30 之间');
    }
    if (!['concise', 'detailed'].includes(question_style)) {
        throw new Error('参数 question_style 仅支持 concise 或 detailed');
    }

    const start = Date.now();
    const selectedAreas = _normalizeFocusAreas(focus_areas);
    const topic = _inferTopic(problem_statement);

    let bank = [];
    for (const area of selectedAreas) {
        bank = bank.concat(_buildQuestionTemplates(area, topic, question_style));
    }

    if (context.trim()) {
        bank.push(_buildContextQuestion(context, question_style));
    }

    const questions = bank.slice(0, max_questions).map((item, index) => {
        /** @type {ClarifyQuestion} */
        const question = {
            id: `Q${index + 1}`,
            category: item.category,
            question: item.question,
            why_it_matters: item.why_it_matters,
        };

        if (include_priority) {
            question.priority = PRIORITY_BY_AREA[item.category] || 'medium';
        }
        if (item.options_hint && item.options_hint.length > 0) {
            question.options_hint = item.options_hint;
        }
        return question;
    });

    return {
        success: true,
        summary: '已生成可直接向用户提问的澄清清单，覆盖实现方案细节、分支取舍和可选功能。',
        inferred_topic: topic,
        focus_areas: selectedAreas,
        question_count: questions.length,
        questions,
        decision_checklist: _buildDecisionChecklist(selectedAreas),
        duration_ms: Date.now() - start,
    };
}

/**
 * 规范化焦点分类。
 *
 * @private
 * @param {FocusArea[]|undefined} focusAreas - 原始分类
 * @returns {FocusArea[]} 标准分类数组
 */
function _normalizeFocusAreas(focusAreas) {
    if (!Array.isArray(focusAreas) || focusAreas.length === 0) {
        return DEFAULT_FOCUS_AREAS;
    }

    const set = new Set();
    for (const area of focusAreas) {
        if (DEFAULT_FOCUS_AREAS.includes(area)) {
            set.add(area);
        }
    }

    return set.size > 0 ? [...set] : DEFAULT_FOCUS_AREAS;
}

/**
 * 根据问题文本推断主题。
 *
 * @private
 * @param {string} problemStatement - 原始问题文本
 * @returns {string} 推断主题
 */
function _inferTopic(problemStatement) {
    const text = problemStatement.trim().replace(/\s+/g, ' ');
    if (text.length <= 28) return text;
    return `${text.slice(0, 28)}...`;
}

/**
 * 构建各分类问题模板。
 *
 * @private
 * @param {FocusArea} area - 分类
 * @param {string} topic - 推断主题
 * @param {QuestionStyle} style - 问句风格
 * @returns {{ category: FocusArea, question: string, why_it_matters: string, options_hint?: string[] }[]} 问题模板数组
 */
function _buildQuestionTemplates(area, topic, style) {
    const concise = {
        implementation_details: [
            _q(area, `关于“${topic}”，最小可交付版本（MVP）具体包含哪些功能边界？`, '先锁定范围，避免实现阶段反复返工。'),
            _q(area, `优先做前端/后端/数据层中的哪一层？是否有固定开发顺序？`, '明确实现路径可降低协作与排期风险。', ['先接口后页面', '先页面后接口', '并行开发']),
            _q(area, '是否已有必须复用的技术栈、组件或接口规范？', '减少重复建设并保持系统一致性。'),
        ],
        branch_tradeoffs: [
            _q(area, '如果时间不足，哪些功能可以降级或延后？', '提前定义取舍规则，避免最后时刻无序删减。'),
            _q(area, '你更看重上线速度、可扩展性还是实现复杂度最低？', '确认主目标后，技术决策会更一致。', ['上线速度优先', '可扩展性优先', '实现简单优先']),
            _q(area, '遇到多方案并行时，是否需要我先给出对比表再由你拍板？', '明确决策方式，减少沟通回合。'),
        ],
        optional_features: [
            _q(area, '有哪些“可选但加分”的功能，应该放在第二阶段？', '区分必做与可选，便于里程碑管理。'),
            _q(area, '是否需要预留开关配置，方便后续按需启用可选功能？', '可选功能开关可降低未来改造成本。'),
            _q(area, '你希望我默认开启哪些高级选项，哪些保持关闭？', '默认值决定了用户第一体验和风险暴露范围。'),
        ],
        constraints: [
            _q(area, '上线时间、性能指标、预算或合规方面有哪些硬约束？', '硬约束直接决定技术路线可行性。'),
            _q(area, '是否存在不可变更的外部依赖（第三方 API、旧数据库、审计要求）？', '提前识别外部限制，避免后期阻塞。'),
        ],
        acceptance_criteria: [
            _q(area, '你希望用哪些验收标准判断“功能完成”？', '验收标准决定交付边界。'),
            _q(area, '是否需要我给出可执行的测试清单（正常流、异常流、边界流）？', '明确测试口径可减少争议。'),
        ],
        risks: [
            _q(area, '你最担心的失败场景是什么？我会按这个优先做防护。', '风险优先级影响防护设计顺序。'),
            _q(area, '是否需要预案：回滚策略、灰度发布、监控告警？', '提前准备预案可以显著降低上线风险。'),
        ],
    };

    const detailed = {
        implementation_details: concise.implementation_details.map((item) => ({
            ...item,
            question: `为了更准确地实现“${topic}”，${item.question}`,
        })),
        branch_tradeoffs: concise.branch_tradeoffs.map((item) => ({
            ...item,
            question: `在方案分支取舍上，${item.question}`,
        })),
        optional_features: concise.optional_features.map((item) => ({
            ...item,
            question: `在可选功能规划上，${item.question}`,
        })),
        constraints: concise.constraints.map((item) => ({
            ...item,
            question: `为确保方案落地，${item.question}`,
        })),
        acceptance_criteria: concise.acceptance_criteria.map((item) => ({
            ...item,
            question: `为了避免验收分歧，${item.question}`,
        })),
        risks: concise.risks.map((item) => ({
            ...item,
            question: `在风险控制上，${item.question}`,
        })),
    };

    return style === 'detailed' ? detailed[area] : concise[area];
}

/**
 * 基于上下文追加补充问题。
 *
 * @private
 * @param {string} context - 用户提供的上下文
 * @param {QuestionStyle} style - 问句风格
 * @returns {{ category: FocusArea, question: string, why_it_matters: string }} 追加问题
 */
function _buildContextQuestion(context, style) {
    const shortContext = context.trim().replace(/\s+/g, ' ').slice(0, 40);
    const prefix = style === 'detailed' ? '结合你提供的上下文，' : '';

    return {
        category: 'implementation_details',
        question: `${prefix}“${shortContext}”中哪些信息是必须严格遵守、不能调整的？`,
        why_it_matters: '将上下文中的硬条件提前固化，能减少后续变更。',
    };
}

/**
 * 组装问题对象。
 *
 * @private
 * @param {FocusArea} category - 问题分类
 * @param {string} question - 问题文本
 * @param {string} whyItMatters - 价值说明
 * @param {string[]} [optionsHint] - 可选项提示
 * @returns {{ category: FocusArea, question: string, why_it_matters: string, options_hint?: string[] }} 问题对象
 */
function _q(category, question, whyItMatters, optionsHint) {
    if (Array.isArray(optionsHint) && optionsHint.length > 0) {
        return { category, question, why_it_matters: whyItMatters, options_hint: optionsHint };
    }
    return { category, question, why_it_matters: whyItMatters };
}

/**
 * 生成决策检查清单。
 *
 * @private
 * @param {FocusArea[]} areas - 问题分类
 * @returns {string[]} 决策检查清单
 */
function _buildDecisionChecklist(areas) {
    const list = ['明确 MVP 范围并标记非目标项'];

    if (areas.includes('branch_tradeoffs')) {
        list.push('确认主目标优先级（速度/质量/扩展性）并冻结取舍原则');
    }
    if (areas.includes('optional_features')) {
        list.push('区分必须项与可选项，并定义默认开关策略');
    }
    if (areas.includes('constraints')) {
        list.push('记录硬约束（时间、合规、预算、外部依赖）并评估可行性');
    }
    if (areas.includes('acceptance_criteria')) {
        list.push('定义可执行验收标准与测试场景覆盖范围');
    }
    if (areas.includes('risks')) {
        list.push('准备风险预案（监控、灰度、回滚）');
    }

    return list;
}

module.exports = { requirementsClarify };
