# data_transform

## Description
对数据进行转换、映射和格式化，支持多种数据格式之间的转换。

## Category
data

## Parameters

### data (required)
- Type: any
- Description: 需要转换的源数据

### transform (required)
- Type: object
- Description: 转换规则定义，包含字段映射和转换函数

### output_format (optional)
- Type: string
- Description: 输出格式
- Allowed values: json, csv, xml, yaml
- Default: json

## Returns
返回包含以下字段的对象：
- `result`: 转换后的数据
- `format`: 输出格式
- `changes`: 应用的转换操作列表

## Example Usage

### Example 1: Field Mapping
**Input:**
```json
{
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "yearsOld": 30
  },
  "transform": {
    "name": "{{firstName}} {{lastName}}",
    "age": "{{yearsOld}}"
  },
  "output_format": "json"
}
```

**Output:**
```json
{
  "result": {
    "name": "John Doe",
    "age": 30
  },
  "format": "json",
  "changes": [
    "Combined firstName and lastName into name",
    "Renamed yearsOld to age"
  ]
}
```

### Example 2: Format Conversion
**Input:**
```json
{
  "data": [
    {"name": "Alice", "score": 95},
    {"name": "Bob", "score": 87}
  ],
  "transform": {},
  "output_format": "csv"
}
```

**Output:**
```json
{
  "result": "name,score\\nAlice,95\\nBob,87",
  "format": "csv",
  "changes": [
    "Converted from JSON to CSV format"
  ]
}
```

## Usage Instructions
1. 准备源数据
2. 定义转换规则（字段映射、计算等）
3. 选择输出格式
4. 调用 data_transform 技能
5. 使用转换后的数据

## Related Skills
- data_parse_json: JSON 解析
- file_write: 写入文件
