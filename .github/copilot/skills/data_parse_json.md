# data_parse_json

## Description
解析 JSON 字符串并进行验证，支持 JSON Schema 校验和错误诊断。

## Category
data

## Parameters

### json_string (required)
- Type: string
- Description: 需要解析的 JSON 字符串

### schema (optional)
- Type: object
- Description: JSON Schema 对象，用于验证数据结构

### strict (optional)
- Type: boolean
- Description: 是否启用严格模式（不允许额外字段）
- Default: false

## Returns
返回包含以下字段的对象：
- `data`: 解析后的 JSON 对象
- `valid`: 是否通过 schema 验证（如果提供了 schema）
- `errors`: 验证错误列表（如果有）

## Example Usage

### Example 1: Simple Parse
**Input:**
```json
{
  "json_string": "{\"name\": \"Alice\", \"age\": 30}"
}
```

**Output:**
```json
{
  "data": {
    "name": "Alice",
    "age": 30
  },
  "valid": true,
  "errors": []
}
```

### Example 2: Parse with Schema Validation
**Input:**
```json
{
  "json_string": "{\"name\": \"Bob\"}",
  "schema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "age": {"type": "number"}
    },
    "required": ["name", "age"]
  }
}
```

**Output:**
```json
{
  "data": {
    "name": "Bob"
  },
  "valid": false,
  "errors": [
    "Missing required property: age"
  ]
}
```

## Usage Instructions
1. 准备 JSON 字符串
2. （可选）定义 JSON Schema 用于验证
3. 决定是否启用严格模式
4. 调用 data_parse_json 技能
5. 检查 valid 字段确认数据有效性
6. 如果验证失败，查看 errors 了解具体问题

## Related Skills
- data_transform: 数据转换
- web_fetch: 获取网页内容
