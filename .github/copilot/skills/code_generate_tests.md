# code_generate_tests

## Description
为给定代码自动生成单元测试用例，提高代码测试覆盖率。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要生成测试的代码字符串

### language (required)
- Type: string
- Description: 编程语言
- Allowed values: python, javascript, typescript, java, go, rust

### framework (optional)
- Type: string
- Description: 测试框架
- Examples: pytest, jest, mocha, junit, go test
- Default: 根据语言自动选择

### coverage (optional)
- Type: string
- Description: 测试覆盖目标
- Allowed values: basic, normal, comprehensive
- Default: normal

## Returns
返回包含以下字段的对象：
- `test_code`: 生成的测试代码
- `test_cases`: 测试用例列表，每项包含：
  - `name`: 测试用例名称
  - `description`: 测试目的说明
  - `type`: 测试类型（positive, negative, edge, performance）

## Example Usage

### Example 1: Generate Basic Tests
**Input:**
```json
{
  "code": "function add(a, b) {\\n  return a + b;\\n}",
  "language": "javascript",
  "framework": "jest",
  "coverage": "normal"
}
```

**Output:**
```json
{
  "test_code": "describe('add', () => {\\n  test('should add two positive numbers', () => {\\n    expect(add(2, 3)).toBe(5);\\n  });\\n\\n  test('should handle negative numbers', () => {\\n    expect(add(-1, -2)).toBe(-3);\\n  });\\n});",
  "test_cases": [
    {
      "name": "should add two positive numbers",
      "description": "测试正数加法",
      "type": "positive"
    },
    {
      "name": "should handle negative numbers",
      "description": "测试负数处理",
      "type": "edge"
    }
  ]
}
```

## Usage Instructions
1. 准备需要测试的函数或类代码
2. 指定编程语言
3. 选择测试框架（可选，会自动推断）
4. 设置测试覆盖目标
5. 调用 code_generate_tests 技能
6. 审查生成的测试用例
7. 将测试代码添加到项目中并运行验证

## Related Skills
- code_analyze: 代码分析
- code_refactor_suggest: 重构建议
- code_execute: 执行代码
