# code_add_comments

## Description
为代码自动添加清晰、有意义的注释，提高代码可读性和可维护性。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要添加注释的代码字符串

### language (required)
- Type: string
- Description: 编程语言
- Allowed values: python, javascript, typescript, java, go, rust

### style (optional)
- Type: string
- Description: 注释风格
- Allowed values: brief, detailed, docstring
- Default: brief

## Returns
返回包含以下字段的对象：
- `annotated_code`: 添加注释后的完整代码
- `changes`: 变更说明列表，每项包含：
  - `line`: 添加注释的行号
  - `type`: 注释类型（function, class, block, inline）
  - `comment`: 添加的注释内容

## Example Usage

### Example 1: Add Brief Comments
**Input:**
```json
{
  "code": "function calc(a, b) {\\n  return a * b + Math.sqrt(a);\\n}",
  "language": "javascript",
  "style": "brief"
}
```

**Output:**
```json
{
  "annotated_code": "// Calculate combined result\\nfunction calc(a, b) {\\n  // Multiply a by b and add square root of a\\n  return a * b + Math.sqrt(a);\\n}",
  "changes": [
    {
      "line": 1,
      "type": "function",
      "comment": "Calculate combined result"
    },
    {
      "line": 2,
      "type": "inline",
      "comment": "Multiply a by b and add square root of a"
    }
  ]
}
```

## Usage Instructions
1. 准备需要添加注释的代码
2. 指定编程语言
3. 选择注释风格（简短、详细或文档字符串）
4. 调用 code_add_comments 技能
5. 审查添加的注释
6. 根据需要调整注释内容

## Related Skills
- code_add_jsdoc: 添加 JSDoc 文档
- code_analyze: 代码分析
- code_refactor_suggest: 重构建议
