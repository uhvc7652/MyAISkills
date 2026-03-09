# code_analyze

## Description
对给定的代码进行静态分析，识别潜在问题、代码风格问题、安全漏洞，并给出改进建议。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要分析的代码字符串

### language (required)
- Type: string
- Description: 编程语言
- Allowed values: python, javascript, typescript, java, go, rust

### checks (optional)
- Type: array of strings
- Description: 要执行的检查类型列表
- Allowed values: syntax, style, security, performance, complexity
- Default: ["syntax", "style", "security"]

## Returns
返回包含以下字段的对象：
- `score`: 代码质量综合评分（0-100）
- `issues`: 问题列表，每项包含：
  - `line`: 问题所在行号
  - `severity`: 严重程度（low, medium, high, critical）
  - `type`: 问题类型
  - `message`: 问题描述
  - `fix`: 修复建议（可选）

## Example Usage

### Example 1: Security Check
**Input:**
```json
{
  "code": "password = '123456'\\nprint(password)",
  "language": "python",
  "checks": ["security"]
}
```

**Output:**
```json
{
  "score": 40,
  "issues": [
    {
      "line": 1,
      "severity": "high",
      "type": "security",
      "message": "硬编码明文密码，存在安全风险，建议使用环境变量或密钥管理服务"
    }
  ]
}
```

## Usage Instructions
1. 准备需要分析的代码片段
2. 指定编程语言
3. 选择需要执行的检查类型（可选，默认包含语法、风格和安全检查）
4. 调用 code_analyze 技能
5. 审查返回的问题列表和质量评分
6. 根据建议修改代码

## Related Skills
- code_refactor_suggest: 代码重构建议
- code_add_comments: 添加代码注释
- code_generate_tests: 生成测试用例
