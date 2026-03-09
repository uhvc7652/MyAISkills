# code_add_jsdoc

## Description
为 JavaScript/TypeScript 代码自动生成 JSDoc 文档注释，包括函数说明、参数类型和返回值。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要添加 JSDoc 的 JavaScript/TypeScript 代码

### include_examples (optional)
- Type: boolean
- Description: 是否在文档中包含使用示例
- Default: false

### include_types (optional)
- Type: boolean
- Description: 是否推断并添加类型注解
- Default: true

## Returns
返回包含以下字段的对象：
- `documented_code`: 添加 JSDoc 注释后的代码
- `changes`: 添加的文档列表，每项包含：
  - `target`: 文档目标（函数名、类名等）
  - `type`: 文档类型（function, class, method）
  - `tags`: 使用的 JSDoc 标签列表

## Example Usage

### Example 1: Document Function
**Input:**
```json
{
  "code": "function add(a, b) {\\n  return a + b;\\n}",
  "include_types": true
}
```

**Output:**
```json
{
  "documented_code": "/**\\n * Add two numbers together\\n * @param {number} a - First number\\n * @param {number} b - Second number\\n * @returns {number} Sum of a and b\\n */\\nfunction add(a, b) {\\n  return a + b;\\n}",
  "changes": [
    {
      "target": "add",
      "type": "function",
      "tags": ["param", "returns"]
    }
  ]
}
```

### Example 2: Document with Examples
**Input:**
```json
{
  "code": "function multiply(x, y) {\\n  return x * y;\\n}",
  "include_examples": true,
  "include_types": true
}
```

**Output:**
```json
{
  "documented_code": "/**\\n * Multiply two numbers\\n * @param {number} x - First number\\n * @param {number} y - Second number\\n * @returns {number} Product of x and y\\n * @example\\n * multiply(3, 4) // returns 12\\n */\\nfunction multiply(x, y) {\\n  return x * y;\\n}",
  "changes": [
    {
      "target": "multiply",
      "type": "function",
      "tags": ["param", "returns", "example"]
    }
  ]
}
```

## Usage Instructions
1. 准备 JavaScript/TypeScript 代码
2. 决定是否包含类型注解和使用示例
3. 调用 code_add_jsdoc 技能
4. 审查生成的 JSDoc 注释
5. 根据需要调整注释内容

## Related Skills
- code_add_comments: 添加通用注释
- code_analyze: 代码分析
- code_generate_tests: 生成测试
