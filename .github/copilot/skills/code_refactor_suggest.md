# code_refactor_suggest

## Description
分析代码并提供重构建议，帮助改善代码结构、可读性和可维护性。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要重构建议的代码字符串

### language (required)
- Type: string
- Description: 编程语言
- Allowed values: python, javascript, typescript, java, go, rust

### focus (optional)
- Type: array of strings
- Description: 关注的重构方向
- Allowed values: readability, performance, maintainability, testability
- Default: ["readability", "maintainability"]

## Returns
返回包含以下字段的对象：
- `suggestions`: 重构建议列表，每项包含：
  - `type`: 建议类型
  - `priority`: 优先级（low, medium, high）
  - `description`: 建议描述
  - `before`: 重构前代码示例
  - `after`: 重构后代码示例
  - `benefit`: 预期收益说明

## Example Usage

### Example 1: Readability Improvement
**Input:**
```json
{
  "code": "def f(x,y):\\n    return x*y+x/y-y",
  "language": "python",
  "focus": ["readability"]
}
```

**Output:**
```json
{
  "suggestions": [
    {
      "type": "naming",
      "priority": "high",
      "description": "使用更具描述性的函数名和参数名",
      "before": "def f(x,y):",
      "after": "def calculate_combined_result(dividend, divisor):",
      "benefit": "提高代码可读性，让其他开发者更容易理解函数用途"
    }
  ]
}
```

## Usage Instructions
1. 准备需要重构的代码片段
2. 指定编程语言
3. 选择关注的重构方向（可选）
4. 调用 code_refactor_suggest 技能
5. 审查重构建议
6. 根据优先级和项目需求应用合适的重构

## Related Skills
- code_analyze: 代码分析
- code_add_comments: 添加注释
- code_generate_tests: 生成测试
